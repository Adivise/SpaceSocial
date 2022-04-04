const { Client, MessageEmbed } = require("discord.js");
const DarkAuction = require("../../Settings/Models/DarkAuction.js");
const Member = require("../../Settings/Models/Member.js");
const Config = require("../../Settings/DarkAuction.js");
const delay = require("delay");

  /**
   *
   * @param {Client} client
   */
module.exports = async (client) => {

    //// Update Message
    client.UpdateBidder = async function (guildId, userId) {
        let database = await DarkAuction.findOne({ guild_id: guildId });
        if (database.enabled === false) return;

        //// Check channel and return if not same
        let channel = await client.channels.cache.get(database.channel_id);
        if (!channel) return;

        //// Check message bot and return if not same
        let BidderUpdate = await channel.messages.fetch(database.message_id, { cache: false, force: true });
        if (!BidderUpdate) return;

        /// Fetch role
        let role = await client.guilds.cache.get(guildId).roles.cache.find(r => r.name === database.item);
        if (!role) return;

        let embed = new MessageEmbed()
            .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
            .setDescription(`
            **Role:** ${role.name}
            **Bidder:** ${client.users.cache.get(userId)}
            **Highest Bid:** $${numberWithCommas(database.price)} Coins

            **Place Bid:** $${numberWithCommas(database.price * Config.MUTLIPLIER)} Coins
            `)
            .setThumbnail(client.users.cache.get(userId).avatarURL({ format: "png", dynamic: true, size: 512 }))
            .setColor(client.color)
            .setFooter({ text: `Time remaining: 120 seconds`});

        await BidderUpdate.edit({ embeds: [embed] });
    };

    //// Time remaining & and delete channel
    client.DeleteChannel = async function (guildId) {
        let database = await DarkAuction.findOne({ guild_id: guildId });
        if (database.enabled === false) return;

        //// Check channel and return if not same
        let channel = await client.channels.cache.get(database.channel_id);
        if (!channel) return;

        //// Check message bot and return if not same
        let AuctionEnd = await channel.messages.fetch(database.message_id, { cache: false, force: true });
        if (!AuctionEnd) return;

        await DarkAuction.findOneAndUpdate({ guild_id: guildId }, {
            ended: false,
        });

        //// Delay delete channel
        await delay(Config.TIME_REMANING);

        /// Find database again
        let newdata = await DarkAuction.findOne({ guild_id: guildId });

        /// Update channel to deny message @everyone
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { 
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
        });

        /// Find History
        const G = await DarkAuction.findOne({ guild_id: guildId });

        /// Get history and give money back all
        const history = G.history;
        for (let i = 0; i < history.length; i++) {
            const member = await Member.findOne({ guild_id: guildId, user_id: history[i].bidder });
            member.money += history[i].price;
            member.save();
        }

        /// Fetch User
        let member = await client.guilds.cache.get(guildId).members.fetch(newdata.bidder);
        if (!member) return;

        /// Fetch Role
        let role = await client.guilds.cache.get(guildId).roles.cache.find(r => r.name === newdata.item);
        if (!role) return;

        /// Give Role to winner
        await member.roles.add(role);

        let embed = new MessageEmbed()
            .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
            .setDescription(`
            **Role:** ${role.name}
            **Bidder:** ${client.users.cache.get(newdata.bidder)}
            **Price:** $${numberWithCommas(newdata.price)} Coins

            **Normal Price:** $${numberWithCommas(database.old_price * Config.MUTLIPLIER)} Coins
            `)
            .setThumbnail(client.users.cache.get(newdata.bidder).avatarURL({ format: "png", dynamic: true, size: 512 }))
            .setColor("#ff0000")
            .setFooter({ text: `Winner is ${client.users.cache.get(newdata.bidder).tag}`});

        /// Find Winner
        const user = await Member.findOne({ guild_id: guildId, user_id: newdata.bidder });

        //// Remove Money from winner
        await Member.findOneAndUpdate({ guild_id: guildId, user_id: newdata.bidder }, {
            money: user.money - newdata.price,
        });

        /// Delete database
        await DarkAuction.findOneAndDelete({ guild_id: guildId });

        /// Edit Message bot
        await AuctionEnd.edit({ embeds: [embed] });
        /// Send message to channel
        await channel.send(`\`DARK AUCTION ENDED! WILL CLOSE IN 60 SECONDS\``);

        /// Delay delete channel!
        await delay(60000);
        await channel.delete();
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}