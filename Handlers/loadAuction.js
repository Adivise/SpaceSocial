
const { white, green } = require("chalk");

module.exports = (client) => {
    require("./loadAuction/loadUpdate.js")(client);
    require("./loadAuction/loadContent.js")(client);
    console.log(white('[') + green('INFO') + white('] ') + green('DarkAuction ') + white('Events') + green(' Loaded!'));
};