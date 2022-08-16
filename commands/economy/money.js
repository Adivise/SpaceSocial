const Member = require('../../settings/models/member.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: "money",
    description: "Check your money or view another user's money.",
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
        const member = interaction.options.getUser("user")
        const mention = member ? member.id : interaction.user.id;

        const bot = member ? member.bot : interaction.user.bot;
        if (bot) return interaction.editReply("You can't check bots money");

        const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
        const userTag = member ? member.tag : interaction.user.tag;

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, mention) /// Can find this module in Handlers/loadCreate.js

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: mention });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: userTag, iconURL: avatarURL })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Use the \`/leaderboard\` command to view your rank.`)
            .addFields({ name: "Coin:", value: `\`$${numberWithCommas(user.money)}\``, inline: true })
            .addFields({ name: "Bank:", value: `\`$${numberWithCommas(user.bank)}\``, inline: true })
            .addFields({ name: "Total:", value: `\`$${numberWithCommas(user.money + user.bank)}\``, inline: true })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}