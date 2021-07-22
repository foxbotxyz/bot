const Discord = require('discord.js');
const fs = require('fs');
const helpful = require("../../extends/static/helpful.js")
const lang = require("../../extends/static/lang.js")
const database = require("../../extends/static/database.js")
const uniqid = require('uniqid');

module.exports.run = async(client, interaction, member, guild) => {
	let userid = interaction["data"]["options"][0].value;
	const reason = interaction["data"]["options"][1].value;
	await helpful.loadingInteraction(interaction, client)
	const usedLang = await lang.getLang(guild.id)
	if (member.hasPermission('KICK_MEMBERS')) {
		let ping = Date.now();
		let user = await guild.members.fetch(userid);
		if (user) {
			if (user.kickable) {
				const punish = {actionDate: Date.now()};
				punish["type"] = "kick";
				punish["punisher"] = member.id;
				punish["reason"] = reason;
				punish["id"] = await uniqid("p")
				let embed = new Discord.MessageEmbed();
				embed.setColor(`#ff0000`);
				embed.setTitle(`Mod | ${guild.name}`);
				embed.setDescription(`${await lang.getText("mod kickUser", usedLang)} <@${user.id}> *(${user.id})*`)
				embed.addField(`» ${await lang.getText("other reason", usedLang)} :`, `- ${punish["reason"]}`);
				embed.setTimestamp();
				await helpful.updateInteraction(interaction["token"], {embeds: [embed]}, client)
				embed.setDescription(`${await lang.getText("mod receivePunish", usedLang)} ${guild.name}`);
				embed.addField(`Action type :`, `- ${punish["type"]}`, true);
				embed.addField(`${await lang.getText("mod punishment", usedLang)} ID :`, `- ${punish["id"]}`, true);
				await user.send(embed);
				await user.kick(punish["reason"])
				const connect = await database.connect();
				await new Promise(async dbAction => {
					const db = await connect.db(`punishments`);
					db.collection(guild.id).findOne({id: user.id, guild: guild.id}, async (err, result) => {
						if (!result) {
							await db.collection(guild.id).insertOne({id: user.id, guild: guild.id, array: [punish]});
							dbAction()
						} else {
							await result["array"].push(punish)
							let values = {$set: {array: result["array"]}};
							db.collection(guild.id).updateOne({id: user.id, guild: guild.id}, values, () => {
								dbAction()
							});
						}
					})
				})
				connect.closing(connect);
				console.log(`Kick command take ${Date.now() - ping}ms to finish`)
			} else {
				let embed = new Discord.MessageEmbed()
				embed.setTitle(`Mod | ${guild.name}`);
				embed.setColor(`#ff0000`);
				embed.setDescription(await lang.getText("mod userAbove", usedLang));
				embed.setTimestamp();
				await helpful.updateInteraction(interaction["token"], {embeds: [embed]}, client)
			}
		} else
			helpful.updateInteraction(interaction["token"], {content: `**${await lang.getText("mod cantFind", usedLang)}**`}, client)
	} else {
		helpful.updateInteraction(interaction["token"], {embeds: [helpful.errorEmbed(`${await lang.getText("mod noPerm", usedLang)} "KICK_MEMBERS".`, client)]}, client)
	}
};

module.exports.help = async function(lname){
	return {
		"name": "kick",
		"description": await lang.getText("mod kickDesc", lname),
		"options": [
			{
				"name": (await lang.getText("other user", lname)).toLowerCase(),
				"description": await lang.getText("mod whoKick", lname),
				"type": 6,
				"required": true,
			},
			{
				"name": (await lang.getText("other reason", lname)).toLowerCase(),
				"description": await lang.getText("mod indicReason", lname),
				"type": 3,
				"required": true,
			}
		],
		"default_permission": true,
	}
};