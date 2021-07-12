const Discord = require('discord.js');
const fs = require('fs');
const helpful = require("../../extends/static/helpful.js")
const lang = require("../../extends/static/lang.js")
const database = require("../../extends/static/database.js")
const uniqid = require('uniqid');

module.exports.run = async(client, interaction, member, guild) => {
	let userid = interaction["data"]["options"][0].value;
	await helpful.loadingInteraction(interaction, client)
	const usedLang = await lang.getLang(guild.id)
	let user = await guild.members.fetch(userid);
	if (user) {
		const punishments = await new Promise(async punish => {
			const connect = await database.connect();
			const db = await connect.db(`punishments`);
			db.collection(guild.id).findOne({id: user.id}, async (err, result) => {
				if (result) {
					punish(result)
				}
			})
		})
		const embed = new Discord.MessageEmbed();
		embed.setTitle(`Mod | ${guild.name}`);
		embed.setColor(`#ff0000`);
		embed.setTimestamp();
		for (const punish of punishments["array"]) {
			embed.addField(`${punish["id"]}`, `**${punish["type"]}** - ${punish["reason"]}\n Made at : ${await helpful.converDateENnb(punish["actionDate"])}\n`);
		}
		helpful.updateInteraction(interaction["token"], {embeds: [embed]}, client)
	} else helpful.updateInteraction(interaction["token"], {content: `**${await lang.getText("mod cantFind", usedLang)}**`}, client)
};

module.exports.help = {
	"name": "search",
	"description": "Search informations about a user",
	"options": [
		{
			"name": "user",
			"description": "Who do you want check ?",
			"type": 6,
			"required": true,
		}
	],
	"default_permission": true,
};