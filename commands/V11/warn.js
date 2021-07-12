const Discord = require('discord.js');
const fs = require('fs');
const rolesAccess = [
	`616963031032922113`,
	`617494698013097991`,
    `713494249882124338`
]

function IsJsonString(str) { try { JSON.stringify(str); } catch (e) { console.log(e); return false; } return true; }

module.exports.run = async(client, message, args, getDate, text, access) => {
	const author = message.guild.members.get(message.author.id);
	if (access(rolesAccess)) {
		fs.readFile("./data/players/"+args[0]+".json", function(err, result) {
			if (err) {
				var errorEmbed = new Discord.RichEmbed();
				errorEmbed.setColor(`#db4536`);
				errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
				errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
				errorEmbed.setDescription(`Personne non présente dans la base de donnée.`);
				errorEmbed.addField('Commande :', `     !warn`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				return message.channel.send(errorEmbed)
			}
			var user = JSON.parse(result);
			var theUser = null;
			var theGuildUser = message.guild.members.get(args[0]);
			var addTiming = null;
			var localizationItem = null;
			var channel = message.channel;

			var actionDate = null;
			var reason = "";
			var punishment = null;
			var duration = null;
			var roles = [];

			if (args[0]) {
				if (args[0].startsWith('<@') && args[0].endsWith('>')) {
					args[0] = args[0].slice(2, -1);
					if (args[0].startsWith('!')) args[0] = args[0].slice(1);
				}
			}

			if (!theGuildUser) {
				var errorEmbed = new Discord.RichEmbed();
				errorEmbed.setColor(`#db4536`);
				errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
				errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
				errorEmbed.setDescription(`Personne non présente sur le serveur.`);
				errorEmbed.addField('Commande :', `     !warn`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				return message.channel.send(errorEmbed)
			}
			if (args[2]) {
				var now = new Date(((new Date().getTime()/1000)+7200)*1000)
				var punishDate = {
					"actionDate": {
						"date": getDateInfo(now)+" à "+getTimeInfo(now),
						"timestamp": now.getTime()
					},
				}
				var punisher = {
					"punisherID": message.author.id,
					"punisherDisplay": message.guild.members.get(message.author.id).displayName
				}
				for (var i = 1; i < args.length; i++) {
					let focus = args[i]
					if (i == args.length-1) reason += focus
					else reason += focus+" "
				}
				fs.readFile("./data/config.json", function(err, result) {
					const config = JSON.parse(result);
					punishment = {"type": "warn", "ID":config.infractionID++, "status":"warned", "punisher":punisher, punishDate, "reason": reason}
					config.infractionID = config.infractionID++
					fs.writeFile("./data/config.json", JSON.stringify(config), err => {
						if (err) throw err;
					})
					var embedAction = new Discord.RichEmbed();
					embedAction.setColor(`#c30020`);
					embedAction.setTitle(`Modération | Oscar-RolePlay`);
					embedAction.setDescription(`Une sanction vient d'être appliquée à votre égard sur le Discord d'Oscar-RolePlay`);
					embedAction.addField('Action : ', punishment.type, true);
					embedAction.addField(`Identifiant de l'Action : `, punishment.ID, true);
					embedAction.addField(`Raison : `, punishment.reason, false);
					embedAction.setFooter(`Pour toute plainte/contestation, merci de vous rendre sur le Forum (oscar-rp.fr) en renseignant l'identifiant de l'action`);
					embedAction.setTimestamp();
					embedAction.setColor(`#212121`);
					embedAction.setDescription(`Une sanction vient d'être appliquée sur le Discord d'Oscar-RolePlay`);
					embedAction.addField(`Joueur : `, theGuildUser.displayName+" ("+theGuildUser.id+")", false);
					embedAction.setFooter(`Oscar | Modération`);
					embedAction.setTimestamp();
					channel.send(embedAction)
					user.punishments.push(punishment)
					fs.writeFile("./data/players/"+args[0]+".json", JSON.stringify(user), err => {
						if (err) throw err;
					})

				})
			} else {
				var errorEmbed = new Discord.RichEmbed();
				errorEmbed.setColor(`#db4536`);
				errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
				errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
				errorEmbed.setDescription(`Vous n'avez pas mis de raison.`);
				errorEmbed.addField('Commande :', `		!warn`, false);
				errorEmbed.addField('Rôles possèdant la permission :', `»   <@&616963031032922113>\n»   <@&617494698013097991>`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				errorEmbed.setTimestamp();
				message.channel.send(errorEmbed)
			}

		})
	} else {
		message.delete()
		var embed = new Discord.RichEmbed();
			embed.setColor(`#db4536`);
			embed.setTitle(`Erreur durant l'exécution de la commande`);
			embed.setDescription(`Vous ne possédez pas la permission nécessaire.`);
			var roles = "";
			for (var i = 0; i < rolesAccess.length; i++) {
				let focus = rolesAccess[i];
				roles += `**»** <@&${focus}>\n`;
			}
			embed.addField('Rôles possèdant la permission :', roles, false);
			embed.setFooter(message.author.id);
			embed.setTimestamp();
			return message.channel.send(embed);
	}

};

module.exports.help = {
	name: "warn"
}

function getDateInfo(ts) {
	var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septempbre", "Octobre", "Novembre", ];
	var days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
	var month = months[ts.getMonth()];
	var day = days[ts.getDay()];
	var daynb = ts.getDate();
	var year = ts.getFullYear();

	return day+" "+daynb+" "+month+" "+year
}
function getTimeInfo(time) {
	var hour = time.getHours();
	var min = time.getMinutes();
	var sec = time.getSeconds();
	if (hour == 25) hour = 23;
	if (hour == 26) hour = 0;
	heure = (hour > 9? hour:"0" + hour);
	heure += ":" + (min > 9? min:"0" + min);
	heure += ":" + (sec > 9? sec:"0" + sec);
	return heure;
}
