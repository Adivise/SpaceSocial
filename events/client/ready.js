const { white, green } = require('chalk');

module.exports = async (client) => {

    console.log(white('[') + green('INFO') + white('] ') + green(`${client.user.tag} (${client.user.id})`) + white(` is Ready!`));

    let guilds = client.guilds.cache.size;
    let users = client.users.cache.size;
    let channels = client.channels.cache.size;

    const activities = [
        `/work | ${guilds} servers`,
        `/clan create <clan name> | ${users} users`,
        `/marry <target> | ${channels} channels`,
    ]

    setInterval(() => {
        client.user.setPresence({ 
         activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 2 }], 
         status: 'online', 
        });
    }, 15000)

};
