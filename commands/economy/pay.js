const Member = require('../../settings/models/member.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: "pay",
    description: "Pay someone.",
    options: [
        {
            name: "amount",
            description: "The amount you want to pay.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "user",
            description: "The user you want to pay.",
            type: ApplicationCommandOptionType.User,
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
        const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });

        if (args > user.money) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to pay this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args == 'all') { /// PAY ALL
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have paid \`$${numberWithCommas(user.money)}\` to ${member}.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            /// SET YOUR MONEY TO TARGET MONEY
            target.money += user.money;
            await target.save();

            /// SET YOUR MONEY TO 0
            user.money = 0;
            await user.save();
        } 

        if (args == parseInt(args)) { /// PAY AMOUNT
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have paid \`$${numberWithCommas(args)}\` into ${member}.`)
                .setTimestamp();

           interaction.editReply({ embeds: [embed] });

            /// + TARGET MONEY
            target.money += parseInt(args);
            await target.save();
            
            /// - YOUR MONEY
            user.money -= parseInt(args);
            await user.save();
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}