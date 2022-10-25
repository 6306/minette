const Discord = module.require('discord.js')
const { loggingChannel, usernameLogging } = require('../../config/config.json')

module.exports = (client) => {
    client.on("userUpdate", async (oldUser, newUser) => {
        //console.log(`triggered! ${oldUser} ${newUser}`)
        if(!usernameLogging) return
        if(oldUser.username !== newUser.username) {
            let embed = new Discord.EmbedBuilder()
            let oldUsername = oldUser.username ?? 'N/A'
            let newUsername = newUser.username ?? 'N/A'
            let avatar = newUser.displayAvatarURL()
            embed.setAuthor({name: 'User Changed Name', iconURL: `${avatar}`})
            embed.addFields({ name: 'User', value: `${newUser}`, inline: true},
            { name: 'Old', value: `${oldUsername}`, inline: true},
            { name: 'New', value: `${newUsername}`, inline: true},)
            let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
            embed.setTimestamp()
            embed.setColor('#ffc133')
            let lChannel = await client.channels.fetch(`${loggingChannel}`).catch(err => {return false})
            if(!lChannel) return console.log(`The channel ${loggingChannel} does not exist! Check your config file.`)
            lChannel.send({embeds: [embed]})
        }
        }
    )
}
