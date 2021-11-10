const Discord = module.require('discord.js');
const { embedChannel } = require('../../../config/config.json')
const embedJSON2 = require('../../../config/embeds/embeds-1.json')
const embedJSON1 = require('../../../config/embeds/embeds-2.json')

module.exports = {
  commands: 'embedupdate' ,
  description: 'N/A',
  requiredRoles: [ ],
  permissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
  callback: async (message, arguments, text, client) => {
    let fetchedChannel = await client.channels.fetch(`${embedChannel}`)
    if(!fetchedChannel) return console.log(`The channel ${embedChannel} is invalid!`)
    message.delete()
    let statusMessage = await message.channel.send(`Configuring embeds in <#${embedChannel}>...`)

    //------------------------------------------------------
    // here's how you setup more embeds for this mess of a command
    // setup your embeds from top (being the largest number) and bottom (being 0) 
    // attach it at the end of the row of embed right under this comment
    // hope to god it works
    // and thats pretty much it
    //------------------------------------------------------

    let embed1 = new Discord.MessageEmbed()
    .setTitle(`${embedJSON2.name}`)
    .setDescription(embedJSON2.content)
    .setImage(`${embedJSON2.image}`)
    .setColor(`${embedJSON2.color}`)
    let embed2 = new Discord.MessageEmbed()
    .setTitle(`${embedJSON1.name}`)
    .setDescription(embedJSON1.content)
    .setImage(`${embedJSON1.image}`)
    .setColor(`${embedJSON1.color}`)

    //we check if any messages from ourselves is here    
    let botMessages = await fetchedChannel.messages.fetch()
    let filteredMessages = await botMessages.filter(m => m.author.id === client.user.id && typeof m.embeds[0] !== 'undefined' && m.embeds[0].type == 'rich')
    let numberCount = 1
    if (typeof filteredMessages.first() === 'undefined') {
        await fetchedChannel.send({embeds: [embed1]})
        await fetchedChannel.send({embeds: [embed2]})

        statusMessage.edit(`Finished **adding** all embeds in <#${embedChannel}>!`)
      return
    }
//   so basically if we arent undefined then delete, yeah it might be easier to edit but this just saves the hassle for now
//    nvm lol we out here editing messages now  i guess??
    if(typeof filteredMessages.first() !== 'undefined') {
      filteredMessages.forEach(msg => {
        let embed = new Discord.MessageEmbed()
        embed.setTitle(eval(`embedJSON${numberCount}.name`))
        embed.setDescription(eval(`embedJSON${numberCount}.content`))
        embed.setColor(eval(`embedJSON${numberCount}.color`))
        embed.setImage(eval(`embedJSON${numberCount}.image`))
        msg.edit({embeds: [embed]})
        numberCount = numberCount + 1
      })
      statusMessage.edit(`Finished **updating** all embeds in <#${embedChannel}>!`)
      return
   } 


  },
}
