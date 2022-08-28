const mongoose = require("mongoose");

const CreateTicket = new mongoose.Schema({
    guild_id: String,
    user_id: String,
    gacha_cooldown: Number,
    gacha_cooldown_time: Number,
    three_star_ticket: Number,
    four_star_ticket: Number,
    five_star_ticket: Number,
    six_star_ticket: Number,
    guarantee_five_star: Number,
    guarantee_six_star: Number,
});

module.exports = mongoose.model("Ticket", CreateTicket);