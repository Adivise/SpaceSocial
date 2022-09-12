const { Client } = require("discord.js");
const Ticket = require("../settings/models/ticket.js");
const Member = require("../settings/models/member.js");
const DarkAuction = require("../settings/models/darkauction.js");
const Roulette = require("../settings/models/roulette.js");
const Coinflip = require("../settings/models/coinflip.js");
const config = require("../settings/default.js");
  
  /**
   *
   * @param {Client} client
   */
module.exports = async (client) => {

    client.CreateAndUpdate = async function (guild_id, mention_id) {
        const newuser = await Member.findOne({ guild_id: guild_id, user_id: mention_id });
        if (!newuser) {
            const newDatabase = await new Member({
                guild_id: guild_id,
                user_id: mention_id,
                work_cooldown: 0,
                work_cooldown_time: config.general.work_cooldown_time,
                work_multiple: config.general.work_multiple,
                money: config.general.start_money,
                bank: 0,
                rob: false,
                rob_cooldown: 0,
                rob_cooldown_time: config.general.rob_cooldown_time,
                crime_cooldown: 0,
                crime_cooldown_time: config.general.crime_cooldown_time,
                crime_multiple: config.general.crime_multiple,
                vote_cooldown: 0,
                vote_cooldown_time: config.general.vote_cooldown_time,
                married_to: "",
                married: false,
                rank: "Newbie",
                reputation: 0,
                facebook: "",
                instagram: "",
                twitter: "",
            });
            await newDatabase.save();
        }

        const ticket = await Ticket.findOne({ guild_id: guild_id, user_id: mention_id });
        if (!ticket) {
            const newTicket = await new Ticket({
                guild_id: guild_id,
                user_id: mention_id,
                gacha_cooldown: 0,
                gacha_cooldown_time: 2,
                three_star_ticket: 0,
                four_star_ticket: 0,
                five_star_ticket: 0,
                six_star_ticket: 0,
                guarantee_five_star: 0,
                guarantee_six_star: 0,
            });
            await newTicket.save();
        }
    };

    client.AuctionCreateAndUpdate = async function (guildId) {
        const auction = await DarkAuction.findOne({ guild_id: guildId });
        if (!auction) {
            const newAuction = await new DarkAuction({
                guild_id: guildId,
                enabled: false,
                channel_id: "",
                message_id: "",
                item: "",
                price: 0,
                old_price: 0,
                bidder: "",
                ended: true,
                history: [],
            });
            await newAuction.save();
        }
    }

    client.Roulette = async function (guildId) {
        const roulette = await Roulette.findOne({ guild_id: guildId });
        if (!roulette) {
            const newRoulette = await new Roulette({
                guild_id: guildId,
                roulette: false,
                history: [],
                space: [],
                data: [],
                time_remaining: 30,
                time: 0,
                time_limit: 0,
            });
            await newRoulette.save();
        }
    }

    client.Coinflip = async function (guildId) {
        const coinflip = await Coinflip.findOne({ guild_id: guildId });
        if (!coinflip) {
            const newCoinflip = await new Coinflip({
                guild_id: guildId,
                coinflip: false,
                history: [],
                space: "",
                data: [],
                time_remaining: 30,
                time: 0,
                time_limit: 0,
            });
            await newCoinflip.save();
        }
    }
}