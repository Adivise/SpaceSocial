const Member = require("../../Settings/Models/Member.js");
const Ticket = require("../../Settings/Models/Ticket.js");
const Config = require("../../Settings/Gacha.js");
const { MessageEmbed } = require("discord.js");

module.exports = { 
    name: "gacha",
    description: "Gacha to get a random item.",
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
        const ticket = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        if (user.money < Config.GACHA_COST) return interaction.editReply(`You need ${numberWithCommas(Config.GACHA_COST)} coins to open gacha.`);

        const cooldown = new Date(ticket.gacha_cooldown);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if(ticket.gacha_cooldown > Date.now()) {
            return interaction.editReply(`You can't gacha yet, you have to wait \`${time_format}\``);
        }

        const tickets = Config.NAME_GACHA;

        /// Open 10 roll Next Update!
        // Common chance = ECT%
        // Uncommon chance = 30%
        // Rare chance = 20%
        // Epic chance = 10%
        // Legendary chance = 0.5%
        // Mythical chance = 0.1%

        /// Guarantee Round 90 get Legendary | 180 get Mythical
        /// Open +1 count Guarantee per round
        /// Got reset went get Legendary | Mythical

        const chance = Math.random() * 100;
        let item = "";

        if (ticket.guarantee_leg >= Config.GUARANTEE_LEG) {
            /// Legendary
            item = tickets[4];
            ticket.guarantee_leg = 0;
            ticket.guarantee_myth += 1;
            ticket.legendary_ticket += 1;
        } else if (ticket.guarantee_myth >= Config.GUARANTEE_MYTH) {
            /// Mythical
            item = tickets[5];
            ticket.guarantee_myth = 0;
            ticket.mythical_ticket += 1;
        } else {
            if (chance <= 0.1) { /// < 0.1%
                /// MYTHICAL
                item = tickets[5];
                ticket.mythical_ticket += 1;
                ticket.guarantee_myth = 0;
            } else if  (chance <= 0.5) { /// < 0.5%
                /// LEGENDARY
                item = tickets[4];
                ticket.guarantee_leg = 0;
                ticket.guarantee_myth += 1;
                ticket.legendary_ticket += 1;
            } else if (chance <= 10) { /// < 10%
                /// EPIC
                item = tickets[3];
                ticket.guarantee_leg += 1;
                ticket.guarantee_myth += 1;
                ticket.epic_ticket += 1;
            } else if (chance <= 20) { /// < 20%
                /// RARE
                item = tickets[2];
                ticket.guarantee_leg += 1;
                ticket.guarantee_myth += 1;
                ticket.rare_ticket += 1;
            } else if (chance <= 30) { /// < 30%
                /// UNCOMMON
                item = tickets[1];
                ticket.guarantee_leg += 1;
                ticket.guarantee_myth += 1;
                ticket.uncommon_ticket += 1;
            } else { /// anything have!
                /// COMMON
                item = tickets[0];
                ticket.guarantee_leg += 1;
                ticket.guarantee_myth += 1;
                ticket.common_ticket += 1;
            }
        }

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`\`${interaction.user.tag}\` *has gotten* \`${item} 🎫\``)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `Guarantee (Legendary ${Config.GUARANTEE_LEG - ticket.guarantee_leg}) & (Mythical ${Config.GUARANTEE_MYTH - ticket.guarantee_myth}) Rounds` });

        interaction.editReply({ embeds: [embed] });

        ticket.gacha_cooldown = Date.now() + (ticket.gacha_cooldown_time * 1000);
        user.money -= Config.GACHA_COST;

        await ticket.save();
        await user.save();

      //  const role = client.guilds.cache.get(interaction.guild.id).roles.cache.find(r => r.name === item);

      //  const alreadyHave = interaction.member.roles.cache.find(r => r.id === role.id);
      //  if(alreadyHave) return interaction.followUp("Dupicate item. you already have this item.");

      //  await interaction.member.roles.add(role);
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}