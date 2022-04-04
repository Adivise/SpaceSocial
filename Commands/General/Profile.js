const { MessageEmbed } = require("discord.js");
const Clan = require("../../Settings/Models/Clan.js");
const Member = require("../../Settings/Models/Member.js");
const Auction = require("../../Settings/Models/Auction.js");
const Ticket = require("../../Settings/Models/Ticket.js");
const Config = require("../../Settings/Auction.js");

module.exports = { 
    name: "profile",
    description: "View your profile or another user's profile.",
    options: [
        {
            name: "user",
            description: "The user you want to check.",
            type: 6,
            required: false
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const member = interaction.options.getUser("user");

        const mention = member ? member.id : interaction.user.id;
        /// Can't check bots
        const bot = member ? member.bot : interaction.user.bot;
        if (bot) return interaction.editReply("You can't check bots profile")

        const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
        const userTag = member ? member.tag : interaction.user.tag;
        const userUsername = member ? member.username : interaction.user.username;

        ///// NOT FINISHED ADD MORE SOON!

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, mention) /// Can find this module in Handlers/loadCreate.js

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: mention });
        const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: mention });
        const auction = await Auction.findOne({ guild_id: interaction.guild.id, item_seller: mention }).countDocuments();

        const ticket = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: mention });
        const TotalTickets = (ticket.common_ticket + ticket.uncommon_ticket) + (ticket.rare_ticket + ticket.epic_ticket) + (ticket.legendary_ticket + ticket.mythical_ticket);

        const randomtip = [
            "/social to setting social link!", 
            "/clan to view clan commands", 
            "/auction for auction", 
            "/work to get some money",
            "/gacha to get some tickets",
            "/roulette to play roulette",
            "/leaderboard to view your rank",
            "/profile to view profile",
            "/marry to marry someone",
        ];

        const tip = randomtip[Math.floor(Math.random() * randomtip.length)];

        if(user.married_to && !client.users.cache.get(user.married_to)){
            await client.users.fetch(user.married_to, true);
        }

        const Lover = !user.married_to ? "Not Married" : client.users.cache.get(user.married_to).tag;

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({ name: userTag, iconURL: avatarURL })
            .setThumbnail(avatarURL)
            .setDescription(`Use the \`/leaderboard\` command to view your rank.`)
            .addField("Username:", `\`${userUsername}\``, true)
            .addField("Rank:", `\`${user.rank} 💠\``, true)
            .addField("Marry:", `\`💞 ${Lover}\``, true)
            .addField("Reputation:", `\`${user.reputation} 💎 Reputation\``, true)
            .addField("Clan:", `\`📄 ${clan ? clan.clan_name : "No Clan"} (Lvl.${clan ? clan.clan_level : "0"})\``, true)
            .addField("Money:", `\`$${numberWithCommas(user.money + user.bank)} 💰 Coins\``, true)
            .addField("Auction:", `\`${auction}/${Config.MAX_AUCTION} 🛒 Items\``, true)
            .addField("Ticket:", `\`${TotalTickets} 🎫 Tickets\``, true)
            .setFooter({ text: `Tip: ${tip}` })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });

    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}