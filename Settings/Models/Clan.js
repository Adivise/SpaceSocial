const mongoose = require("mongoose");

const CreateClan = new mongoose.Schema({
    guild_id: String,
	clan_name: String,
    clan_level: Number,
    clan_tag: String,
    clan_description: String,
    clan_icon: String,
    clan_banner: String,
    clan_owner: String,
    clan_created: Number,
    clan_members: Array,
    clan_alliance: Array,
    clan_money: Number,
    clan_chat: String,
    clan_role: String,
    member_limit: Number,
});

module.exports = mongoose.model("Clan", CreateClan);