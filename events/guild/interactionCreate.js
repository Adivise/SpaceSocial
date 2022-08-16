const { PermissionsBitField, InteractionType, CommandInteraction } = require("discord.js");
const chalk = require('chalk');

/**
 * @param {CommandInteraction} interaction
 */

module.exports = async(client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;

        const command = client.slash.get(interaction.commandName);
        if(!command) return;

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, interaction.user.id) /// Can find this module in Handlers/loadCreate.js
        await client.AuctionCreateAndUpdate(interaction.guild.id)

        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`You are not allowed to use this command.`); 
            return;
        }

        console.log(chalk.magenta(`[COMMAND] ${command.name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`));

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`I don't have the permission to send messages in ${interaction.guild.name}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`I don't have the permission to send embeds in ${interaction.guild.name}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`I don't have the permission to manage messages in ${interaction.guild.name}`);


        try {
            command.run(interaction, client);
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: `Something went wrong, try again later.`, ephmeral: true });
        }
    }
}