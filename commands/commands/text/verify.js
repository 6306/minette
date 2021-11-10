const Discord = module.require('discord.js');
const { verifyChannel, verifyRole, verifyNotice, verifyNoticeChannel, verifyWelcomeChannel, verifyWelcome, serverName, verifyInfo, verifyPicture} = require('../../../config/config.json')

module.exports = {
  commands: 'verify' ,
  description: 'N/A',
  maxArgs: 0,
  callback: (message, arguments, text, client) => {
     if(message.channel.id !== verifyChannel) return
    message.member.roles.add(message.member.guild.roles.cache.find(role => role.id === verifyRole))
    message.delete()
    if(verifyNotice) {
    let nChannel = client.channels.cache.get(`${verifyNoticeChannel}`)
    if(!nChannel) return console.log('Notification channel not provided in config, or is just not valid')
    nChannel.send(`${message.member} (${message.member.id}) passed verification!`)
    }
    if(verifyWelcome) {
      let wChannel = client.channels.cache.get(`${verifyWelcomeChannel}`)
      if(!wChannel) return console.log('Welcome channel not provided in config, or is just not valid')
      let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
      let embed = new Discord.MessageEmbed()
      .setColor('#2F3136')
      .setTitle(`Someone has joined!`)
      .setDescription(`Welcome to ${serverName}, ${message.member.user.tag}! \n *Be sure to read <#${verifyInfo}> for rules and other information.*`)
      .setThumbnail(`${verifyPicture}`)
      .setFooter(`Clocked in at ${date} ET`)
      wChannel.send({content: `${message.member}`, embeds: [embed]})
    }
  },
}
