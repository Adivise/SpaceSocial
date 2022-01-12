const figlet = require('figlet');
const { PREFIX } = require('../../config.json');
const chalk = require('chalk');

module.exports = async (client) => {
    figlet(client.user.tag, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.red.bold(data));
    });

    let guilds = client.guilds.cache.size;
    let users = client.users.cache.size;
    let channels = client.channels.cache.size;

    const activities = [
        `${PREFIX}help | ${guilds} servers`,
        `${PREFIX}create <clan name> | ${users} users`,
        `${PREFIX}invite <target> | ${channels} channels`,
    ]

    setInterval(() => {
        client.user.setActivity(`${activities[Math.floor(Math.random() * activities.length)]}`, { type: 'WATCHING' });
    }, 15000)

};
