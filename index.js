const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    shards: 'auto',
    allowedMentions: { parse: ["users", "roles"] },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ]
});

client.config = require("./settings/config.js");
client.owner = client.config.OWNER_ID;
client.dev = client.config.DEV_ID;
client.color = client.config.EMBED_COLOR;

if(!client.token) client.token = client.config.TOKEN;

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

["slash"].forEach(x => client[x] = new Collection());
["loadCommands", "loadEvents", "loadDatabases", "loadCreate", "loadAuction"].forEach(x => require(`./handlers/${x}`)(client));

client.login(client.token);