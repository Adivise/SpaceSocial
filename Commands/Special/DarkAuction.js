const DarkAuction = require("../../Settings/Models/DarkAuction.js");
const { MessageEmbed } = require("discord.js");
const Config = require("../../Settings/DarkAuction.js");

module.exports = { 
    name: "darkauction",
    description: "DarkAuction.",
    options: [
        {
            name: "start",
            description: "Start a DarkAuction.",
            type: 1,
            options: [
                {
                    name: "role",
                    description: "The role you want to auction.",
                    type: 8, /// 8 = Role
                    required: true
                },
                {
                    name: "price",
                    description: "The price you want to auction.",
                    type: 4,
                    required: true
                },
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`You need the \`Manage Server\` permission to use this command.`);

        if (interaction.options.getSubcommand() === "start") {

                const role = interaction.options.getRole("role");
                const price = interaction.options.getInteger("price");

                const auction = await DarkAuction.findOne({ guild_id: interaction.guild.id });
                if (auction.enabled === true) {
                    interaction.editReply("DarkAuction is already running.");
                    return;
                }

                const MessageStart = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
                    .setDescription(`
                    **Role:** ${role.name}
                    **Starting Bid:** $${numberWithCommas(price * Config.MUTLIPLIER)} Coins
                    **Bidder:** No bids yet.
                    `)
                    .setFooter({ text: `Time remaining: 120 seconds` });

                await interaction.guild.channels.create(`dark-auction`, { 
                    type: "GUILD_TEXT", 
                    topic: `Dark Auction: Selling ${role.name} for $${numberWithCommas(price * Config.MUTLIPLIER)} Coins`,
                    parent: interaction.channel.parentId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        }
                    ]
                }).then(async (channel) => {
                    await channel.send({ embeds: [MessageStart] }).then(async (message) => {
                        await DarkAuction.findOneAndUpdate({ guild_id: interaction.guild.id }, {
                            guild_id: interaction.guild.id,
                            enabled: true,
                            channel_id: channel.id,
                            message_id: message.id,
                            item: role.name,
                            price: price,
                            old_price: price,
                            bidder: "",
                            ended: true,
                            history: [],
                        }, { upsert: true });

                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
                        .setDescription(`
                        **Role:** ${role.name}
                        **Price:** $${numberWithCommas(price * Config.MUTLIPLIER)} Coins
                        `)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setFooter({ text: `Started by ${interaction.user.tag}`, icon_url: interaction.user.displayAvatarURL() });
        
                    return interaction.editReply({ embeds: [embed] });
                });
            });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}