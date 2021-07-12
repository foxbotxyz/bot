const Discord = require('discord.js');
const fs = require('fs');
const rolesAccess = [
	`617494698013097991`,
	`617494698013097991`,
    `713494249882124338`
]

function IsJsonString(str) { try { JSON.stringify(str); } catch (e) { console.log(e); return false; } return true; }

module.exports.run = async(client, message, args, getDate, text, access) => {
	var author = message.guild.members.get(message.author.id);
	if (access(rolesAccess)) {
        let ban = await message.guild.fetchBans();
        message.guild.fetchBans().then(bans=> {
            if(bans.size == 0) return
            let bUser = bans.get(args[0])
            message.guild.unban(bUser.id).then(result => {
                var embed = new Discord.RichEmbed();
                    embed.setColor(`#00ff20`);
                    embed.setTitle(`Modération | Oscar-RolePlay`);
                    embed.setDescription(`Vous venez de debannir ${bUser.username}#${bUser.discriminator}`);
                    embed.setFooter(`Oscar | Modération`);
                    embed.setTimestamp();
                message.channel.send(embed);
            })
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
	name: "unban"
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
