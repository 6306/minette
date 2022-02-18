# Minette
A discord.js bot base thing, it works i suppose?

## things it can do
* **Ping**: embed that just shows if its infact alive (ms time todo)
* **Say**: says what it does, talk as the bot. requires userID to be included in *commandID* or *manage messages*
* **Verify**: verify server members by a command, requires *verifyChannel* and *verifyRole* to work
* **Response Module**: turned off by default, make it go scream at people if someone says a thing.
* **game**: remake of "its okay i guess" to fit with discord, now with messages
* **blackjack**: its blackjack.

**Requires Manage Messages**
* **RecordBan, RecordMute, Note, RecordWatchlist**: requires *Manage Messages* role applied to user to work, might hiccup if also not given *Manage Messages* to the bot as it uses it to clean up afterwards. Can be used to record moderation actions.  
* **Strike**: Counts Strikes against people.
* **Records**: Lists records of a specific user

**Requires Administrator**
* **EmbedUpdate**: produce and update embeds, can be changed in *config/embeds* 



# Configuration
```json 
{
    "token" : "TOKEN GOES HERE",
    "prefix": "m!",
    "commandErrors": false,
    "reply": false,
    "commandID": ["123456789123456789"],
    "noDeleteID": ["123456789123456789"],
    "verifyChannel": "123456789123456789",
    "verifyRole": "123456789123456789",
    "verifyNotice": false,
    "verifyNoticeChannel": "123456789123456789",
    "verifyWelcome": false,
    "verifyWelcomeChannel": "123456789123456789",
    "verifyPicture": "https://example.com/image.png",
    "verifyInfo": "123456789123456789", 
    "cleanupVerify": false,
    "serverName": "SERVER NAME",
    "infoChannel": "123456789123456789",
    "manualChannel": "123456789123456789",
    "itsOkayChannel": ["123456789123456789"],
    "itsNotOkayUserID": ["123456789123456789"],
    "botChannel": "123456789123456789",
    "autoDm": false,
    "loggingChannel": "123456789123456789",
    "usernameLogging": false,
    "dbConnection": false,
    "dbLink": "something something mongodb link here"
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
* **autoDm**: auto dms users to notice the verification
* **loggingChannel**: channel to log things in (user changes and things of that kind)
* **usernameLogging**: toggle to log usernames
* **dbConnection**: Toggle connection to a database, *some commands may not function without one*
* **dbLink**: Link to your MongoDB database

its possible to rename *verify* to whatever you want if you wish, located at *./commands/commands/text/verify.js*

# Embeds

Info and Manual embeds run on two systems

**Info Embed**
```json
{
    "id": 1,
    "name" : "here are the very awesome rules",
    "content" : "1. dont do something?? \n 2. dont do another thing",
    "image": "https://example.com/image.png",
    "color": "#B00B69"
}   
```
* **Id**: Where you want to place this embed (1st, 2nd, 3rd...)
* **Name**: the title of your embed
* **Content**: __**Line breaks will break json formating, use \n to line break!**__ content of your embed
* **Image**: image of your embed
* **Color**: color of your embed


## Adding Embeds
Adding embeds is actually pretty easy now!

Add an embed using the proper documentation above this. Then delete everything in your embed channel. Finally run the embed command to create the new embeds.



# Running

To run locally, you'll need [node.js](https://nodejs.org/en/) **v16** and *discord.js + mongoose* installed

To install all requirements run in cmd in your project folder
```cmd
npm install 
```

to run simply just do
```cmd
node main.js
```

------

*how does this thing function????*
