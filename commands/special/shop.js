const Member = require("../../settings/models/member.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");

module.exports = { 
    name: "shop",
    description: "Shop with your money!",
    options: [
        {
            name: "list",
            description: "List all the items in the shop.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "buy",
            description: "Buy an item from the shop.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "item",
                    description: "The item you want to buy.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getSubcommand() === "buy") {
            const args = interaction.options.getString("item");

            const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

            if (args.toLowerCase() == "work-speed") {
                if (user.work_cooldown_time < config.shop.max_work_cooldown_time) return interaction.editReply("You are already max reduce work cooldown"); {
                    if (user.money < config.shop.work_reduce_cost) return interaction.editReply(`You need ${numberWithCommas(config.shop.work_reduce_cost)} coins to buy.`);

                    user.money -= config.shop.work_reduce_cost;
                    user.work_cooldown_time -= config.shop.reduce_work_cooldown;

                    await user.save();
                    interaction.editReply("Your work cooldown has been reduced by " + config.shop.reduce_work_cooldown + " second. Work Cooldown: " + user.work_cooldown_time + " seconds.");
                }
            }

            if (args.toLowerCase() == "work-multiple") {
                // When have work multiple than work multiple max can't buy anymore!
                if (user.work_multiple > config.shop.work_multiple_max) return interaction.editReply("You are already max work multiple"); {
                    if (user.money < config.shop.work_multiple_cost) return interaction.editReply(`You need ${numberWithCommas(config.shop.work_multiple_cost)} coins to buy.`);

                    user.money -= config.shop.work_multiple_cost;
                    user.work_multiple += config.shop.work_multiple;

                    await user.save();
                    interaction.editReply("Your work money has been multiple by x" + config.shop.work_multiple + " Multiple: " + user.work_multiple);
                }
            }

            if (args.toLowerCase() == "crime-speed") {
                if (user.crime_cooldown_time < config.shop.max_crime_cooldown_time) return interaction.editReply("You are already max reduce crime cooldown"); {
                    if (user.money < config.shop.crime_reduce_cost) return interaction.editReply(`You need ${numberWithCommas(config.shop.crime_reduce_cost)} coins to buy.`);

                    user.money -= config.shop.crime_reduce_cost;
                    user.crime_cooldown_time -= config.shop.reduce_crime_cooldown;

                    await user.save();
                    interaction.editReply("Your crime cooldown has been reduced by " + config.shop.reduce_crime_cooldown + " second. Crime Cooldown: " + user.crime_cooldown_time + " seconds.");
                }
            }

            if (args.toLowerCase() == "crime-multiple") {
                if (user.crime_multiple > config.shop.crime_multiple_max) return interaction.editReply("You are already max crime multiple"); {
                    if (user.money < config.shop.crime_multiple_cost) return interaction.editReply(`You need ${numberWithCommas(config.shop.crime_multiple_cost)} coins to buy.`);

                    user.money -= config.shop.crime_multiple_cost;
                    user.crime_multiple += config.shop.crime_multiple;

                    await user.save();
                    interaction.editReply("Your crime money has been multiple by x" + config.shop.crime_multiple + " Multiple: " + user.crime_multiple);
                }
            }

            if (args.toLowerCase() == "rob-speed") {
                if (user && user.rob) {
                    if (user.rob_cooldown_time < config.shop.max_rob_cooldown_time) return interaction.editReply("You are already max reduce rob cooldown"); {
                        if (user.money < config.shop.rob_reduce_cost) return interaction.editReply(`You need ${numberWithCommas(config.shop.rob_reduce_cost)} coins to buy.`);

                        user.money -= config.shop.rob_reduce_cost;
                        user.rob_cooldown_time -= config.shop.reduce_rob_cooldown;

                        await user.save();
                        interaction.editReply("Your rob cooldown has been reduced by " + config.shop.reduce_rob_cooldown + " second. Rob Cooldown: " + user.rob_cooldown_time + " seconds.");
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setDescription(`You don't have the permission to buy this.`)
                        .setTimestamp();

                    interaction.editReply({ embeds: [embed] });
                    return;
                }
            }

            if (args.toLowerCase() == "rob") {
                if (user.money < config.shop.rob_cost) return interaction.editReply(`You need ${numberWithCommas(config.shop.rob_cost)} coins to buy.`);

                user.money -= config.shop.rob_cost;
                user.rob = true;

                await user.save();
                interaction.editReply("You have bought rob. You can now rob people.");
            }


        }

        if (interaction.options.getSubcommand() === "list") {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`
                \`work-speed\` - ${numberWithCommas(config.shop.work_reduce_cost)} coins - Reduce work cooldown by ${config.shop.reduce_work_cooldown} seconds.
                \`work-multiple\` - ${numberWithCommas(config.shop.work_multiple_cost)} coins - Increase work money multiple by x${config.shop.work_multiple}.
                \`crime-speed\` - ${numberWithCommas(config.shop.crime_reduce_cost)} coins - Reduce crime cooldown by ${config.shop.reduce_crime_cooldown} seconds.
                \`crime-multiple\` - ${numberWithCommas(config.shop.crime_multiple_cost)} coins - Increase crime money multiple by x${config.shop.crime_multiple}.
                \`rob\` - ${numberWithCommas(config.shop.rob_cost)} coins - Buy rob.
                \`rob-speed\` - ${numberWithCommas(config.shop.rob_reduce_cost)} coins - Reduce rob cooldown by ${config.shop.reduce_rob_cooldown} seconds.
                `)
                .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}