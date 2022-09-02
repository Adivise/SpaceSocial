module.exports = async(client, message) => {
    if (message.author.bot) return;

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(message.guild.id, message.author.id) /// Can find this module in Handlers/loadCreate.js
        await client.AuctionCreateAndUpdate(message.guild.id)
        await client.Roulette(message.guild.id)
}