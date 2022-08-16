const mongoose = require("mongoose");

const CreateAution = new mongoose.Schema({
    guild_id: String,
    item_id: String,
    item_name: String,
    item_price: Number,
    item_seller: String,
});

module.exports = mongoose.model("Auction", CreateAution);