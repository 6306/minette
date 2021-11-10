const Discord = module.require('discord.js')
const { reply } = require('../config/config.json')

module.exports = (client) => {
    client.on("messageCreate", (message) => {
        if(!reply) return
        if(message.author.id === client.user.id) return
        const { content } = message
        const arguments = content.split(/[ ]+/)
        const text = arguments.join(" ").toLowerCase()
        if(text.match(/something something funny text/))
            message.channel.send('words')
        }
    )
}
