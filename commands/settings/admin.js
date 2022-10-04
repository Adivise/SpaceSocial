const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Clan = require("../../settings/models/clan.js");
const Member = require("../../settings/models/member.js");
const Auction = require("../../settings/models/auction.js");
const Ticket = require("../../settings/models/ticket.js");
const config = require("../../settings/default.js");

module.exports = { 
    name: "admin",
    description: "View your profile or another user's profile.",
    options: [
        {
            name: "money",
            description: "The user you want to check.",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "give",
                    description: "Give money to a user.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The user you want to give money to.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "amount",
                            description: "The amount of money you want to give.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true
                        }
                    ]
                },
                {
                    name: "take",
                    description: "Take money from a user.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The user you want to take money from.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "amount",
                            description: "The amount of money you want to take.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true
                        }
                    ]
                }
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        if (!interaction.member.permissions.has('ManageGuild')) return interaction.editReply("You need the **MANAGE_GUILD** permission!");
        if (interaction.options.getSubcommand() === "give") {
            const args = interaction.options.getInteger("amount");
    
            const member = interaction.options.getUser("user");
            if (member.bot) return interaction.editReply("You can't give money to bots.");
    
            /// Try to create new database went this member not have!
            await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

            const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });
            /// + TARGET MONEY
            target.money += args;
            await target.save().then(() => {
                const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You give money \`$${numberWithCommas(args)}\` into ${member}.`)
                .setTimestamp();

                interaction.editReply({ embeds: [embed] });
            });
        }

        if (interaction.options.getSubcommand() === "take") {
            const args = interaction.options.getInteger("amount");
    
            const member = interaction.options.getUser("user");
            if (member.bot) return interaction.editReply("You can't take money from bots.");
    
            /// Try to create new database went this member not have!
            await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

            const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });
            /// + TARGET MONEY
            target.money -= args;
            await target.save().then(() => {
                const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You take money \`$${numberWithCommas(args)}\` from ${member}.`)
                .setTimestamp();

                interaction.editReply({ embeds: [embed] });
            });
        }

    }
    }
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
