const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");
const { MEMBER_LIMIT } = require('../../config.json');

module.exports = { 
    config: {
        name: "invite",
        description: "Add the member to your clan.",
        usage: "<@mention>",
        category: "general",
        accessableby: "Member",
        aliases: ["add"]
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (!clan) return message.channel.send("You are not the clan owner");
        if (!args[0]) return message.channel.send("Please mention a member to add");
        if (!message.mentions.users.first()) return message.channel.send("Please mention a member to add");
        if (message.mentions.users.first().id === message.author.id) return message.channel.send("You can't add yourself");
        if (message.mentions.users.first().bot) return message.channel.send("You can't add bots");
        if (clan.clan_members.includes(message.mentions.users.first().id)) return message.channel.send("This member is already in your clan");
        if (clan.clan_members.length >= MEMBER_LIMIT) return message.channel.send("Your clan is full");
        if (clan.clan_members.length === 0) return message.channel.send("Your clan is empty");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Add")
            .setDescription(`\`${message.mentions.users.first().tag}\` has been Added to your clan`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        clan.clan_members.push(message.mentions.users.first().id);
        clan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Added")
                .setDescription(`Your has been added to \`${clan.clan_name}\` clan`)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

            message.mentions.users.first().send({ embeds: [embed] });
        });
    }
}