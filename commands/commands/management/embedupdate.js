const Discord = module.require('discord.js');
const { embedChannel } = require('../../../config/config.json')
const fs = module.require(`fs`)
const path = module.require(`path`)

module.exports = {
  commands: 'embedupdate' ,
  description: `Updates all embeds in <#${embedChannel}>`,
  requiredRoles: [ ],
  callback: async (message, arguments, text, client) => {
      if(!message.member.permissions.has('ADMINISTRATOR')) return
    let fetchedChannel = await client.channels.fetch(`${embedChannel}`)
    if(!fetchedChannel) return console.log(`The channel ${embedChannel} is invalid!`)
    message.delete()
    let statusMessage = await message.channel.send(`Configuring embeds in <#${embedChannel}>...`)

    // read all files in ./info
    const embedFiles = await fs.readdirSync(`./config/embeds`).filter(file => path.extname(file) === '.json')

    let embedList = [ ]
    let index = 0

    await embedFiles.forEach(async (file) => {
      const embedFile = await fs.readFileSync(path.join(`./config/embeds`, file))
      const embedData = JSON.parse(embedFile)
      embedList.push(embedData)
    })

    //sort by new id tag
    function sort_by_key(array, key)
    {
     return array.sort(function(a, b)
     {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
     });
    }

    let sortedEmbeds = sort_by_key(embedList, 'id')

    //get only embed messages/sort old bot messages with timestamp
    let botMessages = await fetchedChannel.messages.fetch()
    let filteredMessages = await botMessages.filter(m => m.author.id === client.user.id && typeof m.embeds[0] !== 'undefined' && m.embeds[0].type == 'rich')
    let sortedMessages = sort_by_key(filteredMessages, 'createdTimestamp')

    //send embeds/edit embeds
    if (typeof sortedMessages.first() === 'undefined') {
    sortedEmbeds.forEach(async embed => {
      let message = new Discord.MessageEmbed()
      .setTitle(`${embed.name}`)
      .setDescription(`${embed.content}`)
      .setColor(`${embed.color}`)
      .setImage(`${embed.image}`)
      await fetchedChannel.send({embeds: [message]})
    }) 
    statusMessage.edit(`Finished **adding** all embeds in <#${embedChannel}>!`)
  } else {
    sortedMessages.forEach(message => {
      let embed = new Discord.MessageEmbed()
      .setTitle(`${sortedEmbeds[index].name}`)
      .setDescription(`${sortedEmbeds[index].content}`)
      .setColor(`${sortedEmbeds[index].color}`)
      .setImage(`${sortedEmbeds[index].image}`)
      message.edit({embeds: [embed]})
      index++
    });
    statusMessage.edit(`Finished **updating** all embeds in <#${embedChannel}>!`)
  }
  },
}
