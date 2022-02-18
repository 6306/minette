const Discord = require('discord.js')
const config = require('./config/config.json')
const loadCommands = require('./commands/core/load-commands.js')
const commandBase = require('./commands/core/command-base.js')
const loadUtils = require(`./utils/load-utils.js`)
const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'], ws: { properties: { $browser: "Discord iOS" }}})

client.on("ready", () => {
    loadCommands(client)
    commandBase.listen(client)
    loadUtils(client)
    if(config.commandErrors) console.log(`Command Errors: Enabled`)
    if(config.reply) console.log(`Reply Utility: Enabled`)
    if(config.verifyNotice) console.log(`Verify Notification: Enabled`)
    if(config.verifyWelcome) console.log(`Verify Welcome Notification: Enabled`)
    if(config.autoDm) console.log(`Verify Auto DM: Enabled`)
    if(config.cleanupVerify) console.log(`Verify Cleanup: Enabled`)
    if(config.usernameLogging) console.log(`Username Logging: Enabled`)
    if(config.dbConnection) { console.log(`MongoDB Link: Enabled`) } else { console.log(`MongoDB Link: Disabled. Some commands may not work or be limited in function.`)}
    console.log('Minette ready!')
})

process.on('unhandledRejection', error => {
    if(error.code !== 50013) {
         console.error('Something Happened! ', error)
    }
    return
})

client.login(config.token)

