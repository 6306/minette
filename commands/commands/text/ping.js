const Discord = module.require('discord.js');

module.exports = {
  commands: 'ping' ,
  description: 'Pings to bot to see if its alive',
  callback: (message, arguments, text) => {
    let embed = new Discord.MessageEmbed()
    .setColor('#00FF00')
    .setTitle(`Yes I'm alive. \`${Date.now() - message.createdTimestamp}ms\``)
    message.channel.send({ embeds: [embed] })
  },
}
