const Discord = module.require('discord.js');
const { prefix } = require('../../../config/config.json')
const Mongoose = module.require(`mongoose`)
const recordSchema = module.require(`../../../config/schemas/records-schema.js`)

module.exports = {
  commands: 'records' ,
  description: 'Lists all records',
  requiredRoles: [ ],
  permissions: [Discord.PermissionsBitField.Flags.ManageMessages],
  callback: async (message, arguments, text, client) => {
    if(arguments.length === 0) return message.channel.send(`Missing arguments! Proper usage: \`${prefix}records LIST [USERID] | ${prefix}records DELETE [RECORDID]\``)
    if(arguments.length < 2 || arguments.length > 3) return message.channel.send(`Missing arguments! Proper usage: \`${prefix}records LIST [USERID] | ${prefix}records DELETE [RECORDID]\``)

    let recordsChoice = arguments[0]

    switch(recordsChoice) {
      case 'list': {
        let userId = arguments[1]
        let userCheck = await client.users.fetch(userId).catch(err => {return})
        if(!userCheck) return message.channel.send(`This is an invalid user id!`)
        let recordlist = ''
        let recordLog = await recordSchema.find({
          user: `${userId}`
        })
        if(recordLog.length === 0) {
          let embed = new Discord.EmbedBuilder()
          .setTitle(`${userCheck.username}'s History`)
          .setDescription(`There are no records for this user`)
          message.channel.send({embeds: [embed]})
          return
        }
        for (let index = 0; index < recordLog.length; index++) {
          const currentRecord = recordLog[index]
          recordlist += `**Record ID**: ${currentRecord._id.toString()}\n**Date**: ${currentRecord.date}\n**Type**: ${currentRecord.type}`
          if(currentRecord.time) recordlist += `\n**Time**: ${currentRecord.time}`
          recordlist += `\n**Offense/Action**: ${currentRecord.offense}\n**Reason**: ${currentRecord.reason}\n**URL**: ${currentRecord.url}\n\n`
        }
        let embed = new Discord.EmbedBuilder()
        .setTitle(`${userCheck.username}'s History`)
        .setDescription(`${recordlist}`)
        message.channel.send({embeds: [embed]})
        return
      }
      case 'delete': {
        let recordId = arguments[1]
        let recordExists = await recordSchema.exists({
          _id: Mongoose.Types.ObjectId(recordId)
        })
        if(recordExists === null) return message.channel.send(`This record does not exist.`)
        let recordLogArray = await recordSchema.find({
          _id: Mongoose.Types.ObjectId(recordId)
        })
        let recordLog = recordLogArray[0]
        let currentRecord = ''
        currentRecord += `**Record ID**: ${recordLog._id.toString()}\n**Date**: ${recordLog.date}\n**Type**: ${recordLog.type}`
        if(recordLog.time) currentRecord += `\n**Time**: ${recordLog.time}`
        currentRecord += `\n**Offense/Action**: ${recordLog.offense}\n**Reason**: ${recordLog.reason}\n**URL**: ${recordLog.url}`
        currentRecord += `\n\n**This action cannot be reversed!**`
        let embed = new Discord.EmbedBuilder()
        .setTitle(`Delete this record?`)
        .setDescription(currentRecord)
        let finalMessage = await message.channel.send({embeds: [embed]})
        finalMessage.react(`✅`).then(() => finalMessage.react(`❌`))
        let reactFilter = (reaction, user) => {
          return [`✅`, '❌'].includes(reaction.emoji.name) && user.id === message.author.id
        }
        let reactionCollector = await finalMessage.awaitReactions({ filter: reactFilter, max: 1, time: 15000, errors: ['time']}).catch(error => {message.channel.send(`Timeout due to inactivity.`)})
        if (typeof reactionCollector == 'undefined') {
          return
        }
        let reaction = reactionCollector.first()
        if(reaction.emoji.name === '✅') {
          try {
            await recordSchema.deleteOne({
              _id: Mongoose.Types.ObjectId(recordId)
            })
          } catch (err) {
            return message.channel.send(`Failed to delete record`)
          }
          message.channel.send(`Deleted Record.`)
        } else {
          message.channel.send(`Record was not deleted.`)
        }
        return
      }
      default: {
        message.channel.send(`Missing arguments! Proper usage: \`${prefix}records LIST [USERID] | ${prefix}records DELETE [RECORDID]\``)
        return
      }
    }

  },
}   
