const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    config: {
        name: "tranfer",
        description: "Transfer your clan to another user.",
        usage: "<@mention>",
        category: "general",
        accessableby: "Member",
        aliases: []
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (!clan) return message.channel.send("You are not the clan owner");
        if (!args[0]) return message.channel.send("Please mention a user to transfer your clan to");
        if (!message.mentions.users.first()) return message.channel.send("Please mention a user to transfer your clan to");
        if (message.mentions.users.first().id === message.author.id) return message.channel.send("You can't transfer your clan to yourself");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Transfer")
            .setDescription(`\`${message.author.tag}\` has transferred owner clan to \`${message.mentions.users.first().tag}\``)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        clan.clan_owner.pull(message.author.id);
        clan.clan_owner.push(message.mentions.users.first().id);
        clan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Transfer")
                .setDescription(`\`${message.author.tag}\` has transferred owner clan to \`${message.mentions.users.first().tag}\``)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

            message.mentions.users.first().send({ embeds: [embed] });
        });
    }
}