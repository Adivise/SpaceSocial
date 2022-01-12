const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    config: {
        name: "kick",
        description: "Kick a member from your clan.",
        usage: "<@mention>",
        category: "general",
        accessableby: "Member",
        aliases: []
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (!clan) return message.channel.send("You are not the clan owner");
        if (!args[0]) return message.channel.send("Please mention a member to kick");
        if (!message.mentions.users.first()) return message.channel.send("Please mention a member to kick");
        if (message.mentions.users.first().id === message.author.id) return message.channel.send("You can't kick yourself");
        if (!clan.clan_members.includes(message.mentions.users.first().id)) return message.channel.send("This member is not in your clan");
        if (clan.clan_members.length === 1) return message.channel.send("You can't kick the last member from your clan");
        if (clan.clan_members.length === 0) return message.channel.send("Your clan is empty");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Kick")
            .setDescription(`\`${message.mentions.users.first().tag}\` has been kicked from your clan`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        clan.clan_members.splice(clan.clan_members.indexOf(message.mentions.users.first().id), 1);
        clan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Kick")
                .setDescription(`Your has been kicked from \`${clan.clan_name}\` clan`)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

            message.mentions.users.first().send({ embeds: [embed] });
        });
    }
}