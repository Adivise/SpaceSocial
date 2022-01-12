const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");

module.exports = { 
    config: {
        name: "icon",
        description: "Set the icon of your clan.",
        usage: "<link>",
        category: "general",
        accessableby: "Member",
        aliases: []
    },
    run: async (client, message, args) => {
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (!clan) return message.channel.send("You are not the clan owner");
        if (!args[0]) return message.channel.send("Please provide a link");
        if (!args[0].startsWith("http")) return message.channel.send("Please provide a valid link");
        let ends = [".png", ".gif", ".jpg", ".jpeg", ".webp"];
        if (!ends.some(e => args[0].endsWith(e))) return message.channel.send("Please provide a valid image");

        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Clan Icon")
            .setDescription(`\`${message.author.tag}\` has changed the icon of their clan`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        message.channel.send({ embeds: [embed] });

        clan.clan_icon = args.join(" ");
        clan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Icon")
                .setDescription(`\`${message.author.tag}\` has changed the icon of their clan`)
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