const Discord = require('discord.js');
const fs = require('fs');
const rolesAccess = [
	`617494698013097991`,
	`617494698013097991`,
    `713494249882124338`
]

module.exports.run = async(client, message, args, getDate, text, access) => {
	const author = message.guild.members.get(message.author.id);
	if (access(rolesAccess)) {
		fs.readdir('./data/players', (error, f) => {
			if (error) console.log('Erreur');
			if (args[0]) {
				if (args[0].startsWith('<@') && args[0].endsWith('>')) {
					args[0] = args[0].slice(2, -1);
					if (args[0].startsWith('!')) args[0] = args[0].slice(1);
				}
			}
			var check = false;
			f.forEach((f) => {
				fs.readFile("./data/players/"+f, function(err, result) {
					var user = JSON.parse(result);
					var embedSearch = new Discord.RichEmbed();
					for (var a = 0; a < user.punishments.length; a++) {
						let focusPunish = user.punishments[a]
						if (focusPunish.ID == args[0]) {
							embedSearch.setColor(`#212121`);
							embedSearch.addField("Type :", focusPunish.type, true)
							embedSearch.addField("Status :", focusPunish.status, true)
							embedSearch.addField("Identifiant :", focusPunish.ID, true)
							if (focusPunish.punishDate.duration) embedSearch.addField("Durée de l'Action :", focusPunish.punishDate.duration, false)
							if (focusPunish.punishDate.finishDate) embedSearch.addField("Date de fin de l'Action :", focusPunish.punishDate.finishDate.date, false)
							embedSearch.addField("Sanctionneur :", focusPunish.punisher.punisherDisplay+" - "+focusPunish.punisher.punisherID, false)
							embedSearch.addField("Victime :", user.tag+" - "+user.id, false)
							embedSearch.addField("Date de mise en place :", focusPunish.punishDate.actionDate.date, false)
							embedSearch.addField("Raison de l'Action :", focusPunish.reason, false)
							embedSearch.setFooter(`Oscar | Modération`);
							embedSearch.setTimestamp();
							check = true;
							return message.channel.send(embedSearch)
						}
					}
				})
			});
		});

	} else {
		var errorEmbed = new Discord.RichEmbed();
		errorEmbed.setColor(`#db4536`);
		errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
		errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
		errorEmbed.setDescription(`Vous ne possédez pas la permission nécessaire.`);
		errorEmbed.addField('Rôles possèdant la permission :', `»   <@&616963031032922113>\n»   <@&617494698013097991>`, false);
		errorEmbed.setFooter(`Oscar | Modération`);
		errorEmbed.setTimestamp();
		errorEmbed.setTimestamp();
		message.channel.send(errorEmbed)
	}

};

module.exports.help = {
	name: "punishinfo"
}
