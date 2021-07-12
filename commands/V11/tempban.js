const Discord = require('discord.js');
const fs = require('fs');


module.exports.run = async(client, message, args, getDate, text, access) => {
	var author = message.guild.members.get(message.author.id);
	if (access(rolesAccess)) {
		fs.readFile("./data/players/"+args[0]+".json", function(err, result) {
			if (err) {
				var errorEmbed = new Discord.RichEmbed();
				errorEmbed.setColor(`#db4536`);
				errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
				errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
				errorEmbed.setDescription(`Personne non présente dans la base de donnée.`);
				errorEmbed.addField('Commande :', `     !tempban`, false);
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
			if (args[0]) {
				if (args[0].startsWith('<@') && args[0].endsWith('>')) {
					args[0] = args[0].slice(2, -1);
					if (args[0].startsWith('!')) args[0] = args[0].slice(1);
				}
			}

			var actionDate = null;
			var reason = "";
			var punishment = null;
			var duration = null;
			var roles = [];
			if (!theGuildUser) {
				var errorEmbed = new Discord.RichEmbed();
				errorEmbed.setColor(`#db4536`);
				errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
				errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
				errorEmbed.setDescription(`Personne non présente sur le serveur.`);
				errorEmbed.addField('Commande :', `     !tempban`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				return message.channel.send(errorEmbed)
			}
			if (args[2]) {
				if (args[1]) {
					if (args[1].endsWith("h") || args[1].endsWith("d") || args[1].endsWith("y") || args[1].endsWith("m")) {
						args[1] = args[1].toLowerCase()
						if (args[1].includes(`h`)) {
							args[1] = args[1].split(`h`).join(``);
							if (args[1] == 1) duration = args[1]+" heure"
							else duration = args[1]+" heures"
							addTiming = 3600*args[1]
						} else if (args[1].includes(`d`)) {
							args[1] = args[1].split(`d`).join(``);
							if (args[1] == 1) duration = args[1]+" jour"
							else duration = args[1]+" jours"
							addTiming = 86400*args[1]
						} else if (args[1].includes(`y`)) {
							args[1] = args[1].split(`y`).join(``);
							if (args[1] == 1) duration = args[1]+" année"
							else duration = args[1]+" années"
							addTiming = 31536000*args[1]
						} else if (args[1].includes(`m`)) {
							args[1] = args[1].split(`m`).join(``);
							if (args[1] == 1) duration = args[1]+" minute"
							else duration = args[1]+" minutes"
							addTiming = 60*args[1]
						}
					}
				} else {
					var errorEmbed = new Discord.RichEmbed();
					errorEmbed.setColor(`#db4536`);
					errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
					errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
					errorEmbed.setDescription(`Merci d'indiquer un temps.`);
					errorEmbed.addField('Commande :', `     !tempban`, false);
					errorEmbed.setFooter(`Oscar | Modération`);
					errorEmbed.setTimestamp();
					return message.channel.send(errorEmbed)
				}
				var now = new Date(((new Date().getTime()/1000)+7200)*1000)
				console.log(now)
				var newDate = new Date((((new Date().getTime()/1000)+7200)+addTiming)*1000)
				var punishDate = {
					"actionDate": {
						"date": getDateInfo(now)+" à "+getTimeInfo(now),
						"timestamp": now.getTime()
					},
					"finishDate" : {
						"date": getDateInfo(newDate)+" à "+getTimeInfo(newDate),
						"timestamp": newDate.getTime()
					},
					"duration": duration
				}
				var punisher = {
					"punisherID": message.author.id,
					"punisherDisplay": message.guild.members.get(message.author.id).displayName
				}
				for (var i = 2; i < args.length; i++) {
					let focus = args[i]
					if (i == args.length-1) reason += focus
					else reason += focus+" "
				}
				fs.readFile("./data/config.json", function(err, result) {
					var config = JSON.parse(result);
					punishment = {"type": "tempban", "ID":config.infractionID++, "status":"In progress", "punisher":punisher, punishDate, "reason": reason}
					config.infractionID = config.infractionID++
					fs.writeFile("./data/config.json", JSON.stringify(config), err => {
						if (err) throw err;
					})
					var embedAction = new Discord.RichEmbed();
					embedAction.setColor(`#c30020`);
					embedAction.setTitle(`Modération | Oscar-RolePlay`);
					embedAction.setDescription(`Une sanction vient d'être appliquée à votre égard sur le Discord d'Oscar-RolePlay`);
					embedAction.addField('Action : ', punishment.type, true);
					embedAction.addField('Durée : ', punishment.punishDate.duration, true);
					embedAction.addField(`Identifiant de l'Action : `, punishment.ID, true);
					embedAction.addField(`Date de fin de la sanction : `, punishment.punishDate.finishDate.date, false);
					embedAction.addField(`Raison : `, punishment.reason, false);
					embedAction.setFooter(`Pour toute plainte/contestation, merci de vous rendre sur le Forum (oscar-rp.fr) en renseignant l'identifiant de l'action`);
					embedAction.setTimestamp();
					theGuildUser.send(embedAction).then(async(msg) => {
						theGuildUser.ban({ days: 7, reason: punishment.reason})
					})
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
				errorEmbed.addField('Commande :', `     !tempban`, false);
				errorEmbed.addField('Rôles possèdant la permission :', `»   <@&616963031032922113>\n»   <@&617494698013097991>`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				errorEmbed.setTimestamp();
				message.channel.send(errorEmbed)
			}

		})
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
	name: "tempban"
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
