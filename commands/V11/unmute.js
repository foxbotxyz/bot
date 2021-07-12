const Discord = require('discord.js');
const fs = require('fs');


module.exports.run = async(client, message, args, getDate, text, access) => {
	const author = message.guild.members.get(message.author.id);
	if (access(rolesAccess)) {
		fs.readFile("./data/players/"+args[0]+".json", function(err, result) {
			var user = JSON.parse(result);
			var theGuildUser = message.guild.members.get(args[0])
			var thePunishment = null;
			var addTiming = null;
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
				errorEmbed.addField('Commande :', `     !unmute`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				return message.channel.send(errorEmbed)
			}
			for (var a = 0; a < user.punishments.length; a++) {
				if (user.punishments[a].type == "mute" && user.punishments[a].status == "In progress") {
					thePunishment = user.punishments[a]
					user.punishments[a].status = "deleted"
					fs.writeFile("./data/players/"+args[0]+".json", JSON.stringify(user), err => {
						if (err) throw err;
					})
					var roleList = []
					for (var b = 0; b < thePunishment.roles.length; b++) {
						if (theGuildUser.roles.find(r => r.id === thePunishment.roles[b].roleID) == null) {
							role.push(thePunishment.roles[b].roleID)
						}
					}
					console.log("Réduction au silence terminée : "+theGuildUser.displayName)
					console.log(role)
					theGuildUser.addRoles(role).then(async(then) => {
						theGuildUser.removeRole("617476535326212127")
					})
					theGuildUser.removeRole("617476535326212127")
					var checkEmbed = new Discord.RichEmbed();
					checkEmbed.setColor(`#1ed760`);
					checkEmbed.setTitle(`Modération | Oscar-RolePlay`);
					checkEmbed.setDescription(`Une sanction vient d'être terminée sur le Discord d'Oscar-RolePlay`);
					checkEmbed.addField('Action : ', thePunishment.type, true);
					checkEmbed.addField(`Identifiant de l'Action : `, thePunishment.ID, true);
					checkEmbed.addField(`Raison : `, thePunishment.reason, false);
					checkEmbed.setFooter(`Pour toute plainte/contestation, merci de vous rendre sur le Forum (oscar-rp.fr) en renseignant l'identifiant de l'action`);
					checkEmbed.setTimestamp();
					theGuildUser.send(checkEmbed)
					checkEmbed = new Discord.RichEmbed();
					checkEmbed.setColor(`#99c794`);
					checkEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
					checkEmbed.setTitle(`Commande terminée avec succès`);
					checkEmbed.setDescription(`La personne n'est plus réduit au silence.`)
					checkEmbed.addField('Joueur :', user.tag+" - "+user.id, false);;
					checkEmbed.setFooter(`Oscar | Modération`);
					checkEmbed.setTimestamp();
					return message.channel.send(checkEmbed)
				}
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
	name: "unmute"
}
