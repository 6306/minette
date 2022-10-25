const Discord = module.require('discord.js')
const { loggingChannel, messageLogging } = require('../../config/config.json')
const axios = require(`axios`)

module.exports = async (client) => {
    if(!messageLogging) return
    let lChannel = await client.channels.fetch(`${loggingChannel}`).catch(err => {return false})
    if(!lChannel) return console.log(`The channel ${loggingChannel} does not exist! Check your config file.`)
    client.on("messageDelete", async (message) => {
        if (message.partial) {
            try {
              await message.fetch();
            } catch (err) {
              return console.log(`something went wrong when fetching this message: ${err}`)
            }
        }
        if(message.author.bot == true) return
        let logs = await message.guild.fetchAuditLogs({type: 72});
        let entry = logs.entries.first();
        const { author, content, attachments, channel } = message
        const getBase64 = url => {
            return axios
              .get(url, {
                responseType: 'arraybuffer'
              })
              .then(response => Buffer.from(response.data, 'binary').toString('base64'))
          }
          const getUploadLimitForGuild = guild => {
            switch (guild.premiumTier) {
              case 'TIER_3': return 104857600
              case 'TIER_2': return 52428800
              default: return 8388608
            }
          }
        //console.log(attachments == true)
        let grabbedAttachment = []
        if(attachments) {
            for(const attachment of attachments) {
                //console.log(attachment[1].size)
                let attachmentName = attachment[1].name
                let currentAttachment
                if(attachment[1].size < 8388608) {
                currentAttachment = await getBase64(attachment[1].attachment)
                } else {
                currentAttachment = `N/A`
                }
                grabbedAttachment.push({attachment: currentAttachment, attachmentTitle: attachmentName, attachmentSize: attachment[1].size, attachmentURL: attachment[1].attachment})
            }
        }
        let lChannel = await client.channels.fetch(`${loggingChannel}`)
        let deletionMessage = `Message from **${author.tag}** deleted in **${channel.name}**`
        if(entry) {
            let { executor, target } = entry
            if (target.id === message.author.id) {
            deletionMessage += ` by **${executor.tag}**`
            }
        }
        let messageContent = content
        if(content === '') {
            messageContent = 'No message provided'
        }
        if(content.length > 1024) {
            messageContent = messageContent.substring(0, 1024)
        }
        let avatar = message.author.displayAvatarURL()
        let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
        let embed = new Discord.EmbedBuilder()
        .setColor(0xf20000)
        .setAuthor({name: `${author.tag}`, iconURL: avatar})
        .setDescription(`${deletionMessage}`)
        .addFields(
            { name: `Content`, value: `${messageContent}`}
        )
        .setTimestamp()
        lChannel.send({embeds: [embed]})
        
        if(grabbedAttachment.length > 0 && attachments) {
            // let buffer = Buffer.from(grabbedAttachment, 'base64')
            // let attachment = new Discord.MessageAttachment(buffer, attachmentName)
            // lChannel.send({files: [attachment]})
            let index = 1
            for(let attachment of grabbedAttachment) {
            //console.log(attachment.attachmentTitle)
            if(attachment.attachmentSize < 8388608) { 
             let buffer = Buffer.from(attachment.attachment, 'base64')
             let sentAttachment = new Discord.AttachmentBuilder(buffer, {name: `${attachment.attachmentTitle}`})
             lChannel.send({content:`Deleted attachment ${index} out of ${grabbedAttachment.length}`, files: [sentAttachment]})
            } else {
            lChannel.send(`Deleted attachment ${index} out of ${grabbedAttachment.length}, ${attachment.attachmentURL}`)   
            }
             index++
            }
        }
        }
    )
}



