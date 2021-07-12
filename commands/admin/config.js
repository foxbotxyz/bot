const Discord = require('discord.js');
const fs = require('fs');
const helpful = require("../../extends/static/helpful.js")
const lang = require("../../extends/static/lang.js")
const database = require("../../extends/static/database.js")
const uniqid = require('uniqid');

module.exports.run = async(client, interaction, member, guild) => {
    await helpful.loadingInteraction(interaction, client)
    if (member.hasPermission('ADMINISTRATOR')) {
        const exec = interaction["data"]["options"][0].value
        if (exec === "lang") {
            const connect = await database.connect();
            await new Promise(async dbAction => {
                const db = await connect.db(`servConfig`);
                db.collection(guild.id).findOne({name: "interaction"}, async (err, result) => {
                    if (!result) {
                        await db.collection(guild.id).insertOne({name: "interaction", interaction: interaction.token});
                        dbAction()
                    } else {
                        let values = {$set: {interaction: interaction.token}};
                        db.collection(guild.id).updateOne({name: "interaction"}, values, () => {
                            dbAction()
                        });
                    }
                })
            })
            connect.closing(connect);
            helpful.updateInteraction(interaction["token"], {
                "content": "Please choose your language",
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 3,
                                "custom_id": "lang",
                                "options": await lang.getAllLang(),
                                "placeholder": "Please choose your language",
                                "min_values": 1,
                                "max_values": 1
                            }
                        ]
                    }
                ]
            }, client)
        }
    } else {
        helpful.updateInteraction(interaction["token"], {embeds: [helpful.errorEmbed(`Permission denied, you need to have the permission "ADMINISTRATOR".`, client)]}, client)
    }
};

module.exports.help = {
    "name": "config",
    "description": "Enable FoxBot on your server",
    "options": [
        {
            "name": "type",
            "description": "What do you want to config ?",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Language",
                    "value": "lang"
                },
            ]
        }
    ],
    "default_permission": true,
};