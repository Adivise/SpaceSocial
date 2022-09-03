const Coinflip = require("../settings/models/coinflip.js");
const Member = require("../settings/models/member.js");

const giveMoney = async (guildId, player, amount) => {
    const db = await Member.findOne({ guild_id: guildId, user_id: player });
    db.money += amount;
    await db.save();

    return giveMoney;
}

const pushArray = async (guildId, player, amount, space) => {
    const db = await Coinflip.findOne({ guild_id: guildId });

    db.data.push(`<@${player}> **+${amount}** | Place on: **${space}**`)

    await db.save();

    return pushArray;
}

const payoutWinners = async (guildId) => {
    const db = await Coinflip.findOne({ guild_id: guildId });

    for (let i = 0; i < db.history.length; i++) {
        /// Print

        const amount = db.history[i].bet;
        const type = db.history[i].place;
        const player = db.history[i].author;
    
        const place = db.space;

        if (type == place) { /// Support only red & black & green
            // give x2 multipier
            if (type == "heads") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            } else if (type == "tails") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        }
    }

    return payoutWinners;
}

const sendMsg = async (interaction, guildId) => {
    const db = await Coinflip.findOne({ guild_id: guildId });

    const place = db.space;
    const str = db.data.join("\n")

    interaction.channel.send({ content: `The coin landed on: **${place}** \n\n**Winners:**\n${str || "No body :("}` })

    return sendMsg;
}

const getResult = async (guildId) => {
    const db = await Coinflip.findOne({ guild_id: guildId });

    const coins = ["heads", "tails"];

    const result = coins[Math.floor(Math.random() * coins.length)];

    db.space = result;

    await db.save();

    return getResult;
}

const betSave = async (guildId, space, money, userId) => {
    const db = await Coinflip.findOne({ guild_id: guildId });
    const data = {
        place: space,
        bet: money,
        author: userId
    };
    db.history.push(data);
    await db.save();

    return betSave;
}

const revMoney = async (guildId, userId, money) => {
    const db = await Member.findOne({ guild_id: guildId, user_id: userId });
    db.money -= parseInt(money);
    await db.save();

    return revMoney;
}


module.exports = { betSave, revMoney, getResult, payoutWinners, sendMsg };