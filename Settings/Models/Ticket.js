const mongoose = require("mongoose");

const CreateTicket = new mongoose.Schema({
    guild_id: String,
    user_id: String,
    gacha_cooldown: Number,
    gacha_cooldown_time: Number,
    common_ticket: Number,
    uncommon_ticket: Number,
    rare_ticket: Number,
    epic_ticket: Number,
    legendary_ticket: Number,
    mythical_ticket: Number,
    guarantee_leg: Number,
    guarantee_myth: Number,
});

module.exports = mongoose.model("Ticket", CreateTicket);