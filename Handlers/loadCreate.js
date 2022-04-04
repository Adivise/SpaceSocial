const { Client } = require("discord.js");
const Ticket = require("../Settings/Models/Ticket.js");
const Member = require("../Settings/Models/Member.js");
const DarkAuction = require("../Settings/Models/DarkAuction.js");
const Config = require("../Settings/Member.js");
  
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
                work_cooldown: Config.WORK_COOLDOWN,
                work_cooldown_time: Config.WORK_COOLDOWN_TIME,
                money: Config.START_MONEY,
                bank: 0,
                rob: false,
                rob_cooldown: Config.ROB_COOLDOWN,
                rob_cooldown_time: Config.ROB_COOLDOWN_TIME,
                crime_cooldown: Config.CRIME_COOLDOWN,
                crime_cooldown_time: Config.CRIME_COOLDOWN_TIME,
                vote_cooldown: Config.VOTE_COOLDOWN,
                vote_cooldown_time: Config.VOTE_COOLDOWN_TIME,
                married_to: "",
                married: false,
                rank: "Newbie",
                reputation: 0,
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
                common_ticket: 0,
                uncommon_ticket: 0,
                rare_ticket: 0,
                epic_ticket: 0,
                legendary_ticket: 0,
                mythical_ticket: 0,
                guarantee_leg: 0,
                guarantee_myth: 0,
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
}