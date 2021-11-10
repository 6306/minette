const Discord = module.require('discord.js');

module.exports = {
  commands: 'recordban' ,
  description: 'N/A',
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
    let userCheck = await client.users.fetch(userID)
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

    //second message
    let offenseMessage = await message.channel.send(`Supply an offense`)
    let inputOffense = await message.channel.awaitMessages({filter: userFilter, max: 1, time: 600000, errors: ['time']}).catch(error => {
      message.channel.send('Timeout due to inactivity').then(msg => {
        setTimeout(() => msg.delete(), 10000)
      } )
      return
  })
  if (typeof inputOffense == 'undefined') {
    offenseMessage.delete()
    return
  }
    let offenseReason = inputOffense.map(msg => msg.content).join(' ')
    offenseMessage.delete()
    message.channel.messages.fetch({ limit: 1}).then(messages => {
      let responseMessage =  messages.filter(m => m.author.id === message.author.id)
      message.channel.bulkDelete(responseMessage) 
    })

    //third message
    let reasonMessage = await message.channel.send(`Supply a reason`)
    let inputReason = await message.channel.awaitMessages({filter: userFilter, max: 1, time: 1200000, errors: ['time']}).catch(error => {
      message.channel.send('Timeout due to inactivity').then(msg => {
        setTimeout(() => msg.delete(), 10000)
      } )
      return
  })
  if (typeof inputReason == 'undefined') {
    reasonMessage.delete()
    return
  }
    let reasonText = inputReason.map(msg => msg.content).join(' ')
    reasonMessage.delete()
    message.channel.messages.fetch({ limit: 1}).then(messages => {
      let responseMessage =  messages.filter(m => m.author.id === message.author.id)
      message.channel.bulkDelete(responseMessage) 
    })

    //stylish embed 
    let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
    let embed = new Discord.MessageEmbed()
    .setColor('#f20000')
    .setTitle(`${userCheck.tag} was banned.`)
    .setDescription(` **User**: ${userCheck} (${userCheck.id}) \n **Offense**: ${offenseReason} \n **Reason**: ${reasonText}`)
    .setFooter(`Logged by ${message.member.user.tag} on ${date} ET`, avatar)
   
    message.channel.send({embeds: [embed]})
  },
}
