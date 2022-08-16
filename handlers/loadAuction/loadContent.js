const { Client } = require("discord.js");
const DarkAuction = require("../../settings/models/darkauction.js");
const Member = require("../../settings/models/member.js");
const config = require("../../settings/default.js");

/**
 * @param {Client} client
 */

module.exports = async (client) => {

client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;

        await client.AuctionCreateAndUpdate(message.guild.id);

        let database = await DarkAuction.findOne({ guild_id: message.guild.id });
        //// Find Database & Create went not have!
        if (!database) return;

        /// Return went not enable!
        if (database.enable === false) return;

        /// Return went not find channel!
        let channel = await message.guild.channels.cache.get(database.channel_id);
        if (!channel) return;

        /// Check channel and return if not same
        if (database.channel_id != message.channel.id) return;

  //      if (message.author.id === client.user.id) {
  //          await delay(3000);
  //              message.delete()
  //          }

        /// Get message bot and return
        if (message.author.bot) return;

        /// Allow only numbers
            let content = message.cleanContent;
            await message.delete();

            //// Check if content is number not number and return
            if (isNaN(content)) return;

            //// Need bid higher than current price + 100,000 coins
            let price = parseInt(content);

            let member = await Member.findOne({ guild_id: message.guild.id, user_id: message.author.id });

            /// Not have enough coins
            if (member.money < price) {
                message.channel.send(`${message.author} don't have enough money.`).then((msg) => { 
                    setTimeout(() => {
                        msg.delete()
                    }, 4000);
                });
                return;
            }

            const formatPrice = database.price * config.dark_auction.multiple;

            /// Need bid higher than current price + 100,000 coins Multiplied
            if (price < formatPrice) {
                message.channel.send(`${message.author} need to bid higher than $${numberWithCommas(formatPrice)} Coins.`).then((msg) => { 
                    setTimeout(() => {
                        msg.delete()
                    }, 4000);
                });
                return;
            }

            /// Already bid
            if (database.bidder === message.author.id) {
                message.channel.send(`${message.author} already bid need to another person outbid.`).then((msg) => { 
                    setTimeout(() => {
                        msg.delete()
                    }, 4000);
                });
                return;
            }

            /// Update database
            await database.updateOne({ price: price, bidder: message.author.id });

            //// Update history
            await DarkAuction.findOneAndUpdate({ guild_id: message.guild.id }, {
                history: [...database.history, {
                    price: price,
                    bidder: message.author.id,
                }],
            });

            /// Update member
            await member.updateOne({ money: member.money - price });

            ///  UpdateBidder Message
            await client.UpdateBidder(message.guild.id, message.author.id);

            //// Time left Auction
            if (database && database.ended) {
                //// Find ended when true and run this handler
                await client.DeleteChannel(message.guild.id);
            } else {
                //// When false and return
                return;
            }
    });
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}