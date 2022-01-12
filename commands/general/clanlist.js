const Schema = require('../../assets/Clan');
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');
const page = require('../../assets/page');

module.exports = { 
    config: {
        name: "clanlist",
        description: "List all the clans.",
        usage: "<page>",
        category: "general",
        accessableby: "Member",
        aliases: ["clans"]
    },
    run: async (client, message, args) => {
        const clan = await Schema.find({});
        if (!clan) return message.channel.send("There are no clans");

        let pagesNum = Math.ceil(clan.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const clanStrings = [];
        for (let i = 0; i < clan.length; i++) {
            const e = clan[i];
			clanStrings.push(
				`**${i + 1}. ${e.clan_name}** \`[${humanizeDuration(Date.now() - e.clan_created, { largest: 1 })}]\` • ${client.users.cache.get(e.clan_owner).tag}
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = clanStrings.slice(i * 10, i * 10 + 10).join('');

			const embed = new MessageEmbed()
                .setAuthor({ name: `Clans - ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setColor('#000001')
				.setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
				.setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${clan.length} • Total Clans`});

			pages.push(embed);
		}

		if (!args[0]) {
			if (pages.length == pagesNum && clan.length > 10) page(client, message, pages, ['⏮', '⏭'], 30000, clan.length);
			else return message.channel.send({ embeds: [pages[0]] });
		}
		else {
			if (isNaN(args[0])) return message.channel.send('Page must be a number.');
			if (args[0] > pagesNum) return message.channel.send(`There are only ${pagesNum} pages available.`);
			const pageNum = args[0] == 0 ? 1 : args[0] - 1;
			return message.channel.send({ embeds: [pages[pageNum]] });
		}
    }
}