const Discord = require('discord.js');
const fs = require('fs');
const rolesAccess = [
	`617494698013097991`,
	`617494698013097991`,
    `713494249882124338`
]

module.exports.run = async(client, message, args, getDate, text, access) => {
	var author = message.guild.members.get(message.author.id);
    var access = false;
    for (var i = 0; i < author.roles.array().length; i++) { if (rolesAccess.indexOf(author.roles.array()[i].id) != -1) access = true; }
	if (access === true) {
		if (args[1]) {
            fs.readFile(`./data/players/${args[0]}.json`, function(err, result) {
    			if (err) {
    				var embed = new Discord.RichEmbed();
    				embed.setColor(`#db4536`);
    				embed.setThumbnail("https://i.imgur.com/yCGcVN2.png")
    				embed.setTitle(`Erreur durant l'exécution de la commande`);
    				embed.setDescription(`Personne non présente dans la base de donnée.`);
    				embed.setFooter(`Oscar | Modération`);
    				embed.setTimestamp();
    				return message.channel.send(embed)
    			}
    			var user = JSON.parse(result);
    			var theGuildUser = message.guild.members.get(args[0]);
    			var addTiming = null;
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

                var now = new Date(((new Date().getTime()/1000)+7200)*1000);
                var newDate = new Date((((new Date().getTime()/1000)+7200)+addTiming)*1000);
                var punishDate = {
                    "actionDate": {
                        "date": getDateInfo(now)+" à "+getTimeInfo(now),
                        "timestamp": now.getTime()
                    },
                    "duration": duration
                }
                var punisher = {
                    "punisherID": message.author.id,
                    "punisherDisplay": message.guild.members.get(message.author.id).displayName
                }
                for (var i = 1; i < args.length; i++) {
                    if (args[i].startsWith('<@') && args[i].endsWith('>')) {
                        args[i] = args[i].slice(2, -1);
                        if (args[i].startsWith('!')) args[i] = args[i].slice(1);
                        reason += "<@"+args[i]+"> ";
                    } else {
                        if (i === args.length) reason += args[i];
                        else reason += args[i]+" ";
                    }
                }
                fs.readFile("./data/config.json", function(err, result) {
                    var config = JSON.parse(result);
                    config.infractionID = config.infractionID++;
                    if (theGuildUser) {
                        punishment = {"type": "ban", "ID":config.infractionID++, "status":"Bannissement Actif", "punisher":punisher, punishDate, "reason": reason};
                        var embed = new Discord.RichEmbed();
    						embed.setColor(`#c30020`);
    						embed.setTitle(`Modération | Oscar-RolePlay`);
    						embed.setDescription(`Une sanction vient d'être appliquée à votre égard sur le Discord d'Oscar-RolePlay`);
    						embed.addField('Action : ', punishment.type, true);
    						embed.addField(`Identifiant de l'Action : `, punishment.ID, true);
    						embed.addField(`Raison : `, punishment.reason, false);
    						embed.setFooter(`Pour toute plainte/contestation, merci de vous rendre sur le Forum (oscar-rp.fr) en renseignant l'identifiant de l'action`);
    						embed.setTimestamp();
    						theGuildUser.send(embed).then(async(msg) => { theGuildUser.ban({ days: 7, reason: punishment.reason}) })
    						embed.setDescription(`Une sanction vient d'être appliquée sur le Discord d'Oscar-RolePlay`);
    						embed.addField(`Joueur : `, theGuildUser.displayName+" ("+theGuildUser.id+")", false);
    						embed.setFooter(`Oscar | Modération`);
    						embed.setTimestamp();
    						channel.send(embed)
                        user.punishments.push(punishment)
                        if (IsJsonString(user) === true)  fs.writeFile(`./data/players/${args[0]}.json`, JSON.stringify(user), err => {if (err) throw err;  })
        			} else {
                        punishment = {"type": "ban", "ID":config.infractionID++, "status":"Bannissement en Attente", "punisher":punisher, punishDate, "reason": reason};
                        var embed = new Discord.RichEmbed();
    						embed.setColor(`#c30020`);
    						embed.setTitle(`Modération | Oscar-RolePlay`);
    						embed.addField('Action : ', punishment.type, true);
    						embed.addField(`Identifiant de l'Action : `, punishment.ID, true);
    						embed.addField(`Raison : `, punishment.reason, false);
    						embed.setDescription(`Une sanction vient d'être appliquée sur le Discord d'Oscar-RolePlay\nAttention: La personne n'est pas présente actuellement sur le serveur elle recevera un bannissement si elle revient.`);
    						embed.addField(`Joueur : `,  `${args[0]}`, false);
    						embed.setFooter(`Oscar | Modération`);
    						embed.setTimestamp();
    						channel.send(embed)
                        user.punishments.push(punishment)
                        if (IsJsonString(user) === true) fs.writeFile(`./data/players/${args[0]}.json`, JSON.stringify(user), err => {if (err) throw err;})
        			}
                    if (IsJsonString(user) === true) fs.writeFile(`./data/config.json`, JSON.stringify(config), err => {if (err) throw err;})
                })
    		})
        } else {
            var embed = new Discord.RichEmbed();
            embed.setColor(`#db4536`);
            embed.setTitle(`Erreur durant l'exécution de la commande`);
            embed.setDescription(`Vous n'avez pas mis de raison.`);
            embed.setFooter(`Oscar | Modération`);
            embed.setTimestamp();
            return message.channel.send(embed)
        }
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
	name: "ban"
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
