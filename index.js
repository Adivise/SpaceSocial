const { Client, Collection, Intents } = require('discord.js');
const { TOKEN } = require('./config.json');

const client = new Client({
    shards: 'auto',
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
});

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

["aliases", "commands"].forEach(x => client[x] = new Collection());
["loadCommands", "loadEvents", "loadDatabases"].forEach(x => require(`./handlers/${x}`)(client));

client.login(TOKEN);