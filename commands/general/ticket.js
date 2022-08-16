const Ticket = require('../../settings/models/ticket.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");

module.exports = { 
    name: "ticket",
    description: "Check your ticket or view another user's ticket.",
    options: [
        {
            name: "user",
            description: "The user you want to check.",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const member = interaction.options.getUser("user");

        const mention = member ? member.id : interaction.user.id;

        const bot = member ? member.bot : interaction.user.bot;
        if (bot) return interaction.editReply("You can't check bots ticket");

        const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
        const userTag = member ? member.tag : interaction.user.tag;

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, mention) /// Can find this module in Handlers/loadCreate.js

        const ticket = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: mention });

        const tickets = config.gacha.gacha_list;

        const TotalTickets = (ticket.common_ticket + ticket.uncommon_ticket) + (ticket.rare_ticket + ticket.epic_ticket) + (ticket.legendary_ticket + ticket.mythical_ticket);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: userTag, iconURL: avatarURL })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Use the \`/leaderboard\` command to view your rank.`)
            .addField(`${tickets[0]}`, `\`${ticket.common_ticket} ⚪\``, true)
            .addField(`${tickets[1]}`, `\`${ticket.uncommon_ticket} 🟢\``, true)
            .addField(`${tickets[2]}`, `\`${ticket.rare_ticket} 🔵\``, true)
            .addField(`${tickets[3]}`, `\`${ticket.epic_ticket} 🟣\``, true)
            .addField(`${tickets[4]}`, `\`${ticket.legendary_ticket} 🟡\``, true)
            .addField(`${tickets[5]}`, `\`${ticket.mythical_ticket} 🔴\``, true)
            .setFooter({ text: `Total Tickets: ${TotalTickets}`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
}