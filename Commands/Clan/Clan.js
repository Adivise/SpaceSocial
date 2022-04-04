const Clan = require("../../Settings/Models/Clan.js");
const Member = require("../../Settings/Models/Member.js");
const { MessageEmbed, MessageCollector } = require("discord.js");
const { ClanPage } = require("../../Structures/Pagination.js");
const Config = require("../../Settings/Clan.js");
const humanizeDuration = require("humanize-duration");

const pendings = {};

module.exports = { 
    name: "clan",
    description: "All clan related commands.",
    options: [
        {
            name: "create",
            description: "Create a clan.",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "The name of the clan.",
                    type: 3,
                    required: true,
                }
            ],
        },
        {
            name: "disband",
            description: "Disband your clan.",
            type: 1,
        },
        {
            name: "info",
            description: "Get information about clans.",
            type: 1,
            options: [
                {
                    name: "tag",
                    description: "The tag clan you want to get information about.",
                    type: 3,
                    required: true,
                }
            ],
        },
        {
            name: "invite",
            description: "Invite user to your clan.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to invite.",
                    type: 6, /// 6 = User
                    required: true,
                }
            ],
        },
        {
            name: "kick",
            description: "Kick a member from your clan.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user to kick from your clan.",
                    type: 6, /// 6 = User
                    required: true,
                }
            ],
        },
        {
            name: "leave",
            description: "Leave your clan.",
            type: 1,
        },
        {
            name: "list",
            description: "Display clan list in guild!",
            type: 1,
            options: [
                {
                    name: "page",
                    description: "The page you want to get information about.",
                    type: 4, /// 4 = Integer
                    required: false
                }
            ],
        },
        {
            name: "tranfer",
            description: "Transfer ownership of your clan.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user to transfer ownership to.",
                    type: 6, /// 6 = User
                    required: true,
                }
            ],
        },
        {
            name: "alliance",
            description: "Add/Remove a clan to your alliance.",
            type: 1,
            options: [
                {
                    name: "type",
                    description: "Add or remove a clan to your alliance.",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Add",
                            value: "add"
                        },
                        {
                            name: "Remove",
                            value: "remove"
                        }
                    ]
                },
                {
                    name: "tag",
                    description: "The tag clan you want to add/remove to your alliance.",
                    type: 3,
                    required: true,
                }
            ],
        },
        {
            name: "buy",
            description: "Buy a clan item.",
            type: 2,
            options: [
                {
                    name: "chat",
                    description: "Buy a clan chat for all clan member.",
                    type: 1,   
                },
                {
                    name: "levelup",
                    description: "Upgrade your clan to the next level.",
                    type: 1,
                },
                {
                    name: "rename",
                    description: "Rename your clan. & 50+ Characters!",
                    type: 1,
                    options: [
                        {
                            name: "new",
                            description: "The new name for your clan.",
                            type: 3, /// 3 = String
                            required: true,
                        }
                    ],
                },
                {
                    name: "role",
                    description: "Buy a clan role for all clan member.",
                    type: 1,
                    options: [
                        {
                            name: "color",
                            description: "The color of the role.",
                            type: 3,
                            required: true,
                        }
                    ],
                },
                {
                    name: "voice",
                    description: "Buy a clan voice for all clan member.",
                    type: 1,
                },
                {
                    name: "update",
                    description: "Update clan for all clan member.",
                    type: 1,
                }
            ],
        },
        {
            name: "setting",
            description: "Change your clan settings.",
            type: 2,
            options: [
                {
                    name: "icon",
                    description: "Setting for the clan icon.",
                    type: 1,
                    options: [
                        {
                            name: "image",
                            description: "The image you want to set as the clan icon.",
                            type: 3, /// 3 = String
                            required: true,
                        }
                    ],
                },
            ],
        },
        {
            name: "leaderboard",
            description: "View the clan leaderboard.",
            type: 2,
            options: [
                {
                    name: "level",
                    description: "View the top level clans in guild.",
                    type: 1,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: 4, /// 4 = Integer
                            required: false
                        }
                    ],
                },
                {
                    name: "member",
                    description: "View the top member count clans in guild.",
                    type: 1,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: 4, /// 4 = Integer
                            required: false
                        }
                    ],
                },
                {
                    name: "money",
                    description: "View the top money clans in guild.",
                    type: 1,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: 4, /// 4 = Integer
                            required: false
                        }
                    ],
                }
            ],
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getSubcommand() === "create") {
            const clanName = interaction.options.getString("name");
            const clanTag = clanName.toLowerCase().replace(/ /g, '-');
            const clanIcon = "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png";
    
            const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
    
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (clan) return interaction.editReply("You already have a clan");
    
            const inClan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: interaction.user.id });
            if (inClan) return interaction.editReply("You are already in a clan");
    
            const aClanN = await Clan.findOne({ guild_id: interaction.guild.id, clan_name: clanName });
            if (aClanN) return interaction.editReply("That clan name is already taken");
    
            const aClanT = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanTag });
            if (aClanT) return interaction.editReply("That clan name is already taken");
    
            if (clanName.length > Config.CLAN_CHARACTER) return interaction.editReply(`Please provide a clan name lower than \`${Config.CLAN_CHARACTER}\` characters`);

            if (user.money < Config.CREATE_CLAN) return interaction.editReply(`You need \`$${numberWithCommas(Config.CREATE_CLAN)}\` coins to create a clan `);

            user.money -= Config.CREATE_CLAN;
            await user.save();
    
            const newClan = new Clan({
                guild_id: interaction.guild.id,
                clan_name: clanName,
                clan_tag: clanTag,
                clan_icon: "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png",
                clan_banner: "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png",
                clan_owner: interaction.user.id,
                clan_created: Date.now(),
                clan_members: [interaction.user.id],
                clan_description: "No Description",
                clan_alliance: [],
                clan_role: "",
                clan_money: 0,
                clan_level: 1,
                member_limit: Config.MAX_MEMBER,
            });
    
            await newClan.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Created")
                    .setDescription(`Clan \`[${clanName}]\` has been created`)
                    .setThumbnail(clanIcon)
                    .setFooter({ text: `Clan Tag: ${clanTag}` });
    
                return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "disband") {
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            await clan.delete().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Deleted")
                    .setDescription(`\`${interaction.user.tag}\` *has deleted clan*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "info") {
            const clanName = interaction.options.getString("tag");

            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanName });
            if (!clan) return interaction.editReply("Clan not found");

            const embed = new MessageEmbed()
                .setAuthor({ name: `Clan of ${clan.clan_name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(client.color)
                .setDescription(`Use the \`/top\` command to view your clan rank.`)
                .addField("Name:", `\`${clan.clan_name}\``, true)
                .addField("Owner:", `\`${client.users.cache.get(clan.clan_owner).username}\``, true)
                .addField("Level:", `\`${clan.clan_level}\``, true)
                .addField("Money:", `\`$${numberWithCommas(clan.clan_money)}\``, true)
                .addField("Created:", `\`${humanizeDuration(Date.now() - clan.clan_created, { largest: 1 })} ago\``, true)
                .addField("Alliance:", `\`${clan.clan_alliance.length}/5\``, true)
                .addField("Members:", `\`${clan.clan_members.length}/${clan.member_limit}\``, true)
                .setThumbnail(clan.clan_icon)
                .setTimestamp()
                .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "invite") {
            const member = interaction.options.getUser("user");

            if (member.id === interaction.user.id) return interaction.editReply("You can't add yourself");
            if (member.bot) return interaction.editReply("You can't add bots");

            /// Sent message went already sent
            for(const requester in pendings) {
                const receiver = pendings[requester];
                if (requester === interaction.user.id) { 
                    interaction.editReply("You already have a sending invitation"); 
                    return;
                } else if (receiver === interaction.user.id) {
                    interaction.editReply("You already have a receiving invitation"); 
                    return;
                } else if (requester === member.id) {
                    interaction.editReply("This user already has a pending invitation"); 
                    return;
                } else if (receiver === member.id) {
                    interaction.editReply("This user already has a receiving invitation"); 
                    return;
                }
            }

            /// Try to create new database went this member not have!
            await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js
    
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
            
            /// This member already in another clan
            const inClan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: member.id });
            if (inClan) return interaction.editReply("This member is already in a clan");

            if (clan.clan_members.includes(member.id)) return interaction.editReply("This member is already in your clan");
            if (clan.clan_members.length >= clan.member_limit) return interaction.editReply("Your clan is full");
    
            const embeded = new MessageEmbed()
                .setColor(client.color)
                .setTitle("Clan Invite")
                .setDescription(`\`${member.tag}\` *Type [Yes/No] to response!*`)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Clan Tag: ${clan.clan_tag} | Response Time: 30s` });
    
    
            const Boxed = await interaction.editReply({ embeds: [embeded] });

            pendings[interaction.user.id] = member.id;
    
            const filter = (m) => m.author.id === member.id && (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no");
            const collector = new MessageCollector(interaction.channel, { filter: filter, time: 30000 });
    
            collector.on('collect', async (message) => {
                const content = message.content.toLowerCase();
                if (content === ('yes').toLocaleLowerCase()) {
                    await clan.clan_members.push(member.id);
    
                    await clan.save().then( async () => {
                        const embed = new MessageEmbed()
                            .setColor(client.color)
                            .setTitle("Clan Invite")
                            .setDescription(`\`${member.tag}\` *has accepted your clan invite*`)
                            .setThumbnail(clan.clan_icon)
                            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                        // Delete pending request
                        delete pendings[interaction.user.id];
                        await message.reply({ embeds: [embed] });
                        return collector.stop();
                    });
                } else if (content === ('no').toLocaleLowerCase()) {
    
                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle("Clan Invite")
                        .setDescription(`\`${member.tag}\` *has declined your clan invite*`)
                        .setThumbnail(clan.clan_icon)
                        .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                    // Delete pending request
                    delete pendings[interaction.user.id];
                    await message.reply({ embeds: [embed] });
                    return collector.stop();
                }
            });
    
            collector.on('end', async (collected, reason) => {
                if(reason === "time") {
                    // Delete pending request
                    delete pendings[interaction.user.id];
                    await Boxed.edit({ content: "No response.", embeds: [] })
                    return collector.stop();
                }
            });
        }
        if (interaction.options.getSubcommand() === "kick") {
            const member = interaction.options.getUser("user");
        
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            if (member.id === interaction.user.id) return interaction.editReply("You can't kick yourself");
            if (!clan.clan_members.includes(member.id)) return interaction.editReply("This member is not in your clan");
            if (clan.clan_members.length === 1) return interaction.editReply("You can't kick the last member from your clan");
    
            await clan.clan_members.splice(clan.clan_members.indexOf(member.id), 1);
            await clan.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Kick")
                    .setDescription(`\`${member.tag}\` *has been kicked from your clan*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "leave") {
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: interaction.user.id });
            if (!clan) return interaction.editReply("You are not in a clan");
    
            const owner = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (owner) return interaction.editReply("You can't leave your clan while you are the owner");
    
            await clan.updateOne({ $pull: { clan_members: interaction.user.id } }).then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Leave")
                    .setDescription(`\`${interaction.user.tag}\` *has left the clan*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "list") {
            const args = interaction.options.getInteger("page");

            const clan = await Clan.find({ guild_id: interaction.guild.id });
          //  if (!clan) return interaction.editReply("There are no clans");
    
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
                    .setAuthor({ name: `Clan's - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Clans' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${clan.length} • Total Clans`});
    
                pages.push(embed);
            }
    
            if (!args) {
                if (pages.length == pagesNum && clan.length > 10) ClanPage(client, interaction, pages, 30000, clan.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
        if (interaction.options.getSubcommand() === "tranfer") {
            const member = interaction.options.getUser("user");

            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            if (member.id === interaction.user.id) return interaction.editReply("You can't transfer your clan to yourself");
            if (member.bot) return interaction.editReply("You can't transfer your clan to a bot");
    
            await clan.clan_owner.pull(interaction.user.id);
            await clan.clan_owner.push(member.id);
            await clan.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Transfer")
                    .setDescription(`\`${interaction.user.tag}\` *has transferred owner clan to* \`${member.tag}\``)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "alliance") {
            let clanName = interaction.options.getString("tag");

            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanName });
            if (!clan) return interaction.editReply("Clan not found");
    
            let currentClan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
    
            if(interaction.options._hoistedOptions.find(c => c.value === "add")) {
                if (clan.clan_owner === interaction.user.id) return interaction.editReply("You cannot add your own clan to your alliance");
    
                if (currentClan.clan_alliance.length >= Config.MAX_ALLIANCE) return interaction.editReply("Your alliance is full");
                if (currentClan.clan_alliance.includes(clan.clan_tag)) return interaction.editReply("This clan is already in your alliance");
    
                await currentClan.clan_alliance.push(clan.clan_name);
                await currentClan.save().then(() => {
                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle("Clan Alliance")
                        .setDescription(`\`${clan.clan_name}\` *has been added to your alliance*`)
                        .setThumbnail(clan.clan_icon)
                        .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                return interaction.editReply({ embeds: [embed] });
                });
            }
    
            if(interaction.options._hoistedOptions.find(c => c.value === "remove")) {
                if (clan.clan_owner === interaction.user.id) return interaction.editReply("You cannot remove your own clan to your alliance");
    
                if (!currentClan.clan_alliance.includes(clan.clan_name)) return interaction.editReply("This clan is not in your alliance");
        
                await currentClan.clan_alliance.splice(currentClan.clan_alliance.indexOf(clan.clan_name), 1);
                await currentClan.save().then(() => {
                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle("Clan Alliance")
                        .setDescription(`\`${clan.clan_name}\` *has been removed from your alliance*`)
                        .setThumbnail(clan.clan_icon)
                        .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
        
                return interaction.editReply({ embeds: [embed] });
                });
            }
        }
        if (interaction.options.getSubcommand() === "chat") {
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            const role = await Clan.findOne({ guild_id: interaction.guild.id, clan_role: { $in: interaction.member.roles.cache.map(r => r.id) } });
            if (!role) return interaction.editReply("You need to buy a clan role to use this command");
    
            const channel = interaction.guild.channels.cache.find(channel => channel.name === `${clan.clan_tag}-chat`);
            if (channel) return interaction.editReply(`You already have this clan chat ${channel}`);
    
            if (clan.clan_money < Config.CHAT_COST) return interaction.editReply(`You need at least \`$${numberWithCommas(Config.CHAT_COST)}\` coins to buy a clan chat`);
            if (clan.clan_level < Config.CHAT_LEVEL) return interaction.editReply(`You need to be level \`${Config.CHAT_LEVEL}\` to buy a clan chat`);
    
            clan.clan_money -= Config.CHAT_COST;
            await clan.save();

            await interaction.guild.channels.create(`${clan.clan_tag}-chat`, { 
                type: "GUILD_TEXT", 
                topic: `Clan Chat for ${clan.clan_name}`,
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: clan.clan_owner,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'MANAGE_MESSAGES'],
                    },
                    {
                        id: clan.clan_role,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
                    }
                ]
            }).then(async (channel) => {
                await channel.send(`Welcome to the clan chat ${interaction.member}`);
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Chat")
                    .setDescription(`\`${interaction.user.tag}\` *has bought a clan chat*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "levelup") {
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            if (clan.clan_level === 10) return interaction.editReply("Your clan is already at the max level");
            /// Need money to upgrade
            if (clan.clan_level === 1) {
                if (clan.clan_money < Config.CLAN_LVL_1) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_1)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_1;
    
            } else if (clan.clan_level === 2) {
                if (clan.clan_money < Config.CLAN_LVL_2) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_2)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_2;
    
            } else if (clan.clan_level === 3) {
                if (clan.clan_money < Config.CLAN_LVL_3) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_3)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_3;
    
            } else if (clan.clan_level === 4) {
                if (clan.clan_money < Config.CLAN_LVL_4) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_4)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_4;
    
            } else if (clan.clan_level === 5) {
                if (clan.clan_money < Config.CLAN_LVL_5) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_5)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_5;
    
            } else if (clan.clan_level === 6) {
                if (clan.clan_money < Config.CLAN_LVL_6) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_6)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_6;
    
            } else if (clan.clan_level === 7) {
                if (clan.clan_money < Config.CLAN_LVL_7) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_7)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_7;
    
            } else if (clan.clan_level === 8) {
                if (clan.clan_money < Config.CLAN_LVL_8) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_8)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_8;
    
            } else if (clan.clan_level === 9) {
                if (clan.clan_money < Config.CLAN_LVL_9) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_9)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_9;
    
            } else if (clan.clan_level === 10) {
                if (clan.clan_money < Config.CLAN_LVL_10) return interaction.editReply(`You need \`$${numberWithCommas(Config.CLAN_LVL_10)}\` coins to upgrade your clan`);
                clan.clan_money -= Config.CLAN_LVL_10;
            }
    
            clan.clan_level++;
            clan.member_limit += Config.INCREASE_MEMBER;
            
            await clan.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan LevelUp")
                    .setDescription(`\`${interaction.user.tag}\` *has upgraded clan to level* \`${clan.clan_level}\``)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "rename") {
            const clanName = interaction.options.getString("new");
            const clanTag = clanName.toLowerCase().replace(/ /g, '-');
    
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            if (clan.clan_name === clanName) return interaction.editReply("You already have that name");
            if (clan.clan_tag === clanTag) return interaction.editReply("You already have that name");
            if (clan.clan_money < Config.RENAME_COST) return interaction.editReply(`You need at least \`$${numberWithCommas(Config.RENAME_COST)}\` coins to rename your clan`);
            if (clan.clan_level < Config.RENAME_LEVEL) return interaction.editReply(`You need to be level \`${Config.RENAME_LEVEL}\` to rename your clan`);
    
            if (args.length > Config.RENAME_CHARACTER) return interaction.editReply("Please provide a name under 50 characters");
    
            clan.clan_money -= Config.RENAME_MONEY;
            clan.clan_name = args;
            await clan.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Rename")
                    .setDescription(`${interaction.user} *has changed the name*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "role") {
            const args = interaction.options.getString("color");
            if(!args.startsWith("#")) return interaction.editReply("Please provide a valid hex color code.");
    
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            const role = interaction.guild.roles.cache.find(role => role.name === `${clan.clan_name}`);
            if (role) return interaction.editReply("You already have this clan role");
    
            if (clan.clan_money < Config.ROLE_COST) return interaction.editReply(`You need at least \`$${numberWithCommas(Config.RENAME_COST)}\` coins to buy a clan role`);
            if (clan.clan_level < Config.ROLE_LEVEL) return interaction.editReply(`You need to be level \`${Config.ROLE_LEVEL}\` to buy a clan role`);
    
            clan.clan_money -= Config.ROLE_COST;
            await clan.save();

            await interaction.guild.roles.create({
                name: `${clan.clan_name}`,
                color: args,
                permissions: ["VIEW_CHANNEL"],
                mentionable: true,
            }).then(async (role) => {
                await clan.updateOne({ clan_role: role.id }).then( async () => {
                    await clan.clan_members.forEach(async (member) => {
                        await interaction.guild.members.fetch(member).then(async (member) => {
                            await member.roles.add(role);
                        });
                        const embed = new MessageEmbed()
                            .setColor(client.color)
                            .setTitle("Clan Role")
                            .setDescription(`\`${interaction.user.tag}\` *has bought a clan role*`)
                            .setThumbnail(clan.clan_icon)
                            .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                        return interaction.editReply({ embeds: [embed] });
                    });
                });
            });
        }
        if (interaction.options.getSubcommand() === "voice") {
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            const role = await Clan.findOne({ guild_id: interaction.guild.id, clan_role: { $in: interaction.member.roles.cache.map(r => r.id) } });
            if (!role) return interaction.editReply("You need to buy a clan role to use this command");
    
            const channel = interaction.guild.channels.cache.find(channel => channel.name === `${clan.clan_name}`);
            if (channel) return interaction.editReply(`You already have this clan voice ${channel}`);
    
            if (clan.clan_money < Config.VOICE_COST) return interaction.editReply(`You need at least \`$${numberWithCommas(Config.VOICE_COST)}\` coins to buy a clan voice`);
            if (clan.clan_level < Config.VOICE_LEVEL) return interaction.editReply(`You need to be level \`${Config.VOICE_LEVEL}\` to buy a clan voice`);
    
            clan.clan_money -= Config.VOICE_COST;
            await clan.save();

            await interaction.guild.channels.create(`${clan.clan_name}`, { 
                type: "GUILD_VOICE", 
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'CONNECT'],
                    },
                    {
                        id: clan.clan_owner,
                        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
                    },
                    {
                        id: clan.clan_role,
                        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
                    }
                ]
            }).then(async (channel) => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Voice")
                    .setDescription(`\`${interaction.user.tag}\` *has bought a clan chat*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "update") {
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            if (clan.clan_money < Config.UPDATE_COST) return interaction.editReply(`You need at least \`$${numberWithCommas(Config.UPDATE_COST)}\` coins to rename your clan`);
            if (clan.clan_level < Config.UPDATE_LEVEL) return interaction.editReply(`You need to be level \`${Config.UPDATE_LEVEL}\` to rename your clan`);
    
            clan.clan_money -= Config.UPDATE_COST;
            await clan.save();

            await clan.clan_members.forEach(async (member) => {
                await interaction.guild.members.fetch(member).then(async (member) => {
                    await member.roles.add(clan.clan_role);
                });
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Update")
                    .setDescription(`\`${interaction.user.tag}\` *has update the clan.*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
                return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "icon") {
            let args = interaction.options.getString("image");

            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");
    
            if (!args.startsWith("http")) return interaction.editReply("*Please provide a valid link*");
            let ends = [".png", ".gif", ".jpg", ".jpeg", ".webp"];
            if (!ends.some(e => args.endsWith(e))) return interaction.editReply(`*Please provide a valid image*, *\`End with ${ends.join(", ")}\`*`);
    
            clan.clan_icon = args;
            await clan.save().then(() => {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle("Clan Icon")
                    .setDescription(`\`${interaction.user.tag}\` has changed the icon of their clan`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "level") {
            const args = interaction.options.getInteger("page");

            const clan = await Clan.find({ guild_id: interaction.guild.id });
    
            let pagesNum = Math.ceil(clan.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            /// Sort by Levels
    
            clan.sort((a, b) => {
                return b.clan_level - a.clan_level;
            });
    
            const clanStrings = [];
            for (let i = 0; i < clan.length; i++) {
                const e = clan[i];
                clanStrings.push(
                    `**${i + 1}. ${e.clan_name}** \`(Level ${e.clan_level})\` • ${client.users.cache.get(e.clan_owner).tag}
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = clanStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new MessageEmbed()
                    .setAuthor({ name: `Top Level of Clans`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Clans' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${clan.length} • Total Clans`});
    
                pages.push(embed);
            }
    
            if (!args) {
                if (pages.length == pagesNum && clan.length > 10) ClanPage(client, interaction, pages, 30000, clan.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
        if (interaction.options.getSubcommand() === "member") {
            const args = interaction.options.getInteger("page");

            const clan = await Clan.find({ guild_id: interaction.guild.id });
    
            let pagesNum = Math.ceil(clan.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            /// Sort by Members Counts
    
            clan.sort((a, b) => {
                return b.clan_members.length - a.clan_members.length;
            });
    
            const clanStrings = [];
            for (let i = 0; i < clan.length; i++) {
                const e = clan[i];
                clanStrings.push(
                    `**${i + 1}. ${e.clan_name}** \`(Member ${e.clan_members.length})\` • ${client.users.cache.get(e.clan_owner).tag}
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = clanStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new MessageEmbed()
                    .setAuthor({ name: `Top Member of Clans`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Clans' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${clan.length} • Total Clans`});
    
                pages.push(embed);
            }
    
            if (!args) {
                if (pages.length == pagesNum && clan.length > 10) ClanPage(client, interaction, pages, 30000, clan.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
        if (interaction.options.getSubcommand() === "money") {
            const args = interaction.options.getInteger("page");

            const clan = await Clan.find({ guild_id: interaction.guild.id });
    
            let pagesNum = Math.ceil(clan.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            /// Sort by Money
    
            clan.sort((a, b) => {
                return b.clan_money - a.clan_money;
            });
    
            const clanStrings = [];
            for (let i = 0; i < clan.length; i++) {
                const e = clan[i];
                clanStrings.push(
                    `**${i + 1}. ${e.clan_name}** \`(Money $${numberWithCommas(e.clan_money)})\` • ${client.users.cache.get(e.clan_owner).tag}
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = clanStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new MessageEmbed()
                    .setAuthor({ name: `Top Money of Clans`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Clans' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${clan.length} • Total Clans`});
    
                pages.push(embed);
            }
    
            if (!args) {
                if (pages.length == pagesNum && clan.length > 10) ClanPage(client, interaction, pages, 30000, clan.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}