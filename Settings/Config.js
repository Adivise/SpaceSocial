require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: process.env.EMBED_COLOR || "#000001", //<= default is "#000001"
    OWNER_ID: process.env.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488"
    DEV_ID: [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]
    MONGO_URI: process.env.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri
}