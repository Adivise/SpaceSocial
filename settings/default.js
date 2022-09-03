/// Default Configrations!

module.exports = {
    gacha: {
        six_stars: [ // You can add more names if you want!
            "Raiden Shotgun",
            "Yea mike",
            "Zhongloy"
        ],
        five_stars: [
            "Gigi",
            "Moanna",
            "Kequiang",
            "Niging",
            "Ventoy"
        ],
        four_stars: [
            "Elgejoy",
            "Enballfing",
            "Sec Sword",
            "Sec Book",
            "Sec Bow",
        ],
        three_stars: [
            "Bull Blade",
            "Deminus",
            "Robux",
            "BTMC",
            "100pp",
        ],
        gacha_price_one_round: 50000, //// 50,000 to open gacha! x1
        gacha_price_ten_round: 500000, /// 500,000 to open gacha! x10
        guarantee_five_star: 90, //// 90 guarantee round! to get legendary! and got reset went get legendary!
        guarantee_six_star: 180, //// 180 guarantee round! to get mythical! and got reset went get mythical!
    },
    auction: {
        role_list: [ // List role name your can sell!
            "Common",
            "Uncommon",
            "Rare",
            "Epic",
            "Legendary",
            "Mythic",
            "Space"
        ],
        auction_tax: 0.05, // 0.05 = 5% // 0.1 = 10%
        max_auction: 5, // max auction
        auction_start: 10000, // need 10,000 to create auction!
        auction_alert: "958231078764687390", // channel id to send alert
    },
    dark_auction: { /// This command can run buy admin only!
        multiple: 2, // x2 when bid multiple of times
        time_remaining: 120, // time remaining to bid 
    },
    general: {
        start_money: 5000,

        // Work Command!
        work_money_min: 50,
        work_money_max: 200,
        work_cooldown_time: 60,
        work_multiple: 1, // default 1 = boost money 100%

        // Crime Command!
        crime_money_min: 1500,
        crime_money_max: 3000,
        crime_cooldown_time: 120,
        crime_chance: 40,
        crime_multiple: 1, // default  1 = boost money 100%

        // Rob Command!
        rob_cooldown_time: 3600,
        rob_chance: 50, // when you rob fail you lose same target money (You have 100 coin you rob 100,000 coin but you lose here -50,000)

        // Roulette Command!
        roulette_start: 100,

        // Coinflip Command!
        coinflip_start: 100,

        // Vote Command!
        vote_cooldown_time: 3600,
    },
    clan: {
        create_clan: 1000000, //// Create clan cost!
        clan_character: 20, //// Clan character limit! (by default 20)
        max_member: 10, //// Max members default!
        max_alliance: 5, //// Max alliance!
    
        /// Upgrade level cost!
        max_lvl_upgrade: 100, // Clan max level 100
        upgrade_start: 100, // Clan start 100 coins
        multiple_upgrade: 3, // x3 when upgrade multiple of times
        increase_member: 5, //// Increase member! went upgrade!
    
        rename_cost: 100000, //// Rename clan cost!
        rename_level: 5, //// Need level 5 to rename clan!
        rename_character: 50, ////Increase +50 character to rename clan!
    
        /// This auto update!
    
        role_cost: 500000, //// Role cost!
        role_level: 7, //// Need level 7 to role clan!
    
        chat_cost: 1000000, //// Chat cost!
        chat_level: 8, //// Need level 8 to chat clan!
    
        voice_cost: 2000000, //// Voice cost!
        voice_level: 10, //// Need level 10 to voice clan!
    
        //// Update need to be than buy role level to working! /// Update = give role to all member agian!
        update_cost: 5000, //// Need 5000 to update clan!
        update_level: 7, //// Need level 7 to update clan!
    },
    shop: {
        work_reduce_cost: 100000, // Work reduce cost!
        reduce_work_cooldown: 5, // Reduce 5s every buy
        max_work_cooldown_time: 29, // Max reduce work cooldown time! 30s

        work_multiple: 1, // Multiple x1 every buy
        work_multiple_max: 5, // Max work multiple!
        work_multiple_cost: 100000, // Work multiple cost!

        crime_reduce_cost: 100000, // Crime reduce cost!
        reduce_crime_cooldown: 5, // Reduce 1s every buy
        max_crime_cooldown_time: 59, // Max reduce crime cooldown time 120 - 59 = 61s

        crime_multiple: 1, // Multiple x1 every buy
        crime_multiple_max: 5, // Max crime multiple!
        crime_multiple_cost: 100000, // Crime multiple cost!

        rob_cost: 500000,
        rob_reduce_cost: 100000, // Rob reduce cost!
        reduce_rob_cooldown: 10, // Reduce 10s every buy
        max_rob_cooldown_time: 999, // Max reduce rob cooldown time!
    },
    exchange: {
        three_to_four: 10, // Example need 10 | 3 star exchange to 1 | 4 star 
        four_to_five: 10, 
        five_to_six: 10, 
    }
}