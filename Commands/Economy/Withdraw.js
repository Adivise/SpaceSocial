const Member = require('../../Settings/Models/Member.js');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    name: "withdraw",
    description: "Withdraw money from your bank.",
    options: [
        {
            name: "amount",
            description: "The amount you want to withdraw.",
            type: 3,
            required: true,
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getString("amount");
        if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (args > user.bank) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to withdraw this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args == 'all') { /// WITHDRAW ALL
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have withdraw \`$${numberWithCommas(user.bank)}\` from your bank.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            /// ALL BANK TO MONEY
            user.money += user.bank;
            /// SET MONEY TO 0
            user.bank = 0;

            await user.save();
        } else { /// DEPOSIT AMOUNT
            user.money += parseInt(args);
            user.bank -= parseInt(args);
            await user.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You have withdraw \`$${numberWithCommas(args)}\` from your bank.`)
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}