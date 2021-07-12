const Discord = require("discord.js");
const prefix = "!";

module.exports = async(client, message) => {
    if(message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const commande = args.shift();
    const cmd = client.commands.get(commande)
    if(!cmd) return;
    /*MongoClient.connect(dbUrl, {connectTimeoutMS: 10000, useUnifiedTopology: true}, async(err, response) => {
		var db = response.db('Players');
        var allCollection = [];
        db.collections(extends(e, cols) {
            cols.forEach(extends(col) {
                allCollection.push(col.collectionName);
            });
            console.log(allCollection)
            if (allCollection.indexOf(message.guild.id) != -1) {
            } else {
                var embed = new Discord.MessageEmbed()
                embed.setColor(`#6f2fa2`);
                embed.setDescription("Votre serveur n'est pas configuré.\nUtilisez la commande `!config` pour le configurer.");
                message.channel.send(embed)
            }
        })
	})*/
    cmd.run(client, message, args);
}
