const Member = require("../../Settings/Models/Member.js");
const { MessageEmbed } = require("discord.js");
const Config = require("../../Settings/Member.js");

module.exports = { 
    name: "crime",
    description: "Crime to earn money. Chance to get caught.",
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        const cooldown = new Date(user.crime_cooldown);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if(user.crime_cooldown > Date.now()) {
            return interaction.editReply(`You can't crime yet, you have to wait \`${time_format}\``);
        }

        /// Random 1500 - 3000
        const amount = Math.floor(Math.random() * (Config.CRIME_MONEY_MIN - Config.CRIME_MONEY_MAX)) + Config.CRIME_MONEY_MAX;
        /// + New Cooldown
        user.crime_cooldown = Date.now() + (user.crime_cooldown_time * 1000);

        const chance = Math.floor(Math.random() * 100);
        if (chance > Config.CRIME_CHANCE) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`${interaction.user} *has earned* \`$${numberWithCommas(amount)}\` *from crime*`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: `Cooldown: ${Config.CRIME_COOLDOWN} seconds` })

            interaction.editReply({ embeds: [embed] });

            user.money += amount;
        } else {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`${interaction.user} *gets caught and lost* \`$${numberWithCommas(amount)}\``)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: `Cooldown: ${Config.CRIME_COOLDOWN} seconds` })

            interaction.editReply({ embeds: [embed] });

            user.money -= amount;
        }

        await user.save();
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}