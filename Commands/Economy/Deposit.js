const Member = require('../../Settings/Models/Member.js');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    name: "deposit",
    description: "Deposit money into your bank.",
    options: [
        {
            name: "amount",
            description: "The amount you want to deposit.",
            type: 3, /// 3 = String
            required: true,
        },
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getString("amount");
        if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");
        /// NEED AMOUNT AND ALL

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (args > user.money) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to deposit this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == 'all') { /// DEPOSIT ALL
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have deposited \`$${numberWithCommas(user.money)}\` into your bank.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            /// ALL BANK TO MONEY
            user.bank += user.money;
            /// SET MONEY TO 0
            user.money = 0;

            await user.save();
        } else { /// DEPOSIT AMOUNT
            user.bank += parseInt(args);
            user.money -= parseInt(args);
            await user.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You have deposited \`$${numberWithCommas(args)}\` into your bank.`)
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}