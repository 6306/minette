const Discord = require('discord.js')
const config = require('./config/config.json')
const loadCommands = require('./commands/core/load-commands.js')
const commandBase = require('./commands/core/command-base.js')
const replyUtil = require('./utils/response.js')
const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']})

process.on('unhandledRejection', error => {
    if(error.code !== 50013) {
        console.error('something broke', error)
        return
    }
    return
})

client.on("ready", () => {
    console.log('Rest ready!')
    if(config.commandErrors) console.log(`Command Errors: Enabled`)
    if(config.reply) console.log(`Reply Utility: Enabled`)
    if(config.verifyNotice) console.log(`Verify Notification: Enabled`)
    if(config.verifyWelcome) console.log(`Verify Welcome Notification: Enabled`)
    loadCommands(client)
    commandBase.listen(client)
    replyUtil(client)
})

client.on("ready", async () => {
    if (!config.cleanupVerify) return
    console.log('Cleanup Enabled, Ready')
    let verifyC = await client.channels.cache.get(`${config.verifyChannel}`)
    if(!verifyC) return console.log(`verify channel is invalid or doesnt exist`)
    setInterval(async () => {
        verifyC.messages.fetch().then(messages => {
          let fMessages = messages.filter(m => m.author.id !== config.noDeleteID.find((id) => id == config.noDeleteID))
          verifyC.bulkDelete(fMessages)
      })
    }, 1800000);
    })


client.login(config.token)

