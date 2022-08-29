const Clan = require("../../settings/models/clan.js");
const Member = require("../../settings/models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const { ClanPage } = require("../../structures/Pagination.js");
const config = require("../../settings/default.js");
const humanizeDuration = require("humanize-duration");

const pendings = {};

module.exports = { 
    name: "clan",
    description: "All clan related commands.",
    options: [
        {
            name: "create",
            description: "Create a clan.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the clan.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        },
        {
            name: "disband",
            description: "Disband your clan.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "deposit",
            description: "Deposit your money into your clan.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "amount",
                    description: "The amount you want to deposit.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: "withdraw",
            description: "Withdraw your money from your clan.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "amount",
                    description: "The amount you want to withdraw.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: "info",
            description: "Get information about clans.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "tag",
                    description: "The tag clan you want to get information about.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        },
        {
            name: "invite",
            description: "Invite user to your clan.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The user you want to invite.",
                    type: ApplicationCommandOptionType.User, /// 6 = User
                    required: true,
                }
            ],
        },
        {
            name: "kick",
            description: "Kick a member from your clan.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The user to kick from your clan.",
                    type: ApplicationCommandOptionType.User, /// 6 = User
                    required: true,
                }
            ],
        },
        {
            name: "leave",
            description: "Leave your clan.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "list",
            description: "Display clan list in guild!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "page",
                    description: "The page you want to get information about.",
                    type: ApplicationCommandOptionType.Integer, /// 4 = Integer
                    required: false
                }
            ],
        },
        {
            name: "tranfer",
            description: "Transfer ownership of your clan.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The user to transfer ownership to.",
                    type: ApplicationCommandOptionType.User, /// 6 = User
                    required: true,
                }
            ],
        },
        {
            name: "alliance",
            description: "Add/Remove a clan to your alliance.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "type",
                    description: "Add or remove a clan to your alliance.",
                    type: ApplicationCommandOptionType.String,
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
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        },
        {
            name: "buy",
            description: "Buy a clan item.",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "chat",
                    description: "Buy a clan chat for all clan member.",
                    type: ApplicationCommandOptionType.Subcommand,   
                },
                {
                    name: "levelup",
                    description: "Upgrade your clan to the next level.",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "rename",
                    description: "Rename your clan. & 50+ Characters!",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "new",
                            description: "The new name for your clan.",
                            type: ApplicationCommandOptionType.String, /// 3 = String
                            required: true,
                        }
                    ],
                },
                {
                    name: "role",
                    description: "Buy a clan role for all clan member.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "color",
                            description: "The color of the role.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }
                    ],
                },
                {
                    name: "voice",
                    description: "Buy a clan voice for all clan member.",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "update",
                    description: "Update clan for all clan member.",
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ],
        },
        {
            name: "setting",
            description: "Change your clan settings.",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "icon",
                    description: "Setting for the clan icon.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "image",
                            description: "The image you want to set as the clan icon.",
                            type: ApplicationCommandOptionType.String, /// 3 = String
                            required: true,
                        }
                    ],
                },
            ],
        },
        {
            name: "leaderboard",
            description: "View the clan leaderboard.",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "level",
                    description: "View the top level clans in guild.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: ApplicationCommandOptionType.Integer, /// 4 = Integer
                            required: false
                        }
                    ],
                },
                {
                    name: "member",
                    description: "View the top member count clans in guild.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: ApplicationCommandOptionType.Integer, /// 4 = Integer
                            required: false
                        }
                    ],
                },
                {
                    name: "money",
                    description: "View the top money clans in guild.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: ApplicationCommandOptionType.Integer, /// 4 = Integer
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
    
            if (clanName.length > config.clan.clan_character) return interaction.editReply(`Please provide a clan name lower than \`${config.clan.clan_character}\` characters`);

            if (user.money < config.clan.create_clan) return interaction.editReply(`You need \`$${numberWithCommas(config.clan.create_clan)}\` coins to create a clan `);

            user.money -= config.clan.create_clan;
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
                member_limit: config.clan.max_member,
            });
    
            await newClan.save().then(() => {
                const embed = new EmbedBuilder()
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
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Clan Deleted")
                    .setDescription(`\`${interaction.user.tag}\` *has deleted clan*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
        if (interaction.options.getSubcommand() === "deposit") {
            const args = interaction.options.getString("amount");

            const filters = [
                "+",
                "-"
            ];
    
            for (const message in filters) {
                if (args.includes(filters[message])) return interaction.editReply("You can't do that!");
            }

            if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");
            
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");

            const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
            
            if (args > user.money) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You don't have enough money to deposit this amount.`)
                    .setTimestamp();
    
                return interaction.editReply({ embeds: [embed] });
            }
    
            if (args.toLowerCase() == 'all') { /// DEPOSIT ALL
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You have deposited \`$${numberWithCommas(user.money)}\` into your clan bank.`)
                    .setTimestamp();
    
                interaction.editReply({ embeds: [embed] });
    
                clan.clan_money += user.money;
                user.money = 0;

                await user.save();
                await clan.save();
            } else { /// DEPOSIT AMOUNT
                clan.clan_money += parseInt(args);
                user.money -= parseInt(args);

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You have deposited \`$${numberWithCommas(args)}\` into your clan bank.`)
                    .setTimestamp();

                interaction.editReply({ embeds: [embed] });

                await user.save();
                await clan.save();
            }
        }
        if (interaction.options.getSubcommand() === "withdraw") {
            const args = interaction.options.getString("amount");

            const filters = [
                "+",
                "-"
            ];
    
            for (const message in filters) {
                if (args.includes(filters[message])) return interaction.editReply("You can't do that!");
            }

            if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");
            
            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
            if (!clan) return interaction.editReply("You are not the clan owner");

            const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

            if (args > clan.clan_money) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You clan don't have enough money to withdraw this amount.`)
                    .setTimestamp();
    
                return interaction.editReply({ embeds: [embed] });
            }
    
            if (args.toLowerCase() == 'all') { /// DEPOSIT ALL
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You have withdraw \`$${numberWithCommas(clan.clan_money)}\` from your clan bank.`)
                    .setTimestamp();
    
                interaction.editReply({ embeds: [embed] });

                user.money += clan.clan_money;
                clan.clan_money = 0;
    
                await user.save();
                await clan.save();
            } else { /// DEPOSIT AMOUNT
                clan.clan_money -= parseInt(args);
                user.money += parseInt(args);

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setDescription(`You have withdraw \`$${numberWithCommas(args)}\` from your clan bank.`)
                    .setTimestamp();

                interaction.editReply({ embeds: [embed] });

                await user.save();
                await clan.save();
            }
        }
        if (interaction.options.getSubcommand() === "info") {
            const clanName = interaction.options.getString("tag");

            const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanName });
            if (!clan) return interaction.editReply("Clan not found");

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Clan of ${clan.clan_name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(client.color)
                .setDescription(`Use the \`/clan leaderboard\` command to view your clan rank.`)
                .addFields({ name: "Name:", value: `\`${clan.clan_name}\``, inline: true })
                .addFields({ name: "Owner:", value: `\`${client.users.cache.get(clan.clan_owner).username}\``, inline: true })
                .addFields({ name: "Level:", value: `\`${clan.clan_level}\``, inline: true })
                .addFields({ name: "Money:", value: `\`$${numberWithCommas(clan.clan_money)}\``, inline: true })
                .addFields({ name: "Created:", value: `\`${humanizeDuration(Date.now() - clan.clan_created, { largest: 1 })} ago\``, inline: true })
                .addFields({ name: "Alliance:", value: `\`${clan.clan_alliance.length}/5\``, inline: true})
                .addFields({ name: "Members:",  value: `\`${clan.clan_members.length}/${clan.member_limit}\``, inline: true })
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
    
            const embeded = new EmbedBuilder()
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
                        const embed = new EmbedBuilder()
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
    
                    const embed = new EmbedBuilder()
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
                const embed = new EmbedBuilder()
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
                const embed = new EmbedBuilder()
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
    
                const embed = new EmbedBuilder()
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
    
            // It not array can't pull or push
            clan.clan_owner = member.id;

            await clan.save().then(() => {
                const embed = new EmbedBuilder()
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
    
                if (currentClan.clan_alliance.length >= config.clan.max_alliance) return interaction.editReply("Your alliance is full");
                if (currentClan.clan_alliance.includes(clan.clan_tag)) return interaction.editReply("This clan is already in your alliance");
    
                await currentClan.clan_alliance.push(clan.clan_name);
                await currentClan.save().then(() => {
                    const embed = new EmbedBuilder()
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
                    const embed = new EmbedBuilder()
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
    
            if (clan.clan_money < config.clan.chat_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.chat_cost)}\` coins to buy a clan chat`);
            if (clan.clan_level < config.clan.chat_level) return interaction.editReply(`You need to be level \`${config.clan.chat_level}\` to buy a clan chat`);
    
            clan.clan_money -= config.clan.chat_cost;
            await clan.save();

            await interaction.guild.channels.create({
                name: `${clan.clan_tag}-chat`,
                type: 0, 
                topic: `Clan Chat for ${clan.clan_name}`,
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    },
                    {
                        id: clan.clan_owner,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles', 'ManageMessages'],
                    },
                    {
                        id: clan.clan_role,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'],
                    }
                ]
            }).then(async (channel) => {
                await channel.send(`Welcome to the clan chat ${interaction.member}`);
                const embed = new EmbedBuilder()
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
    
            if (clan.clan_level === config.clan.max_lvl_upgrade) return interaction.editReply("Your clan is already at the max level");
            /// Need money to upgrade
            const formatUpgrade = config.clan.upgrade_start * Math.pow(config.clan.multiple_upgrade, clan.clan_level);
            if (clan.clan_money < formatUpgrade) return interaction.editReply(`You need at least \`$${numberWithCommas(formatUpgrade)}\` coins to upgrade your clan`);
    
            clan.clan_money -= formatUpgrade;
            clan.clan_level++;
            clan.member_limit += config.clan.increase_member;
            
            await clan.save().then(() => {
                const embed = new EmbedBuilder()
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
            if (clan.clan_money < config.clan.rename_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.rename_cost)}\` coins to rename your clan`);
            if (clan.clan_level < config.clan.rename_level) return interaction.editReply(`You need to be level \`${config.clan.rename_level}\` to rename your clan`);
    
            if (args.length > config.clan.rename_character) return interaction.editReply("Please provide a name under 50 characters");
    
            clan.clan_money -= config.clan.rename_cost;
            clan.clan_name = args;
            await clan.save().then(() => {
                const embed = new EmbedBuilder()
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
            if (role) return interaction.editReply("You already have clan role");
    
            if (clan.clan_money < config.clan.role_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.role_cost)}\` coins to buy a clan role`);
            if (clan.clan_level < config.clan.role_level) return interaction.editReply(`You need to be level \`${config.clan.role_level}\` to buy a clan role`);
    
            clan.clan_money -= config.clan.role_cost;
            await clan.save();

            await interaction.guild.roles.create({
                name: `${clan.clan_name}`,
                color: args,
                permissions: ["ViewChannel"],
                mentionable: true,
            }).then(async (role) => {
                await clan.updateOne({ clan_role: role.id }).then( async () => {
                    await clan.clan_members.forEach(async (member) => {
                        await interaction.guild.members.fetch(member).then(async (member) => {
                            await member.roles.add(role);
                        });
                        const embed = new EmbedBuilder()
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
    
            if (clan.clan_money < config.clan.voice_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.voice_cost)}\` coins to buy a clan voice`);
            if (clan.clan_level < config.clan.voice_level) return interaction.editReply(`You need to be level \`${config.clan.voice_level}\` to buy a clan voice`);
    
            clan.clan_money -= config.clan.voice_cost;
            await clan.save();

            await interaction.guild.channels.create({ 
                name: `${clan.clan_name}`,
                type: 2, 
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['ViewChannel', 'Connect'],
                    },
                    {
                        id: clan.clan_owner,
                        allow: ['ViewChannel', 'Connect', 'Speak'],
                    },
                    {
                        id: clan.clan_role,
                        allow: ['ViewChannel', 'Connect', 'Speak'],
                    }
                ]
            }).then(async (channel) => {
                const embed = new EmbedBuilder()
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
    
            if (clan.clan_money < config.clan.update_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.update_cost)}\` coins to rename your clan`);
            if (clan.clan_level < config.clan.update_level) return interaction.editReply(`You need to be level \`${config.clan.update_level}\` to rename your clan`);
    
            clan.clan_money -= config.clan.update_cost;
            await clan.save();

            await clan.clan_members.forEach(async (member) => {
                await interaction.guild.members.fetch(member).then(async (member) => {
                    await member.roles.add(clan.clan_role);
                });
                const embed = new EmbedBuilder()
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
                const embed = new EmbedBuilder()
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
    
                const embed = new EmbedBuilder()
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
    
                const embed = new EmbedBuilder()
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
    
                const embed = new EmbedBuilder()
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