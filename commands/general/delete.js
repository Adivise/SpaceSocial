const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    config: {
        name: "delete",
        description: "Delete your clan.",
        usage: "<link>",
        category: "general",
        accessableby: "Member",
        aliases: []
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (!clan) return message.channel.send("You are not the clan owner");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Deleted")
            .setDescription(`\`${message.author.tag}\` has deleted their clan`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        clan.delete();
    }
}