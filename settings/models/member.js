const mongoose = require("mongoose");

const CreateMember = new mongoose.Schema({
    guild_id: String,
    user_id: String,
    work_cooldown_time: Number,
    work_cooldown: Number,
    work_multiple: Number,
    money: Number,
    bank: Number,
    rob: Boolean,
    rob_cooldown: Number,
    rob_cooldown_time: Number,
    crime_cooldown: Number,
    crime_cooldown_time: Number,
    crime_multiple: Number,
    vote_cooldown: Number,
    vote_cooldown_time: Number,
    married_to: String,
    married: Boolean,
    rank: String,
    reputation: Number,
});

module.exports = mongoose.model("Member", CreateMember);