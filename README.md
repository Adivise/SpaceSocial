## 📑 Short Feature
- [x] Create Clan (Need Role! can set in `config.json`)
- [x] Add Members (maxed unlimited! can set in `config.json`)
- [x] Modified you clan (Only Owner)
- [x] Easy to use

## 🚨 Have a Problem

✈ Join Discord:  [NanoSpace ♪♪](https://discord.gg/SNG3dh3MbR)
   mention me in chat #general or #javascript and ask problem okay! 👌


## 📎 Requirements

1. Node.js Version 16+ **[Download](https://nodejs.org/en/download/)**
2. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
3. MongaDB **[Download](https://www.mongodb.com/try/download/community)**

## 📚 Installation

```
git clone https://github.com/Adivise/SpaceClan
cd SpaceClan
npm install
```

After installation finishes you can use `node .` to start the bot. or `Run Start.bat`

## 📄 Configuration

Copy or Rename `config.json.example` to `config.json` and fill out the values:

```json
{
    "TOKEN": "TOKEN_HERE",
    "PREFIX": "s#",
    "CREATE_CLAN_ROLE": "SpaceClan",
    "MONGO_URI": "mongodb://127.0.0.1:27017/clans",
    "MEMBER_LIMIT": 10,
    "DESC_LIMIT": 150,
    "ALLIANCE_LIMIT": 5
}
```

## 🔩 Features & Commands

> Note: The default prefix is 's#'

💌 **General Commands!** 

- create (s#create <name>) // create clan
- addalliance (s#aal <target clan>) // add alliance clan
- banner (s#banner <link>) // Set banner of your clan endwith [".png", ".gif", ".jpg", ".jpeg", ".webp"]
- clan (s#clan <target clan>) // Display clan infomation
- clanlist (s#clanlist) // Display clan list
- delete (s#delete) // Disband your clan
- description (s#desc <text>) // Set clan description
- icon (s#icon <link>) // Set icon of your clan endwith [".png", ".gif", ".jpg", ".jpeg", ".webp"]
- invite (s#invite <@mention>) // Add member to your clan
- kick (s#kick <@mention>) // Kick member from your clan
- removealliance (s#ral <target clan>) // Remove clan alliance 
- tranfer (s#tranfer <@mention>) // Tranfer clan owner

💫 **Misc Commands!** 
- help (s#help or s#help <cmd>)
