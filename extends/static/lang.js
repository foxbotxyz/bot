const fs = require("fs");
const database = require("./database.js")

module.exports = {
    getText: async function (data, lang) {
        return new Promise(async text => {
            fs.readFile(`./lang/${lang}.json`, async(err, res) => {
                res = JSON.parse(res);
                data = data.split(" ");
                text(res[data[0]][data[1]]);
            })
        })
    },
    getLang: async function (guildid) {
        return await new Promise(async usedLang => {
            const connect = await database.connect();
            const db = await connect.db(`servConfig`);
            db.collection(guildid).findOne({name: "lang"}, async (err, result) => {
                if (!result) {
                    usedLang("en-GB")
                    connect.closing(connect)
                } else {
                    usedLang(result["lang"])
                    connect.closing(connect)
                }
            })
        });
    },
    getAllLang: async function() {
        return await new Promise(lang => {
            let name = [];
            fs.readdir('./lang/', (error, result) => {
                for (const [i,f] of result.entries()) {
                    fs.readFile(`./lang/${f}`, async(err, res) => {
                        res = JSON.parse(res);
                        name.push({
                            label: `${res["name"]} (${res["mainName"]})`,
                            value: res["mainName"],
                            description: res["description"],
                            emoji: {
                                name: res["emoji"],
                            }
                        })
                        if (i+1 === result.length) lang(name);
                    });
                }
            });
        })
    }
}