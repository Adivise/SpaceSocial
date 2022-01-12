const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");
const { DESC_LIMIT } = require('../../config.json');

module.exports = { 
    config: {
        name: "description",
        description: "Set the description of your clan.",
        usage: "<text>",
        category: "general",
        accessableby: "Member",
        aliases: ["desc"]
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (!clan) return message.channel.send("You are not the clan owner");
        if (!args[0]) return message.channel.send("Please provide a description");
        if (args[0].length > DESC_LIMIT) return message.channel.send("Please provide a description under 150 characters");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Description")
            .setDescription(`${message.author} has changed the description of their clan`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        clan.clan_description = args.join(" ");
        clan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Description")
                .setDescription(`${message.author} has changed the description of their clan`)
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