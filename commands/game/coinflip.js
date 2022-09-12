const Member = require("../../settings/models/member.js");
const Coinflip = require("../../settings/models/coinflip.js")
const { betSave, revMoney, getResult, payoutWinners, sendMsg } = require("../../structures/Coinflip.js")
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");
const delay = require("delay");

module.exports = { 
    name: "coinflip",
    description: "Play the coinflip game.",
    options: [
        {
            name: "bet",
            description: "The amount of money you want to bet.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "side",
            description: "The side you want to bet on.",
            type: ApplicationCommandOptionType.String, /// 3 = String
            required: true,
        },
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("bet");
        if (args < config.general.coinflip_start) return interaction.editReply(`You can't bet less than \`$${numberWithCommas(config.general.coinflip_start)}\``);

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (args > user.money) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        const string = interaction.options.getString("side");
        const space = string.toLowerCase();

        if (space == "heads" || space == "tails") {
            /// Fill here
            await runCoinflip(interaction, space, args, client);
        } else {
            return interaction.editReply({ content: "You can only place `heads/tails` side." });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function runCoinflip(interaction, space, args, client) {
    //// Run Coinflip!
    const db = await Coinflip.findOne({ guild_id: interaction.guild.id });
    if (db.coinflip) {
        // True

        if(data.time_limit < Date.now()) {
            return interaction.editReply(`You can't bet, you run out of time.`);
        }

        /// Save History bets
        await betSave(interaction.guild.id, space, args, interaction.user.id);

        /// Remove Money
        await revMoney(interaction.guild.id, interaction.user.id, args);

        const data = await Coinflip.findOne({ guild_id: interaction.guild.id });

        const cooldown = new Date(data.time);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCSeconds()} seconds`;

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on \`${space}\``)
            .setFooter({ text: `Time remaining: ${time_format}` });

        interaction.editReply({ embeds: [embed] });
    } else {
        // False
        
        /// Save History bets
        await betSave(interaction.guild.id, space, args, interaction.user.id);

        /// Remove Money
        await revMoney(interaction.guild.id, interaction.user.id, args);

        /// Run Random side coinflip
        await getResult(interaction.guild.id);

        /// Update time!
        const data = await Coinflip.findOne({ guild_id: interaction.guild.id });

        if (data.time == 0) {
            await Coinflip.findOneAndUpdate({ guild_id: interaction.guild.id }, { time: Date.now() + (data.time_remaining * 1000), time_limit: Date.now() + (25 * 1000) });
        }

        await Coinflip.findOneAndUpdate({ guild_id: interaction.guild.id }, { coinflip: true });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on \`${space}\``)
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