const Discord = require('discord.js');
const helpful = require("../../extends/static/helpful.js")
const database = require("../../extends/static/database.js")
const fetch = require("node-fetch")

module.exports.run = async(client, interaction, member, guild) => {
    let user = member;
    if (interaction["data"]["options"] && interaction["data"]["options"][0]["value"]) user = await guild.members.fetch(interaction["data"]["options"][0]["value"]);
    for (let i = 0; i < 1; i++) {
        await new Promise(async resolve => {
            const connection = await user.voice.channel.join()
            connection.play('./assets/oof.mp3', {volume : 0.6});
            setTimeout(async() => {
                await user.voice.channel.leave()
            }, 1000);
            setTimeout(async() => {
                resolve(true);
            }, 1200);
        })
    }
    await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {content: "oof!"}
        }
    });
}

module.exports.help = {
    "name": "oof",
    "description": "OOF !",
    dev: true,
    "options": [
        { 
            "name": "Membre",
            "description": "Faites chier vos amis",
            "type": 6,
            "required": false
        }
    ]
}
