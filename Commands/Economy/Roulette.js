const Member = require("../../Settings/Models/Member.js");
const { MessageEmbed } = require("discord.js");
const Config = require("../../Settings/Member.js");
const delay = require("delay");

module.exports = { 
    name: "roulette",
    description: "Play the roulette game.",
    options: [
        {
            name: "bet",
            description: "The amount of money you want to bet.",
            type: 4, /// 4 = Integer
            required: true,
        },
        {
            name: "space",
            description: "The space you want to bet on.",
            type: 3, /// 3 = String
            required: true,
        },
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("bet");
        if(args < Config.ROULETTE_START) return interaction.editReply(`You can't bet less than \`$${numberWithCommas(Config.ROULETTE_START)}\``);

        const space = interaction.options.getString("space");
        if (space != "red" && space != "black") return interaction.editReply("Space must be `red` and `black`");

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (args > user.money) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to bet this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        const betRed = [];
        const betBlack = [];

        const chance = Math.floor(Math.random() * 100);
        if (chance <= 50) {
            betRed.push(chance);
        } else if (chance > 50) {
            betBlack.push(chance);
        }

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on the \`${space}\` space.`)
            .setFooter({ text: `Time remaining: 30 seconds` });

        interaction.editReply({ embeds: [embed] });

        //// Update User - Money now!
        await Member.updateOne({ guild_id: interaction.guild.id, user_id: interaction.user.id }, { money: user.money - args });

        //// Wait for 30 seconds
        await delay(30000);
        if (space == "red") {
            if (betRed.length == 0) {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You lost \`$${numberWithCommas(args)}\` bet on \`red\``)
                    .setTimestamp();

                return interaction.followUp({ embeds: [embed] });
            }
            if (betRed.length > 0) {
                /// Give back
                await Member.updateOne({ guild_id: interaction.guild.id, user_id: interaction.user.id }, { money: + args * 2 });

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You won \`$${numberWithCommas(args * 2)}\` bet on \`red\``)
                    .setTimestamp();

                return interaction.followUp({ embeds: [embed] });
            }
        } else if (space == "black") {
            if (betBlack.length == 0) {

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You lost \`$${numberWithCommas(args)}\` bet on \`black\``)
                    .setTimestamp();

                return interaction.followUp({ embeds: [embed] });
            }
            if (betBlack.length > 0) {
                /// Give back
                await Member.updateOne({ guild_id: interaction.guild.id, user_id: interaction.user.id }, { money: + args * 2 });

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You won \`$${numberWithCommas(args * 2)}\` bet on \`black\``)
                    .setTimestamp();

                return interaction.followUp({ embeds: [embed] });
            }
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}