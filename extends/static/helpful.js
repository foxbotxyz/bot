const Discord = require('discord.js');
const Canvas = require('canvas');
const database = require("./database.js")
const request = require('request');
const fetch = require('node-fetch');
const errorMessages = [
    "**Selon mes petits papiers tu n'as pas l'autorisation de faire ça.**",
    "**Mais dis-donc qu'est-ce que tu essayes la ?**",
    "**Tu ne possèdes pas la permission pour faire ça.**",
    "**Désolé mais tu n'iras pas plus loin.**"
];
const RANKLEVEL = [
    "706285906361057300",
    "710079561945317377",
    "717829160000553102",
    "710080273336762438",
    "710080488773124197",
    "717829582635663432",
    "710080658315149332",
    "717829888773455872",
    "717830252960809062",
    "710080743338147862",
    "710081022582063144",
    "710080830353047582",
    "710081211804024852"
]
module.exports = {
    wait: async function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    emoji:  function(id, client) {
        if (client.emojis) return client.emojis.cache.get(id);
    },
    errorMSG: function(client) {
        const embed = new Discord.MessageEmbed();
        embed.setColor(`#fb5c61`);
        embed.setDescription(`${client.emojis.cache.get("710569539112271913")} ${errorMessages[Math.floor(Math.random() * errorMessages.length)]}`);
        return embed;
    },
    errorEmbed(reason, client) {
        const embed = new Discord.MessageEmbed();
        embed.setColor(`#fb5c61`);
        embed.setDescription(`${client.emojis.cache.get("863538375318831115")} **${reason}**`);
        return embed;
    },
    rankLevel: function () {
        return RANKLEVEL;
    },
    convetDateEN: function(time) {
        const date = new Date(time);
        const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let hour = date.getHours();
        let min = date.getMinutes();
        let heure = (hour > 9 ? hour : "0" + hour);
        heure += "h" + (min > 9? min:"0" + min);
        return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} at ${heure} UTC+2`;
    },
    converDateENnb: function(time) {
        const date = new Date(time);
        let day = date.getDate();
        let final = (day > 9 ? day : "0" + day);

        let month = date.getMonth();
        final += "/" + (month > 9? month:"0" + month);

        let year = date.getFullYear();
        final += `/${date.getFullYear()}`;

        let hours = date.getHours();
        final += " " + (hours > 9? hours:"0" + hours);

        let min = date.getMinutes();
        final += ":" + (min > 9? min:"0" + min);

        return `${final} UTC+2`;
    },
    dateMaj: function(date) {
        date = new Date(((Date.now()/1000)+3600)*1000)
        const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septempbre", "Octobre", "Novembre", "Décembre"];
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    access: function(client, accessRoles, interaction) {
        let pass = false;
        let roleAccess = "";
        return new Promise(resolve => {
            database.connectDB(client, "access system").then(connect => {
                if (connect === "error") return helpful.customError(client, "Une erreur est survenu lors de la connexion à la base de donnée : Varification du niveau d'accès");
                if (interaction["member"]["id"] === "294423110604685312") resolve(true);
                new Promise(mongodb => {
                    const db = connect.db(interaction["guild_id"]);
                    db.collection("Permissions").findOne({name: accessRoles}, async (err, result) => {
                        if (result) {
                            let roles = result["roles"];
                            for (let i = 0; i < roles.length; i++) {
                                if (interaction["member"]["roles"].includes(roles[i])) pass = true;
                                roleAccess += `- <@&${roles[i]}>\n`
                            }
                            if (pass === false) {
                                mongodb(pass);
                                const messages = [
                                    "**Selon mes petits papiers tu n'as pas l'autorisation de faire ça.**",
                                    "**Mais dis-donc qu'est-ce que tu essayes la ? (Permission dénier)**",
                                    "**Tu ne possèdes pas la permission pour faire ça. (Permission dénier)**",
                                    "**Désolé mais tu n'iras pas plus loin. (Permission dénier)**"
                                ];
                                const embed = new Discord.MessageEmbed();
                                embed.setColor(`#fb5c61`);
                                embed.setDescription(`${client.emojis.cache.get("710569539112271913")} ${messages[Math.floor(Math.random() * messages.length)]}`);
                                embed.addField(`**» Permission agréée :**`, `- ${accessRoles}`)
                                embed.addField(`**» Rôles agrées :**`, roleAccess)
                                // noinspection JSUnresolvedFunction
                                await connect.close()
                                await client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {embeds: [embed]}
                                    }
                                });
                            } else {
                                mongodb(pass);
                            }
                        } else {
                            mongodb("empty")
                        }
                    })
                }).then(async pass => {
                    await connect.closing(connect, "Access command", client);
                    resolve(pass)
                })
            })
        })
    },
    error: function(client, text) {
        const embed = new Discord.MessageEmbed();
        embed.setColor(`#e74c3c`);
        embed.setDescription(`${client.emojis.cache.get("710569539112271913")} **${text}**`);
        return embed;
    },
    customError: function(client, text) {
        client.guilds.fetch("616962092230115338").then(guild => {
            guild.members.fetch("294423110604685312").then(member => {
                const embed = new Discord.MessageEmbed();
                embed.setColor(`#e74c3c`);
                embed.setDescription(`${client.emojis.cache.get("710569539112271913")} **${text}**`);
                member.send(embed);
            })
        })
    },
    dayDate: function(date) {
        return Math.round(((new Date()/1000 - new Date(date/1000)) / (1000 * 60 * 60 * 24))*1000);
    },
    shuffle: function(array) {
        let length = array.length;
        while (length > 0) {
            let index = Math.floor(Math.random() * length);
            length--;
            let temp = array[length];
            array[length] = array[index];
            array[index] = temp;
        }
        return array;
    },
    getGiveawayDate: function(time){
        let d = new Date(time)
        let date = {};
        date["month"] = (d.getMonth()+1) > 9 ? (d.getMonth()+1) : "0" + (d.getMonth()+1);
        date["years"] = d.getFullYear();
        date = `${date["month"]}/${date["years"]}`;
        return date;
    },
    getMonthRank: function(time, nb, db, guild) {
        return new Promise(async rank => {
            let totalTab = [];
            const array = await db.collection("JoueursMessage").findOne({time: module.exports.getGiveawayDate(time)});
            console.log(time)
            let finishObject = {};
            for (const [mainKey] of Object.entries(array.messages)) {
                array.messages[mainKey] = Object.fromEntries(Object.entries(array.messages[mainKey]).sort(([, b], [, a]) => a - b));
                for (const [key, value] of Object.entries(array.messages[mainKey])) {
                    if (finishObject[key]) finishObject[key] = finishObject[key] + value;
                    else finishObject[key] = value;
                }
            }
            finishObject = Object.entries(finishObject).sort(([, a], [, b]) => b - a).reduce((r, [k, v]) => ({...r, [k]: v}), {})
            let userObect = Object.keys(finishObject);
            let iteration = 0;
            let i = 0;
            do {
                let find = true;
                await guild.members.fetch(userObect[iteration]).catch(() => find = false);
                if (find === false) {
                    iteration = iteration + 1;
                    continue;
                }
                totalTab.push(userObect[iteration]);
                iteration = iteration + 1;
                i = i + 1;
            } while (totalTab.length !== nb)
            rank(totalTab);
        })
    },
    deleteOriginal: async(interaction, timing) => {
        if (timing) await sleep(timing);
        return new Promise(async rsl => {
            const options = {
                'method': 'DELETE',
                'url': `https://discord.com/api/v9/webhooks/${interaction["message"]["application_id"]}/${interaction["token"]}/messages/@original`,
                'headers': {
                    'Authorization': `Bot ${await databse.discordKey()}`,
                    'Cookie': '__dcfduid=2d5ea0e1d0e74380ba91b2a2864d4750'
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
            });

        })
    },
    interaction: function(interaction, data, client) {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: data
            }
        });
    },
    loadingInteraction: function(interaction, client) {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 5,
            }
        });
    },
    updateInteraction: function(interaction, data, client) {
        client.api.webhooks(client.user.id, interaction).messages('@original').patch({
            data: data
        });
    },
    deleteInteraction: function(interaction, client) {
        client.api.webhooks(client.user.id, interaction).messages('@original').delete();
    },
    numberWithSpace: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    getSteam64: function(base, client) {
        return new Promise(async steamData => {
            const steamid = await new Promise(async identify => {
                if (base.includes("https://steamcommunity.com/id/")) {
                    base = base.replace("https://steamcommunity.com/id/", "");
                    base = base.replace("/", "");
                    fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1?key=${database.steamKey()}&vanityurl=${base}`).then(async result => {
                        base = await result.json();
                        base = base["response"]["steamid"]
                        identify(base);
                    })
                } else if (base.includes(`https://steamcommunity.com/profiles/`)) {
                    base = base.replace("https://steamcommunity.com/profiles/", "")
                    base = base.replace("/", "")
                    identify(base)
                } else if (base.length === 17) {
                    identify(base)
                } else if (base.includes("STEAM_0")) {
                    let array = base.split(":");
                    let steamid = BigInt(76561197960265728) + (BigInt(array[2]) * BigInt(2))
                    if (array[1] === "1") steamid += BigInt(1);
                    steamid = String(steamid).split("n").join("");
                    identify([steamid]);
                } else {
                    identify("not found")
                }
            })
            const embed = new Discord.MessageEmbed();
            embed.setColor(`#fb5c61`);
            embed.setDescription(`${client.emojis.cache.get("710569539112271913")} **Je trouve pas chef.**`);
            embed.addField(`» N'oublie pas, je prends en charge : `, `- URL de profil Steam\n- SteamID 64\n- SteamID`)
            if (steamid !== "not found") {
                fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${database.steamKey()}&steamids=${steamid}`).then(async result => {
                    result.json().then(async json => {
                        json = json["response"]["players"][0];
                        if (!json) {
                            steamData(["not found", embed]);
                        }
                        if (json["loccountrycode"]) {
                            fetch(`https://restcountries.eu/rest/v2/alpha/${json["loccountrycode"]}`).then(async result => {
                                result.json().then(result => {
                                    json["country"] = `${result["name"]} • ${result["region"]}`;
                                    steamData([steamid, json])
                                })
                            })
                        } else steamData([steamid, json]);
                    })
                })
            } else steamData(["not found", embed]);
        })
    }
};
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}