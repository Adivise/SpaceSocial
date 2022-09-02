const Member = require("../../settings/models/member.js");
const Roulette = require("../../settings/models/roulette.js")
const { betSave, revMoney, getNumber, payoutWinners, sendMsg } = require("../../structures/Roulette.js")
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");
const delay = require("delay");

////// ROULETTE IS NOT FINNAL CODE I HAVE A PLAN TO UPDATE NEXT TIME

module.exports = { 
    name: "roulette",
    description: "Play the roulette game.",
    options: [
        {
            name: "bet",
            description: "The amount of money you want to bet.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "space",
            description: "The space you want to bet on.",
            type: ApplicationCommandOptionType.String, /// 3 = String
            required: true,
        },
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("bet");
        if (args < config.general.roulette_start) return interaction.editReply(`You can't bet less than \`$${numberWithCommas(config.general.roulette_start)}\``);

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (args > user.money) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to bet this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        const space = interaction.options.getString("space");
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`
            **Roulette**
            You can place multiple bets on a roulette game.
            Usage: \`roulette <bet> <space>\`

            Payout Multipliers:
            [x36] Single Number (0-36)
            [x36] Colours (green = 0)
            [x 3] Columns (1st, 2nd, 3rd)
            [x 2] Odd/Even
            [x 2] Dozens (1-18, 19-36)
            [x 2] Colours (red, black)

            Examples:
            \`/roulette 200 odd\`
            \`/roulette 600 2nd\`
            `)
            .setImage("https://media.discordapp.net/attachments/1010784573061349496/1015180819452665886/roulette.jpg")
            .setTimestamp();

        if (space == "green" || space == "red" || space == "black" || space == "even" || space == "odd" || space == "1st" || space == "2nd" || space == "3rd" || space == "1-18" || space == "19-36") {
            /// Fill here
            await runRoulette(interaction, space, args, client);
        } else if (isInt(space)) {
            if (parseInt(space) < 37 && parseInt(space) > -1) {
                //// Fill here
                await runRoulette(interaction, space, args, client);
            } else {
                return interaction.editReply({ content: "Type is not valid. Number (0-36)" });
            }
        } else {
            return interaction.editReply({ embeds: [embed] });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function runRoulette(interaction, space, args, client) {
    //// RUN ROULETTE!
    const db = await Roulette.findOne({ guild_id: interaction.guild.id });
    if (db.roulette) {
        // True

        /// Save History bets
        await betSave(interaction.guild.id, space, args, interaction.user.id);

        /// Remove Money
        await revMoney(interaction.guild.id, interaction.user.id, args);

        const data = await Roulette.findOne({ guild_id: interaction.guild.id });

        const cooldown = new Date(data.time);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCSeconds()} seconds`;

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on the \`${space}\` space.`)
            .setFooter({ text: `Time remaining: ${time_format}` });

        interaction.editReply({ embeds: [embed] });
    } else {
        // False
        
        /// Save History bets
        await betSave(interaction.guild.id, space, args, interaction.user.id);

        /// Remove Money
        await revMoney(interaction.guild.id, interaction.user.id, args);

        /// Run Random roulette
        await getNumber(interaction.guild.id);

        /// Update time!
        const data = await Roulette.findOne({ guild_id: interaction.guild.id });

        if (data.time == 0) {
            await Roulette.findOneAndUpdate({ guild_id: interaction.guild.id }, { time: Date.now() + (data.time_remaining * 1000) });
        }

        await Roulette.findOneAndUpdate({ guild_id: interaction.guild.id }, { roulette: true });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on the \`${space}\` space.`)
            .setFooter({ text: `Time remaining: 30 seconds` });

        interaction.editReply({ embeds: [embed] });

        /// wait 30 seconds!
        await delay(30000);

        /// give money to winners
        await payoutWinners(interaction.guild.id);

        /// send msg winners
        await sendMsg(interaction, interaction.guild.id);

        /// Delete database
        await data.delete();
    }
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}