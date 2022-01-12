const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");
const { ALLIANCE_LIMIT } = require('../../config.json');

module.exports = { 
    config: {
        name: "add-alliance",
        description: "Add a clan to your alliance.",
        usage: "<clan-name>",
        category: "general",
        accessableby: "Member",
        aliases: ["aal"]
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_tag: args[0].toLowerCase().replace(/ /g, '-') });
        if (!clan) return message.channel.send("Clan not found");
        if (clan.clan_owner === message.author.id) return message.channel.send("You cannot add your own clan to your alliance");
        const currentClan = await Schema.findOne({ clan_owner: message.author.id });
        if (currentClan.clan_alliance.length >= ALLIANCE_LIMIT) return message.channel.send("Your alliance is full");
        if (currentClan.clan_alliance.includes(clan.clan_tag)) return message.channel.send("This clan is already in your alliance");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Alliance")
            .setDescription(`\`${clan.clan_name}\` has been added to your alliance`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        currentClan.clan_alliance.push(clan.clan_name);
        currentClan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Alliance")
                .setDescription(`\`${clan.clan_name}\` has been added to your alliance`)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

            clan.clan_members.forEach(member => {
                client.users.fetch(member).then(user => {
                    user.send({ embeds: [embed] });
                });
            });
        });

    }
}