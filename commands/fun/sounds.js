const Discord = require('discord.js');
const helpful = require("../../extends/static/helpful.js")
const database = require("../../extends/static/database.js")
const fetch = require("node-fetch")
let timeout;

module.exports.run = async(client, interaction, member, guild) => {
    if (timeout) clearTimeout(timeout);
    let user = member;
    const exec = interaction["data"]["options"][0]["value"];
    const time = parseInt(interaction["data"]["options"][1]["value"]);
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {content: exec}
        }
    });
    if (interaction["data"]["options"][2] && interaction["data"]["options"][2]["value"]) user = await guild.members.fetch(interaction["data"]["options"][2]["value"]);
    await new Promise(async resolve => {
        const connection = await user.voice.channel.join()
        connection.play(`./assets/${exec}.mp3`, {volume : 0.6});
        timeout = setTimeout(async() => {
            await user.voice.channel.leave()
        }, time);
        timeout = setTimeout(async() => {
            resolve(true);
        }, time+200);
    })
}

module.exports.help = {
    "name": "sounds",
    "description": "Music !",
    "options": [
        {
            "name": "son",
            "description": "Choisis ton son",
            "type": 3,
            "required": true,
        },
        {
            "name": "temps",
            "description": "Choisis ton temps",
            "type": 3,
            "required": true,
        },
        {
            "name": "Membre",
            "description": "Faites chier vos amis",
            "type": 6,
            "required": false
        }
    ]
}
