const Discord = module.require('discord.js');

module.exports = {
  commands: 'ping' ,
  description: 'N/A',
  callback: (message, arguments, text) => {
    let embed = new Discord.MessageEmbed()
    .setColor('#00FF00')
    .setTitle(`Yes I'm alive`)
    message.channel.send({ embeds: [embed] })
  },
}
