const Discord = module.require(`discord.js`)
const { cleanupVerify, verifyChannel, noDeleteID } = require('../../config/config.json')

module.exports = async (client) => {
        if (!cleanupVerify) return
        let verifyC = await client.channels.cache.get(`${verifyChannel}`)
        if(!verifyC) return console.log(`Verification channel does not exist or is incorrect!`)
        setInterval(async () => {
            verifyC.messages.fetch().then(messages => {
              let fMessages = messages.filter(m => m.author.id !== noDeleteID.find((id) => id == noDeleteID))
              verifyC.bulkDelete(fMessages)
          })
        }, 1800000);
}