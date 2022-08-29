const Member = require('../../settings/models/member.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: "withdraw",
    description: "Withdraw money from your bank.",
    options: [
        {
            name: "amount",
            description: "The amount you want to withdraw.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getString("amount");
        
        const filters = [
            "+",
            "-"
        ];

        for (const message in filters) {
            if (args.includes(filters[message])) return interaction.editReply("You can't do that!");
        }

        if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (args > user.bank) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to withdraw this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == 'all') { /// WITHDRAW ALL
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have withdraw \`$${numberWithCommas(user.bank)}\` from your bank.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            user.money += user.bank;
            user.bank = 0;
            
            await user.save();
        } else { /// DEPOSIT AMOUNT
            user.money += parseInt(args);
            user.bank -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have withdraw \`$${numberWithCommas(args)}\` from your bank.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            await user.save();
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}