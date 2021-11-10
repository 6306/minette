# Rest v2
Bot base used for primarily for one thing, done in javascript. Continuation of [this](https://github.com/Stovven/rest) project.  

## things it can do
* **Ping**: embed that just shows if its infact alive (ms time todo)
* **Say**: says what it does, talk as the bot. requires userID to be included in *commandID*
* **Verify**: verify server members by a command, requires *verifyChannel* and *verifyRole* to work
* **Response Module**: turned off by default, make it go scream at people if someone says a thing.
* **game**: remake of "its okay i guess" to fit with discord, now with messages (buggy)

**Requires Manage Messages**
* **RecordBan, RecordMute, Note, RecordWatchlist**: requires *Manage Messages* role applied to user to work, might hiccup if also not given *Manage Messages* to the bot as it uses it to clean up afterwards. Can be used to record moderation actions.  

**Requires Administrator**
* **Embedupdate**: produce and update embeds, can be changed in *config/embeds*



# Configuration
```json 
{
    "token" : "TOKEN GOES HERE",
    "prefix": "r!",
    "commandErrors": false,
    "reply": false,
    "commandID": ["123456789123456789"],
    "noDeleteID": ["123456789123456789"],
    "verifyChannel": "123456789123456789",
    "verifyRole": "123456789123456789",
    "verifyNotice": true,
    "verifyNoticeChannel": "123456789123456789",
    "verifyWelcome": true,
    "verifyWelcomeChannel": "123456789123456789",
    "verifyPicture": "https://example.com/image.png",
    "verifyInfo": "123456789123456789", 
    "cleanupVerify": true,
    "serverName": "SERVER NAME",
    "embedChannel": "123456789123456789",
    "itsOkayChannel": ["123456789123456789"],
    "itsNotOkayUserID": ["123456789123456789"],
    "botChannel": "123456789123456789"
}
```
* **Token**: Your bot token, can be accessed at [here](https://discord.com/developers/applications)
* **prefix**: bot prefix
* **commandErrors**: set to *true* if you want the bot to display permission errors, by default is *false*
* **reply**: reply to a very specific string if set to *true*, can be changed in *./utils/response.js*. by default is set to *false*
* **commandID**: user IDs allowed to use a specific command, used for *say*
* **noDeleteID**: user IDs to not get deleted with *cleanupVerify*
* **verifyChannel**: Channel to use *verify* on
* **verifyRole**: role to apply if *verify* is successful
* **verifyNotice**: toggle to send notifcations if someone passes verification
* **verifyNoticeChannel**: channel to send notifications in
* **verifyWelcome**: toggle to send welcome messages to someone who just passed verification
* **verifyWelcomeChannel**: channel to send welcome messages in
* **verifyPicture**: picture to send with the welcome message
* **verifyInfo**: info channel to send people there
* **cleanupVerify**: clean up the verify channel every 30 minutes
* **serverName**: your server name! used for the welcome message
* **infoChannel**: used for embedinfo, just to not send it accidentally
* **manualChannel**: same deal but with embedmanual
* **itsOkayChannel**: channels to use for the "its okay" game
* **itsNotOkayUserID**: stupid naming joke, stop someones messages showing up from the "its okay" game
* **botChannel**: lock special commands to the bot channel (game)

its possible to rename *verify* to whatever you want if you wish, located at *./commands/commands/text/verify.js*

# Embeds

Info and Manual embeds run on two systems

**Info Embed**
```json
{
    "name" : "here are the very awesome rules",
    "content" : "1. dont do something?? \n 2. dont do another thing",
    "image": "https://example.com/image.png",
    "color": "#B00B69"
}   
```
* **Name**: the title of your embed
* **Content**: __**Line breaks will break json formating, use \n to line break!**__ content of your embed
* **image**: image of your embed
* **color**: color of your embed

## Adding Embeds
Adding embeds isn't as simple as it seems, isnt *that* hard anyways

In the *commands/management* folder locate the embed command file then at the start add a new line with your json file, remember to rename them if you want to put one in the middle or start.
```javascript
// start of embeds
const embedJSON2 = require('../../../config/embeds/embeds-1.json')
const embedJSON1 = require('../../../config/embeds/embeds-2.json')
// end of embeds
```
Add a new *MessageEmbed* constructor at in the row of embeds, it wont be like this. just config it to be like the count it was.
```javascript
let embed1 = new Discord.MessageEmbed()
.setTitle(`${embedJSON2.name}`)
.setDescription(embedJSON2.content)
.setImage(`${embedJSON2.image}`)
.setColor(`${embedJSON2.color}`)
```
Finally add a new line where the embeds send
```javascript
await message.channel.send({embeds: [embed2]})
```

# Running

To run locally, you'll need [node.js](https://nodejs.org/en/) **v16** and *discord.js* installed

To install discord.js run in cmd in your project folder
```cmd
npm install discord.js
```

to run simply just do
```cmd
node main.js
```

------

*Has known issues about the stupid game command, any other issues make me aware i guess*
