const Discord = module.require('discord.js');
const { embedChannels } = require('../../../config/config.json')
const fs = module.require(`fs`)
const path = module.require(`path`)
const reactionNumbers = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`]

module.exports = {
  commands: 'embedupdate' ,
  description: `Updates all embeds in any specified dedicated embed channel.`,
  permissions: [Discord.PermissionsBitField.Flags.Administrator],
  requiredRoles: [ ],
  callback: async (message, arguments, text, client) => {
    if (embedChannels.length <= 0) return message.channel.send(`No channels set, configure in \`config.json\``)
    // this ones temporary till i can find a better solution for pages
    if (embedChannels.length >= 9) return message.channel.send(`Too many channels set, configure in \`config.json\``)

    let channelListing = []

    for (const listing of embedChannels) {
      let fetchedChannel = await client.channels.fetch(listing).catch(err => {return false})
      if (!fetchedChannel) return message.channel.send(`Unable to fetch ${listing}, check config.`)
      channelListing.push(fetchedChannel)
    }

    let setupEmbed = new Discord.EmbedBuilder()
    .setTitle(`Embed Configuration`)
    .setColor('#ffc133')

    let setupDescription = `Create or update an embed in:\n`

    for (const listing of channelListing) {
      setupDescription += `${channelListing.indexOf(listing) + 1}. ${listing}\n`
    }
    setupEmbed.setDescription(setupDescription)

    let setupMessage = await message.channel.send({embeds: [setupEmbed]})
    
    let validReactions = []

    for (const listing of channelListing) {
      validReactions.push(`${reactionNumbers[channelListing.indexOf(listing)]}`)
      await setupMessage.react(`${reactionNumbers[channelListing.indexOf(listing)]}`)
    }

    let reactFilter = (reaction, user) => {
      return (
        validReactions.includes(reaction.emoji.name) &&
        user.id === message.author.id
      )
    }

    let reactionCollector = await setupMessage.awaitReactions({filter: reactFilter, max: 1, time: 15000, errors: ["time"],}).catch((error) => {message.channel.send(`Timeout due to inactivity.`);})
    if (typeof reactionCollector == "undefined") {
      return
    }

    let workingChannel = channelListing[reactionNumbers.indexOf(reactionCollector.first().emoji.name)]

    await setupMessage.reactions.removeAll()
    setupEmbed.setDescription(`doing something in ${workingChannel}...`)
    setupMessage.edit({embeds: [setupEmbed]})

    let channelMessages = await workingChannel.messages.fetch()

    let filteredMessages = []
    for (const message of channelMessages) {
      if (message[1].embeds[0]?.data.type === `rich`) {
        filteredMessages.push(message[1])
      }
    }

    const embedFiles = await fs.readdirSync(`./config/embeds/${workingChannel.id}`).filter(file => path.extname(file) === '.json')

    let embedList = [ ]

    await embedFiles.forEach(async (file) => {
      const embedFile = await fs.readFileSync(path.join(`./config/embeds/${workingChannel.id}`, file))
      const embedData = JSON.parse(embedFile)
      embedList.push(embedData)
    })

    function sort_by_key(array, key)
    {
     return array.sort(function(a, b)
     {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
     });
    }

    let sortedEmbeds = sort_by_key(embedList, 'id')
    let sortedMessages = sort_by_key(filteredMessages, 'createdTimestamp')
    
    if(sortedMessages <= 0) {
      for (const listing of sortedEmbeds) {
        let embed = new Discord.EmbedBuilder()
        .setTitle(`${listing.name}`)
        .setDescription(`${listing.content}`)
        .setColor(`${listing.color}`)
        listing.author && listing?.author.trim().length !== 0 ? embed.setAuthor(`${listing.author}`) : null
        listing.image && listing?.image.trim().length !== 0 ? embed.setImage(`${listing.image}`) : null
        listing.footer && listing?.footer.trim().length !== 0 ? embed.setFooter({text: `${listing.footer}`}) : null
        await workingChannel.send({embeds: [embed] })
      } 
      setupEmbed.setDescription(`Finished creating embeds in ${workingChannel}`)
      setupMessage.edit({embeds: [setupEmbed]})
    } else {
      let index = 0
      for (const listing of sortedMessages) {
        let embed = new Discord.EmbedBuilder()
        .setTitle(`${sortedEmbeds[index].name}`)
        .setDescription(`${sortedEmbeds[index].content}`)
        .setColor(`${sortedEmbeds[index].color}`)
        sortedEmbeds[index].author && sortedEmbeds[index]?.author.trim().length !== 0 ? embed.setAuthor(`${sortedEmbeds[index].author}`) : null
        sortedEmbeds[index].image && sortedEmbeds[index]?.image.trim().length !== 0 ? embed.setImage(`${sortedEmbeds[index].image}`) : null
        sortedEmbeds[index].footer && sortedEmbeds[index]?.footer.trim().length !== 0 ? embed.setFooter({text: `${sortedEmbeds[index].footer}`}) : null
        await listing.edit({embeds: [embed] })
        index++
      }
      setupEmbed.setDescription(`Finished updating embeds in ${workingChannel}`)
      setupMessage.edit({embeds: [setupEmbed]})
    }

  },
}
