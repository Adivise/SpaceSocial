const Ticket = require("../../settings/models/ticket.js");
const { ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");

module.exports = { 
    name: "exchange",
    description: "Exchange your ticket to high rarity!",
    options: [
        {
            name: "type",
            description: "Type you want exchange to!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "rarity",
                    description: "Rarity of Star",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "3 🌟 to 4 🌟",
                            value: "three_star"
                        },
                        {
                            name: "4 🌟 to 5 🌟",
                            value: "four_star"
                        },
                        {
                            name: "5 🌟 to 6 🌟",
                            value: "five_star"
                        }
                    ]
                },
                {
                    name: "amount",
                    description: "Amount want to exchange (Example: amount 10 here = you need 10 | 4 Star)",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getSubcommand() === "type") {
            const amount = interaction.options.getInteger("amount");

            if (interaction.options._hoistedOptions.find(c => c.value === "three_star")) {
                const user = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

                // format example 5 = 50
                const format = amount * config.exchange.three_to_four;
                const tickmat = amount;
                if (format > user.three_star_ticket) return interaction.editReply("You don't have enough ticket to exchange " + `(\`Require ${format} 3 Star\`)`);
                
                user.three_star_ticket -= format;
                user.four_star_ticket += tickmat;

                await user.save();

                interaction.editReply({ content: `Success to exchange (-${format}) \`3 🌟\` to (+${amount}) \`4 🌟\``})

            }

            if (interaction.options._hoistedOptions.find(c => c.value === "four_star")) {
                const user = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

                // format example 5 = 50
                const format = amount * config.exchange.four_to_five;
                const tickmat = amount;
                if (format > user.four_star_ticket) return interaction.editReply("You don't have enough ticket to exchange " + `(\`Require ${format} 4 Star\`)`);
                
                user.four_star_ticket -= format;
                user.five_star_ticket += tickmat;

                await user.save();

                interaction.editReply({ content: `Success to exchange (-${format}) \`4 🌟\` to (+${amount}) \`5 🌟\``})
            }

            if (interaction.options._hoistedOptions.find(c => c.value === "five_star")) {
                const user = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

                // format example result 10 * 5 = 50
                const format = amount * config.exchange.five_to_six;
                const tickmat = amount;
                if (format > user.five_star_ticket) return interaction.editReply("You don't have enough ticket to exchange " + `(\`Require ${format} 5 Star\`)`);
                
                user.five_star_ticket -= format;
                user.six_star_ticket += tickmat;

                await user.save();

                interaction.editReply({ content: `Success to exchange (-${format}) \`5 🌟\` to (+${amount}) \`6 🌟\``})
            }

        }



    }
}