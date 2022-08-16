const Member = require('../../settings/models/member.js');
const Ticket = require('../../settings/models/ticket.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { LeadPage } = require("../../structures/Pagination.js");

module.exports = { 
    name: "leaderboard",
    description: "View the top money with leaderboard.",
    options: [
        {
            name: "money",
            description: "View the top money with leaderboard.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "page",
                    description: "The page you want to get information about.",
                    type: ApplicationCommandOptionType.Integer, /// 4 = Integer
                    required: false
                }
            ]
        },
        {
            name: "ticket",
            description: "View the top tickets with leaderboard.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "page",
                    description: "The page you want to get information about.",
                    type: ApplicationCommandOptionType.Integer, /// 4 = Integer
                    required: false
                }
            ]
        },
        {
            name: "reputation",
            description: "View the top reputation with leaderboard.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "page",
                    description: "The page you want to get information about.",
                    type: ApplicationCommandOptionType.Integer, /// 4 = Integer
                    required: false
                }
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getSubcommand() === "money") {
            const args = interaction.options.getInteger("page");
            const user = await Member.find({ guild_id: interaction.guild.id });
        
            let pagesNum = Math.ceil(user.length / 10);
            if(pagesNum === 0) pagesNum = 1;

            /// Sort by Money
            user.sort((a, b) => {
                return b.money + b.bank - (a.money + a.bank);
            });

            const userStrings = [];
            for (let i = 0; i < user.length; i++) {
                const e = user[i];
                const fetch = await client.users.fetch(e.user_id);
                userStrings.push(
                    `**${i + 1}.** ${client.users.cache.get(fetch.id)} \`$${numberWithCommas(e.money + e.bank)} 💰 Coins\`
                    `);
            }

            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = userStrings.slice(i * 10, i * 10 + 10).join('');

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Top Money`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Users' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${user.length} • Total Members`});

                pages.push(embed);
            }

            if (!args) {
                if (pages.length == pagesNum && user.length > 10) LeadPage(client, interaction, pages, 120000, user.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }

        if (interaction.options.getSubcommand() === "ticket") {
            const args = interaction.options.getInteger("page");
            const user = await Ticket.find({ guild_id: interaction.guild.id });
        
            let pagesNum = Math.ceil(user.length / 10);
            if(pagesNum === 0) pagesNum = 1;

            /// Sort by Total Tickets
            user.sort((a, b) => {
                return (b.common_ticket + b.uncommon_ticket) + (b.rare_ticket + b.epic_ticket) + (b.legendary_ticket + b.mythical_ticket) - (a.common_ticket + a.uncommon_ticket) + (a.rare_ticket + a.epic_ticket) + (a.legendary_ticket + a.mythical_ticket);
            });

            const userStrings = [];
            for (let i = 0; i < user.length; i++) {
                const e = user[i];
                const TotalTicket = (e.common_ticket + e.uncommon_ticket) + (e.rare_ticket + e.epic_ticket) + (e.legendary_ticket + e.mythical_ticket);
                const fetch = await client.users.fetch(e.user_id);
                userStrings.push(
                    `**${i + 1}.** ${client.users.cache.get(fetch.id)} \`${TotalTicket} 🎫 Tickets\`
                    `);
            }

            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = userStrings.slice(i * 10, i * 10 + 10).join('');

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Top Tickets`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Users' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${user.length} • Total Members`});

                pages.push(embed);
            }

            if (!args) {
                if (pages.length == pagesNum && user.length > 10) LeadPage(client, interaction, pages, 120000, user.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }

        if (interaction.options.getSubcommand() === "reputation") {
            const args = interaction.options.getInteger("page");
            const user = await Member.find({ guild_id: interaction.guild.id });
        
            let pagesNum = Math.ceil(user.length / 10);
            if(pagesNum === 0) pagesNum = 1;

            /// Sort by Reputation
            user.sort((a, b) => {
                return b.reputation - a.reputation;
            });

            const userStrings = [];
            for (let i = 0; i < user.length; i++) {
                const e = user[i];
                const fetch = await client.users.fetch(e.user_id);
                userStrings.push(
                    `**${i + 1}.** ${client.users.cache.get(fetch.id)} \`${e.reputation} 💎 Reputation\`
                    `);
            }

            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = userStrings.slice(i * 10, i * 10 + 10).join('');

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Top Reputation`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Users' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${user.length} • Total Members`});

                pages.push(embed);
            }

            if (!args) {
                if (pages.length == pagesNum && user.length > 10) LeadPage(client, interaction, pages, 120000, user.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}