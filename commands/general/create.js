const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");
const { CREATE_CLAN_ROLE } = require('../../config.json');

module.exports = { 
    config: {
        name: "create",
        description: "Create a clan",
        usage: "<name>",
        category: "general",
        accessableby: "Member",
        aliases: []
    },
    run: async (client, message, args) => {
        const haveRole = message.member.roles.cache.find(r => r.name === CREATE_CLAN_ROLE);
        if (!haveRole) return message.channel.send(`You do not have role \`${CREATE_CLAN_ROLE}\` to create a clan`);
        const clan = await Schema.findOne({ clan_owner: message.author.id });
        if (clan) return message.channel.send("You already have a clan");
        const inClan = await Schema.findOne({ clan_members: message.author.id });
        if (inClan) return message.channel.send("You are already in a clan");
        const alreadyClan = await Schema.findOne({ clan_name: args.join(" ") });
        if (alreadyClan) return message.channel.send("That clan name is already taken");
        const alreadyClanTag = await Schema.findOne({ clan_tag: args.join(" ") });
        if (alreadyClanTag) return message.channel.send("That clan name is already taken");
        if (!args[0]) return message.channel.send("Please provide a clan name");
        if (args[0].length > 10) return message.channel.send("Please provide a clan name lower than 10 characters");

        const clanName = args.join(" ");
        const clanTag = clanName.toLowerCase().replace(/ /g, '-');
        const clanIcon = "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png";
        const clanBanner = "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png";
        const clanOwner = message.author.id;
        const clanCreated = Date.now();
        const clanMembers = [message.author.id];
        const clanDescription = "";
        const clanAlliance = [];

        const newClan = new Schema({
            clan_name: clanName,
            clan_tag: clanTag,
            clan_icon: clanIcon,
            clan_banner: clanBanner,
            clan_owner: clanOwner,
            clan_created: clanCreated,
            clan_members: clanMembers,
            clan_description: clanDescription,
            clan_alliance: clanAlliance
        });

        newClan.save().then(() => {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Clan Created")
                .setDescription(`Clan \`[${clanName}]\` has been created`)
                .setThumbnail(clanIcon)
                .setFooter({ text: `Clan Tag: ${clanTag}` });

            message.channel.send({ embeds: [embed] });
        });
    }
}