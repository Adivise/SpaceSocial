const Auction = require("../../Settings/Models/Auction.js");
const Member = require("../../Settings/Models/Member.js");
const { AuctionGlobal, AuctionPerson } = require("../../Structures/Pagination.js");
const Config = require("../../Settings/Auction.js");
const { MessageEmbed } = require("discord.js");

module.exports = { 
    name: "auction",
    description: "Auction roles.",
    options: [
        {
            name: "view",
            description: "View the auction. (Global & User)",
            type: 2,
            options: [
                {
                    name: "global",
                    description: "View the global auction.",
                    type: 1,
                    options: [
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: 4, /// 4 = Integer
                            required: false,
                        }
                    ]
                },
                {
                    name: "person",
                    description: "View the user auction.",
                    type: 1,
                    options: [
                        {
                            name: "user",
                            description: "The user you want to view the auction.",
                            type: 6, /// 6 = User
                            required: true,
                        },
                        {
                            name: "page",
                            description: "The page you want to get information about.",
                            type: 4, /// 4 = Integer
                            required: false
                        }
                    ]
                }
            ]
        },
        {
            name: "sell",
            description: "Sell an item. (role seller)",
            type: 1,
            options: [
                {
                    name: "role",
                    description: "The role you want to sell.",
                    type: 8, /// 8 = Role
                    required: true
                },
                {
                    name: "price",
                    description: "The price you want to sell the item for.",
                    type: 4, /// 4 = Integer
                    required: true
                }
            ]
        },
        {
            name: "buy",
            description: "Buy an item. (role buyer)",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to buy the item for.",
                    type: 6, /// 6 = User
                    required: true
                },
                {
                    name: "item_id",
                    description: "The item you want to buy.",
                    type: 4, /// 4 = Integer
                    required: true
                }
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getSubcommand() === "sell") {
            const role = interaction.options.getRole("role");
            const roleList = Config.ROLE_SELLER;

            /// Check if the role is in the list
            if (!roleList.includes(role.name)) {
                interaction.editReply(`You can't sell this role. (Role For Sell: \`${roleList.join(", ")}\`)`);
                return;
            }

            const price = interaction.options.getInteger("price");
            if(price < Config.AUCTION_START) return interaction.editReply(`You can't sell less than \`$${numberWithCommas(Config.AUCTION_START)}\` coins.`);

            const your = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
            const MaxAuction = await Auction.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id }).countDocuments();
            /// Max Auction
            if(MaxAuction >= Config.MAX_AUCTION) return interaction.editReply(`You can't have more than \`${Config.MAX_AUCTION}\` auctions.`);

            /// Tax -5%
            const Tax = price * Config.AUCTION_TAX;
            /// Not have money to pay tax
            if(your.money < Tax) return interaction.editReply(`You can't have less than \`$${numberWithCommas(Tax)}\` to pay the tax.`);

            /// Price - Tax
            const FullTax = price - Tax;

            /// Find role
            const roles = client.guilds.cache.get(interaction.guild.id).roles.cache.find(r => r.name === role.name);
            const alreadyHave = interaction.member.roles.cache.find(r => r.id === roles.id);
            /// RETURN IF YOU DON'T HAVE THE ROLE
            if(!alreadyHave) return interaction.editReply("You don't have this role.");

            /// Generate item id
            const item_id = Math.floor(Math.random() * 100000);
            /// CREATE NEW AUCTION
            const item = new Auction({
                guild_id: interaction.guild.id,
                item_id: item_id,
                item_name: role.name,
                item_price: price,
                item_seller: interaction.user.id,
            });


            await item.save();
            /// REMOVE MONEY BY TAX
            your.money -= Tax;
            await your.save();

            await interaction.editReply(`You have successfully sold the \`${role.name}\` role for \`$${numberWithCommas(FullTax)}\` coins. (Tax: \`-$${numberWithCommas(Tax)}\`)`);

            const embed = new MessageEmbed()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                .setDescription(`
                **Role Name:** \`${role.name}\`
                **Price:** \`$${numberWithCommas(price)}\` **coins**
                **Seller:** ${interaction.user}
                `)
                .setColor("#ff0000")
                .setFooter({ text: `Item ID: ${item_id}`})
                .setTimestamp();

            /// Remove Role 
            await interaction.member.roles.remove(roles);

            const channel = client.channels.cache.get(Config.AUCTION_ALERT);
            await channel.send({ embeds: [embed] });
            
        }

        if (interaction.options.getSubcommand() === "buy") {

            //// FIND USER AND BUY ITEM USE ITEM_ID
            // REMOVE YOUR MONEY AND ADD ITEM TO YOUR INVENTORY
            // ADD MONEY TO SELLER
            // REMOVE ITEM FROM AUCTION

            const item_id = interaction.options.getInteger("item_id");
            const target = interaction.options.getUser("user");

            if(target.bot) return interaction.editReply("You can't buy item from a bot.");

            //// FIND ITEM USE ITEM_ID & ITEM OWNER
            const itemAc = await Auction.findOne({ guild_id: interaction.guild.id, item_id: item_id, item_seller: target.id });

            const your = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

            if (!itemAc) {
                await interaction.editReply("This item doesn't exist.");
                return;
            }

            if (itemAc.item_seller === interaction.user.id) {
                await interaction.editReply("You can't buy your own item.");
                return;
            }

            if (itemAc.item_price > your.money) {
                await interaction.editReply("You don't have enough money to buy this role.");
                return;
            }

            /// FIND ROLE
            const roles = client.guilds.cache.get(interaction.guild.id).roles.cache.find(r => r.name === itemAc.item_name);
            const alreadyHave = interaction.member.roles.cache.find(r => r.id === roles.id);
            /// RETURN IF YOU ALREADY HAVE ROLE
            if(alreadyHave) return interaction.editReply("You already have this role.");

            /// CHECK TARGET
            const targetMoney = await Member.findOne({ guild_id: interaction.guild.id, user_id: target.id });

            /// TAX -5%
            const Tax = itemAc.item_price * Config.AUCTION_TAX;
            /// PRICE - TAX
            const FullTax = itemAc.item_price - Tax;

            await interaction.editReply(`You have successfully bought the \`${itemAc.item_name}\` role for \`$${numberWithCommas(FullTax)}\` coins. (Tax: \`-$${numberWithCommas(Tax)}\`)`);

            const embed = new MessageEmbed()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                .setDescription(`
                **Role Name:** \`${itemAc.item_name}\`
                **Price:** \`$${numberWithCommas(itemAc.item_price)}\` **coins**
                **Buyer:** ${interaction.user}
                `)
                .setColor("#33ff00")
                .setFooter({ text: `Item ID: ${item_id}`})
                .setTimestamp();

            await interaction.member.roles.add(roles);
            /// REMOVE YOUR MONEY AND ADD ROLE
            your.money -= itemAc.item_price;
            await your.save();

            //// ADD MONEY TO SELLER
            targetMoney.money += FullTax;
            await targetMoney.save();

            /// REMOVE THIS ITEM FROM AUCTION
            await itemAc.remove();

            /// SEND TO CHANNEL
            const channel = client.channels.cache.get(Config.AUCTION_ALERT);
            await channel.send({ content: `${interaction.user} & ${target}`, embeds: [embed] });
        }

        if (interaction.options.getSubcommand() === "global") {
            const args = interaction.options.getInteger("page");
            const auction = await Auction.find({ guild_id: interaction.guild.id });

            let pagesNum = Math.ceil(auction.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            /// Sort by Prices
    
            auction.sort((a, b) => {
                return b.item_price - a.item_price;
            });
    
            const auctionStrings = [];
            for (let i = 0; i < auction.length; i++) {
                const e = auction[i];
                auctionStrings.push(
                    `**ID:** ${e.item_id} • \`${e.item_name}\` • \`Price $${numberWithCommas(e.item_price)}\` • ${client.users.cache.get(e.item_seller)}
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = auctionStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new MessageEmbed()
                    .setAuthor({ name: `Auction Global`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Auctions' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${auction.length} • Total Auctions`});
    
                pages.push(embed);
            }
    
            if (!args) {
                if (pages.length == pagesNum && auction.length > 10) AuctionGlobal(client, interaction, pages, 120000, auction.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }

        if (interaction.options.getSubcommand() === "person") {
            const args = interaction.options.getInteger("page");
            const member = interaction.options.getUser("user");
            const mention = member ? member.id : interaction.user.id;

            const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
            const userTag = member ? member.tag : interaction.user.tag;

            const auction = await Auction.find({ guild_id: interaction.guild.id, item_seller: mention });

            let pagesNum = Math.ceil(auction.length / 10);
            if(pagesNum === 0) pagesNum = 1;
            
            /// Sort by Prices

            auction.sort((a, b) => {
                return b.item_price - a.item_price;
            });
    
            const auctionStrings = [];
            for (let i = 0; i < auction.length; i++) {
                const e = auction[i];
                auctionStrings.push(
                    `**ID:** ${e.item_id} • \`${e.item_name}\` • \`Price $${numberWithCommas(e.item_price)}\`
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = auctionStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new MessageEmbed()
                    .setAuthor({ name: userTag, iconURL: avatarURL })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Items' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${auction.length} • Total Items`});
    
                pages.push(embed);
            }
    
            if (!args) {
                if (pages.length == pagesNum && auction.length > 10) AuctionPerson(client, interaction, pages, 120000, auction.length);
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