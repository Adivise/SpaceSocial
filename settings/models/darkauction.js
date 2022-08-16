const mongoose = require("mongoose");

const CreateDarkAuction = new mongoose.Schema({
    guild_id: String,
    enabled: Boolean,
    channel_id: String,
    message_id: String,
    item: String,
    price: Number,
    old_price: Number,
    bidder: String,
    ended: Boolean,
    history: Array,
});

module.exports = mongoose.model("DarkAuction", CreateDarkAuction);