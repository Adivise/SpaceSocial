const mongoose = require("mongoose");

const ClanScheme = new mongoose.Schema({
	clan_name: {
		type: String,
	},
    clan_tag: {
        type: String,
    },
    clan_description: {
        type: String,
    },
    clan_icon: {
        type: String,
    },
    clan_banner: {
        type: String,
    },
    clan_owner: {
        type: String,
    },
    clan_created: {
        type: Date,
        default: Date.now
    },
    clan_members: {
        type: Array,
    },
    clan_alliance: {
        type: Array,
    }
});

module.exports = mongoose.model("SpaceClan", ClanScheme);