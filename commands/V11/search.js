const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async(client, message, args, getDate, text, access) => {
	const author = message.guild.members.get(message.author.id);
	if (access(rolesAccess)) {
		if (args[0]) {
			if (args[0].startsWith('<@') && args[0].endsWith('>')) {
				args[0] = args[0].slice(2, -1);
				if (args[0].startsWith('!')) args[0] = args[0].slice(1);
			}
		}
		fs.readFile("./data/players/"+args[0]+".json", function(err, result) {
			if (err) {
				var errorEmbed = new Discord.RichEmbed();
				errorEmbed.setColor(`#db4536`);
				errorEmbed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
				errorEmbed.setTitle(`Erreur durant l'exécution de la commande`);
				errorEmbed.setDescription(`Personne non présente dans la base de donnée.`);
				errorEmbed.addField('Commande :', `     !search`, false);
				errorEmbed.setFooter(`Oscar | Modération`);
				errorEmbed.setTimestamp();
				return message.channel.send(errorEmbed)
			}
			var user = JSON.parse(result);
			var theUser = null;
			var theGuildUser = null;
			var embedSearch = new Discord.RichEmbed();
			embedSearch.setColor(`#212121`);
			embedSearch.setTitle(`Modération | Oscar-RolePlay`);
			embedSearch.setDescription(`Toutes les sanctions de <@`+args[0]+">");
			for (var a = 0; a < user.punishments.length; a++) {
				embedSearch.addField("**"+user.punishments[a].type+" - **"+user.punishments[a].reason, "Crée le : "+user.punishments[a].punishDate.actionDate.date+"\nStatus : "+user.punishments[a].status+"\nID : "+user.punishments[a].ID, false);
			}
			message.channel.send(embedSearch)
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
	name: "search"
}
