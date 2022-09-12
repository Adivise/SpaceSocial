const mongoose = require("mongoose");

const CreateCoinflip = new mongoose.Schema({
    guild_id: String,
    coinflip: Boolean,
    history: Array,
    space: String,
    data: Array,
    time_remaining: Number,
    time: Number,
    time_limit: Number,
});

module.exports = mongoose.model("Coinflip", CreateCoinflip);