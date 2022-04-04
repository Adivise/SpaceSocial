const Member = require('../../Settings/Models/Member.js');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    name: "pay",
    description: "Pay someone.",
    options: [
        {
            name: "amount",
            description: "The amount you want to pay.",
            type: 3,
            required: true,
        },
        {
            name: "user",
            description: "The user you want to pay.",
            type: 6,
            required: true,
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getString("amount");
        if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");

        const member = interaction.options.getUser("user");
        if (member.id === interaction.user.id) return interaction.editReply("You can't pay yourself.");
        if (member.bot) return interaction.editReply("You can't pay bots.");

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        /// CHECK IF USER EXISTS
        const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });
        if (!target) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`\`${member.tag}\` *is not in the database*`)
                .setTimestamp();

                interaction.editReply({ embeds: [embed] });
            return;
        }

        if (args > user.money) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to pay this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args == 'all') { /// PAY ALL
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have paid \`$${numberWithCommas(user.money)}\` to ${member}.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            /// SET YOUR MONEY TO 0
            user.money = 0;
            await user.save();

            /// SET YOUR MONEY TO TARGET MONEY
            target.money += user.money;
            await target.save();

        } else { /// PAY AMOUNT
            
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have paid \`$${numberWithCommas(args)}\` into ${member}.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            /// - YOUR MONEY
            user.money -= args;
            await user.save();

            /// + TARGET MONEY
            target.money += args;
            await target.save();
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}