const Discord = require('discord.js')
const config = require("../../../config/config.json")
const id = config.commandID

module.exports = {
  commands: 'say' ,
  description: 'Say anything as the bot',
  callback: async (message, arguments, text) => {
  if(message.member.permissions.has('MANAGE_MESSAGES') || message.author.id === id.find((id) => id === message.author.id)) {
    message.delete()
    if(arguments.length == 0) return 
    if(!isNaN(arguments[0])) {
    let fetchedMessage = await message.channel.messages.fetch(arguments[0]).catch(error => {
     
    })
    if(fetchedMessage) {
      let originalText = text.split(' ')
      originalText.shift()
      let cleanedText = originalText.join(' ')
      fetchedMessage.reply(cleanedText)
      return
    }
  }
    message.channel.send(text)
  } else {
    let embed = new Discord.MessageEmbed()
    .setColor('#2F3136')
    .setTitle("No")
    message.channel.send({ embeds: [embed]})
  }
  },
}
