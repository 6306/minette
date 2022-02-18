const Discord = module.require('discord.js')
const { autoDm, verifyChannel } = require('../../config/config.json')

module.exports = (client) => {
    client.on("guildMemberAdd", async (member) => {
       if(!autoDm) return
        try {
            await member.user.send(`something something test message`)
        } catch (err) {
            setTimeout(async () => {
            let textChannel = await client.channels.fetch(`${verifyChannel}`)
            let message = await textChannel.send(`${member}`)
            message.delete()
            }, 600000)
        }
        }
    )
}
