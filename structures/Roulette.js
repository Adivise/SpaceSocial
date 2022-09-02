const Roulette = require("../settings/models/roulette.js");
const Member = require("../settings/models/member.js");

const giveMoney_2 = async (guildId, player, amount) => {
    const db = await Member.findOne({ guild_id: guildId, user_id: player });
    db.money += amount;
    await db.save();

    return giveMoney_2;
}

const giveMoney_3 = async (guildId, player, amount) => {
    const db = await Member.findOne({ guild_id: guildId, user_id: player });
    db.money += amount;
    await db.save();

    return giveMoney_3;
}

const giveMoney_36 = async (guildId, player, amount) => {
    const db = await Member.findOne({ guild_id: guildId, user_id: player });
    db.money += amount;
    await db.save();

    return giveMoney_36;
}

const pushArray = async (guildId, player, amount, space) => {
    const db = await Roulette.findOne({ guild_id: guildId });

    db.data.push(`<@${player}> **+${amount}** | Place on: **${space}**`)

    await db.save();

    return pushArray;
}

const payoutWinners = async (guildId) => {
    const db = await Roulette.findOne({ guild_id: guildId });

    for (let i = 0; i < db.history.length; i++) {
        /// Print

        const amount = db.history[i].bet;
        const type = db.history[i].place;
        const player = db.history[i].author;
    
        const place = db.space[0].type;
        const number = db.space[0].number;

        if (type == place) { /// Support only red & black & green
            // give x2 multipier
            if (type == "red") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney_2(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            } else if (type == "black") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney_2(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            } else if (type == "green") {
                // give x36 multipier
                const formatMoney = amount * 36;

                await giveMoney_36(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        } else if (type == number) { /// Support single number
            // give x36 multipier
            const formatMoney = amount * 36;

            await giveMoney_36(guildId, player, formatMoney);
            await pushArray(guildId, player, formatMoney, type);
        }

        //// Check number and check player type if not match not give money
        if (parseInt(number) % 2 === 0) { /// Support even & odd
            if (type == "even") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney_2(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        } else {
            if (type == "odd") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney_2(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        }

        if (number < 19 && number > 0) { /// Support 1-18 & 19-35
            if (type == "1-18") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney_2(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        } else if (number > 18) {
            if (type == "19-36") {
                // give x2 multipier
                const formatMoney = amount * 2;

                await giveMoney_2(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        }

        if (number < 13 && number > 0) { /// Support 1st & 2nd & 3rd
            if (type == "1st") {
                // give x3 multipier
                const formatMoney = amount * 3;

                await giveMoney_3(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        } else if (number < 25 && number > 12) {
            if (type == "2nd") {
                // give x3 multipier
                const formatMoney = amount * 3;

                await giveMoney_3(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        } else if (number > 24) {
            if (type == "3rd") {
                // give x3 multipier
                const formatMoney = amount * 3;

                await giveMoney_3(guildId, player, formatMoney);
                await pushArray(guildId, player, formatMoney, type);
            }
        }

    }

    return payoutWinners;
}

const sendMsg = async (interaction, guildId) => {
    const db = await Roulette.findOne({ guild_id: guildId });

    const place = db.space[0].type;
    const number = db.space[0].number;
    const str = db.data.join("\n")

    interaction.channel.send({ content: `The ball landed on: **${number} ${place}** \n\n**Winners:**\n${str || "No body :("}` })

    return sendMsg;
}

const getNumber = async (guildId) => {
    const db = await Roulette.findOne({ guild_id: guildId });

    var Num = Math.floor((Math.random() * 36));

    var reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    var blacks = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    var pickedNum = {
        type: "green",
        number: 0
    };

    if (Num === 0) {
        pickedNum = {
            type: "green",
            number: 0
        };
    } else if (reds.indexOf(Num) > -1) {
        pickedNum = {
            type: "red",
            number: Num
        };
    } else if (blacks.indexOf(Num) > -1) {
        pickedNum = {
            type: "black",
            number: Num
        };
    }

    db.space.push(pickedNum);
    await db.save();

    return getNumber;
}

const betSave = async (guildId, space, money, userId) => {
    const db = await Roulette.findOne({ guild_id: guildId });
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

async function grabWinners(type, guildId) {
    const db = await Roulette.findOne({ guild_id: guildId });

    return db.space.filter(function(bet) {
        return bet.type == type;
    });
}

module.exports = { betSave, revMoney, getNumber, payoutWinners, sendMsg };