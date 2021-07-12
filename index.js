//
//                          ┏╋━━━━━━━━━◥◣◆◢◤━━━━━━━━━╋┓
//                               DEPENDENCY IMPORT
//                          ┗╋━━━━━━━━━◢◤◆◥◣━━━━━━━━━╋┛
//

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const fetch = require("node-fetch");


//
//                          ┏╋━━━━━━━━━◥◣◆◢◤━━━━━━━━━╋┓
//                                 HELPFUL CONST
//                          ┗╋━━━━━━━━━◢◤◆◥◣━━━━━━━━━╋┛
//

const helpful = require("./extends/static/helpful.js");
const database = require("./extends/static/database.js");
const lang = require("./extends/static/lang.js");

//
//                          ┏╋━━━━━━━━━◥◣◆◢◤━━━━━━━━━╋┓
//                               BOT INITIALIZATION
//                          ┗╋━━━━━━━━━◢◤◆◥◣━━━━━━━━━╋┛
//

client.login(database.discordKey());

client.commands = new Discord.Collection();

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.stack}`);
})

fs.readdir('./extends/', (error, result) => {
    result.forEach((f) => {
        if (f !== "static") require(`./extends/${f}`)(client, Discord, database, helpful, lang);
    })
});

client.commands = new Discord.Collection();

//
//                          ┏╋━━━━━━━━━◥◣◆◢◤━━━━━━━━━╋┓
//                                   OTHER FILE
//                          ┗╋━━━━━━━━━◢◤◆◥◣━━━━━━━━━╋┛
//


fs.readdir('./commands/', (error, result) => {
    result.forEach((f) => {
        fs.readdir(`./commands/${f}`, (error, response) => {
            response.forEach((a) => {
                let commande = require(`./commands/${f}/${a}`);
                client.commands.set(commande.help.name, commande);
            })
        });
    })
});
fs.readdir('./events/', (error, f) => {
    if (error) console.log('Erreur');
    f.forEach((f) => {
        const events = require(`./events/${f}`);
        const event = f.split('.')[0];
        client.on(event, events.bind(null, client));
    });
});

client.on("message", async message => {
    console.log(`${await database.prefix()}newcmd`)
    if (message.content.startsWith(`${await database.prefix()}newcmd`) && message.author.id === "294423110604685312") {
        const content = message.content.replace(`${await database.prefix()}newcmd `, "");
        let command;
        try {
            command = require(`./commands/${content}.js`)
        }
        catch (e) {
            message.channel.send(`Commande non trouvé`)
        }
        if (command) {
            client.commands.set(command.help.name, command);
            console.log(`Ajout de la commande nommé ${command.help.name} au publique`)
            console.log(command.help)
            client.api.applications(client.user.id).commands.post({ data: command.help});
            message.channel.send(`Ajout de la commande ${command.help.name} fait :)`)
        }

    } else if (message.content.startsWith(`${await database.prefix()}updatecmd`) && message.author.id === "294423110604685312") {
        const content = message.content.replace(`${await database.prefix()}updatecmd `, "");
        let command;
        try {
            command = require(`./commands/${content}.js`)
        }
        catch (e) {
            message.channel.send(`Commande non trouvé`)
        }
        if (command) {
            client.commands.set(command.help.name, command);
            console.log(`Ajout de la commande nommé ${command.help.name} en local`)
            await client.api.applications(client.user.id).guilds("770724998993281074").commands.post({ data: command.help})
            message.channel.send(`Ajout de la commande ${command.help.name} fait :)`)
        }
    }
})

client.ws.on(`INTERACTION_CREATE`, async(interaction) => {
    if (interaction["type"] !== 3) {
        const cmd = client.commands.get(interaction["data"]["name"]);
        client.guilds.fetch(interaction["guild_id"]).then(async guild => {
            guild.members.fetch(interaction["member"]["user"]["id"]).then(async member => {
                cmd.run(client, interaction, member, guild)
            })
        })
    }
})


client.on('guildCreate', guild => {
    database.connectDB(client, "verif message").then(connect => {
        new Promise(databaseConnect => {
            const db = connect.db(guild.id);
        })
    })
})

client.on("message", async message => {
    if (message.content.startsWith(`${await database.prefix()}ping`)) {
        const ping = Date.now() - message.createdTimestamp;

        let pinglang = Date.now();
        await lang.getText("other ping", "en-GB");
        pinglang = Date.now() - pinglang;

        let pingdb = Date.now();
        await lang.getLang(message.guild.id);
        pingdb = Date.now() - pingdb;

        const embed = new Discord.MessageEmbed();
        let text = ""
        if (ping > 750) text += `🏓 Your latency with the server is **${ping}ms** (bad)\n`; // Ping with Server
        else if (ping > 400) text += `🏓 Your latency with the server is **${ping}ms** (normal)\n`;
        else text += `🏓 Your latency with the server is **${ping}ms** (good)\n`;
        if (pinglang > 750) text += `🏓 Your latency with the lang system is **${pinglang}ms** (bad)\n`; // Ping with lang
        else if (pinglang > 400) text +=`🏓 Your latency with the lang system is **${pinglang}ms** (normal)\n`;
        else text += `🏓 Your latency with the lang system is **${pinglang}ms** (good)\n`;
        if (pingdb > 1250) text += `🏓 Your latency with the DB is **${pingdb}ms** (bad)`; // Ping with DB
        else if (pingdb > 800) text +=`🏓 Your latency with the DB is **${pingdb}ms** (normal)`;
        else text += `🏓 Your latency with the DB is **${pingdb}ms** (good)`;
        embed.setDescription(text);
        await message.channel.send(embed)
    }
})