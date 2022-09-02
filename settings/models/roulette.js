const mongoose = require("mongoose");

const CreateRoulette = new mongoose.Schema({
    guild_id: String,
    roulette: Boolean,
    history: Array,
    space: Array,
    data: Array,
    time_remaining: Number,
    time: Number,
});

module.exports = mongoose.model("Roulette", CreateRoulette);