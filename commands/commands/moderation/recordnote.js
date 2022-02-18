const Discord = module.require('discord.js');
const { prefix } = require('../../../config/config.json')

module.exports = {
  commands: 'recordnote' ,
  description: 'Record notes with any text in them',
  requiredRoles: [ ],
  permissions: ['MANAGE_MESSAGES'],
  callback: (message, arguments, text, client) => {
    let avatar = message.author.displayAvatarURL()
    message.delete()
    let noteText = text.split(' ')
    if(arguments.length === 0) return message.channel.send(`No message was included. Proper usage: ${prefix}recordnote <message>`)
    const finalNote = noteText.join(' ')
    let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
    let embed = new Discord.MessageEmbed()
    .setColor('#33ff5b')
    .setTitle("Note")
    .setDescription(`${finalNote}`)
    .setFooter(`Logged by ${message.member.user.tag} on ${date} ET`, avatar)
    message.channel.send({embeds: [embed]}).catch(error => {
      message.channel.send(`Something happened to cause this to not send: ${error}`)
    })
  },
}   
