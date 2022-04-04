const Member = require("../../Settings/Models/Member.js");
const { MessageEmbed } = require("discord.js");
const Config = require("../../Settings/Member.js");

module.exports = { 
    name: "work",
    description: "Work to earn money.",
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        const cooldown = new Date(user.work_cooldown);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if(user.work_cooldown > Date.now()) {
            return interaction.editReply(`You can't work yet, you have to wait \`${time_format}\``);
        }

        const amount = Math.floor(Math.random() * (Config.WORK_MONEY_MIN - Config.WORK_MONEY_MAX)) + Config.WORK_MONEY_MAX;
        /// + Money
        user.money += amount;
        /// + New Cooldown
        user.work_cooldown = Date.now() + (user.work_cooldown_time * 1000);

        /// Save database
        await user.save().then( async () => {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`${interaction.user} *has earned* \`$${numberWithCommas(amount)}\` *from work*`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: `Cooldown: ${Config.WORK_COOLDOWN} seconds` })

        return interaction.editReply({ embeds: [embed] });
        });
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}