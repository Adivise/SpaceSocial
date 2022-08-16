const mongoose = require('mongoose');
const { MONGO_URI } = require('../settings/config.js');
const { white, green } = require('chalk');

module.exports = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(white('[') + green('INFO') + white('] ') + green('Database ') + white('Events') + green(' Loaded!'));
    } catch (error) {
        console.log(error);
    }
} 