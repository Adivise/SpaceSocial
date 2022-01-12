const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');

module.exports = { 
    config: {
        name: "clan",
        description: "Get information about your clan.",
        usage: "<name>",
        category: "general",
        accessableby: "Member",
        aliases: []
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send("Please provide a clan name");
        const clan = await Schema.findOne({ clan_tag: args.join(" ").toLowerCase().replace(/ /g, '-') });
        if (!clan) return message.channel.send("Clan not found");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle(`Clan of ${clan.clan_name}`)
            .setDescription(`
            **Owner:** ${client.users.cache.get(clan.clan_owner).tag} 
            **Created At:** ${humanizeDuration(Date.now() - clan.clan_created, { largest: 1 })} ago 
            **Description:** ${clan.clan_description || "No Description"}
            **Alliance:** ${clan.clan_alliance.map(al => al).join(", ") || "No Alliance"}
            **Members:** ${clan.clan_members.length}

            ${clan.clan_members.map(member => client.users.cache.get(member).tag).join(", ")}`
            )
            .setThumbnail(clan.clan_icon)
            .setImage(clan.clan_banner)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });
    }
}