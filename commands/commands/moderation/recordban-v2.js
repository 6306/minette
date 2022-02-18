const Discord = module.require('discord.js');
const mongoose = module.require(`mongoose`)
const recordSchema = module.require(`../../../config/schemas/records-schema.js`)

module.exports = {
  commands: 'recordban' ,
  description: 'Records Bans',
  requiredRoles: [ ],
  permissions: ['MANAGE_MESSAGES'],
  callback: async (message, arguments, text, client) => {
    // this just checks if we only get messages from who we want 
    let userFilter = m => m.author.id === message.author.id
    let avatar = message.author.displayAvatarURL()
    message.delete()
    let inputMessage = await message.channel.send(`First, send the id of a user you'd like to log`) 

    //collection for messages, we then check it and then continue if it works
    let inputID = await message.channel.awaitMessages({filter: userFilter, max: 1, time: 15000, errors: ['time']}).catch(error => {
        message.channel.send('Timeout due to inactivity').then(msg => {
          setTimeout(() => msg.delete(), 10000)
        } )
        return
    })
    if (typeof inputID == 'undefined') {
      inputMessage.delete()
      return
    }
    if(isNaN(inputID.map(msg => msg.content).join(' '))) {
      message.channel.send('Wrong input! Respond with a user id.').then(msg => {
        setTimeout(() => msg.delete(), 10000)
      })
      message.channel.messages.fetch({ limit: 1}).then(messages => {
        let responseMessage =  messages.filter(m => m.author.id === message.author.id)
        message.channel.bulkDelete(responseMessage) 
      })
      inputMessage.delete()
      return
    }
    let userID = inputID.map(msg => msg.content).join(' ')

    // check if the user is valid, if not just scrap it all
    let userCheck = await client.users.fetch(userID).catch(err => false)
    if (!userCheck) {
      message.channel.send('User id was invalid!').then(msg => {
        setTimeout(() => msg.delete(), 10000)
      })
      message.channel.messages.fetch({ limit: 1}).then(messages => {
        let responseMessage =  messages.filter(m => m.author.id === message.author.id)
        message.channel.bulkDelete(responseMessage) 
      })
      inputMessage.delete()
      return
    }

    inputMessage.delete()
    message.channel.messages.fetch({ limit: 1}).then(messages => {
      let responseMessage =  messages.filter(m => m.author.id === message.author.id)
      message.channel.bulkDelete(responseMessage) 
    })

    //this is a function just to clean things up thats all
    const inputFunction = async (string, timeout) => {
      let textMessage = await message.channel.send(`${string}`)
      let userInput = await message.channel.awaitMessages({filter: userFilter, max: 1, time: timeout, errors: ['time']}).catch(error => {
        message.channel.send('Timeout due to inactivity').then(msg => {
          setTimeout(() => msg.delete(), 10000)
        } )
        return
    })
    if(typeof userInput == 'undefined') {
      textMessage.delete()
      return
    }
    let processedInput = userInput.map(msg => msg.content).join(' ')
    textMessage.delete()
    message.channel.messages.fetch({ limit: 1}).then(messages => {
      let responseMessage =  messages.filter(m => m.author.id === message.author.id)
      message.channel.bulkDelete(responseMessage) 
    })
    return processedInput
    } 

    let offenseReason = await inputFunction('Supply an offense', 600000)
    let reasonText = await inputFunction('Supply a reason', 1200000)
    

    //stylish embed 
    let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
    let embed = new Discord.MessageEmbed()
    .setColor('#f20000')
    .setTitle(`${userCheck.tag} was banned.`)
    .setDescription(` **User**: ${userCheck} (${userCheck.id}) \n **Offense**: ${offenseReason} \n **Reason**: ${reasonText}`)
    .setFooter({text: `Logged by ${message.member.user.tag} on ${date} ET`, iconURL: `${avatar}`})
   
    let sentMessage = await message.channel.send({embeds: [embed]})

  
    let saveMessage = await message.channel.send(`Saving...`)
    let recordLog = {
      user: `${userCheck.id}`,
      type: `BAN`,
      offense: `${offenseReason}`,
      reason: `${reasonText}`,
      date: `${date}`,
      url: `${sentMessage.url}`
    }
     try {
      await new recordSchema(recordLog).save()
    } catch (err) {
      saveMessage.edit(`Failed to save due to ${err}!`)
          setTimeout(() => {
            saveMessage.delete()
          }, 10000);
         return 
    }
    saveMessage.edit(`Saved record successfully!`)
          setTimeout(() => {
            saveMessage.delete()
          }, 10000);
          return 
  },
}
