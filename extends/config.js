const ENABLECOMMAND = ["mod/kick", "mod/search"]

exports = module.exports = function(client, Discord, database, helpful, lang) {
    client.ws.on(`INTERACTION_CREATE`, async(interaction) => {
        if (interaction["type"] === 3) {
            if (interaction["data"]["custom_id"] === "lang") {
                helpful.loadingInteraction(interaction, client);
                const connect = await database.connect();
                const interactionToken = await new Promise(async dbAction => {
                    let db = await connect.db(`servConfig`);
                    await new Promise(async dbAction2 => {
                        db.collection(interaction["guild_id"]).findOne({name: "lang"}, async (err, result) => {
                            if (!result) {
                                await db.collection(interaction["guild_id"]).insertOne({name: "lang", lang: interaction["data"]["values"][0]});
                                dbAction2()
                            } else {
                                let values = {$set: {lang: interaction["data"]["values"][0]}};
                                db.collection(interaction["guild_id"]).updateOne({name: "lang"}, values, () => {
                                    dbAction2()
                                });
                            }
                        })
                    })
                    db.collection(interaction["guild_id"]).findOne({name: "interaction"}, async (err, result) => {
                        dbAction(result["interaction"])
                    })

                });
                connect.closing(connect);
                for (let name of ENABLECOMMAND) {
                    await new Promise(async res => {
                        let command = require(`../commands/${name}.js`)
                        if (command) {
                            await client.api.applications(client.user.id).guilds(interaction["guild_id"]).commands.post({ data: await command.help(interaction["data"]["values"][0])})
                            res();
                        }
                    })
                }
                await helpful.updateInteraction(interaction["token"], {content: await lang.getText("admin choose", interaction["data"]["values"][0])}, client)
                await helpful.wait(5000);
                helpful.deleteInteraction(interaction["token"], client)
                await helpful.deleteInteraction(interactionToken, client)
            }
        }
    })
}