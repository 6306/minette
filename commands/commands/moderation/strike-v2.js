const Discord = module.require('discord.js');
const mongoose = module.require(`mongoose`)
const strikeSchema = module.require(`../../../config/schemas/strike-schema.js`)
const { prefix, serverName, dbConnection } = module.require(`../../../config/config.json`)

module.exports = {
  commands: 'strike' ,
  description: 'Records strikes',
  permissions: ['MANAGE_MESSAGES'],
  callback: async (message, arguments, text, client) => {
    if(!dbConnection) return message.channel.send(`This command requires MongoDB to be enabled.`)
    if(arguments.length === 0) return message.channel.send(`Invalid amount of arguments given. Proper usage: \`${prefix}strike ADD [USERID] | SUBTRACT [USERID] | REMOVE [USERID] | LIST\``)
    if(arguments[0].toLowerCase() !== 'list') {
    if (arguments.length < 2 || arguments.length > 3) return message.channel.send(`Invalid amount of arguments given. Proper usage: \`${prefix}strike ADD [USERID] | REMOVE [USERID] | LIST\``)
    }

    let strikeChoice = arguments[0]
    let userId
    let userCheck

    if(typeof arguments[1] !== "undefined") { 
      userId = arguments[1] 
      userCheck = await client.users.fetch(userId).catch(err => {return})
      if(!userCheck) return message.channel.send(`User Id was invalid! Please try again.`)
    }
    switch (strikeChoice){
        case 'list': {
            let embed = new Discord.MessageEmbed()
            .setTitle(`${serverName}'s Strike list`)
            .setColor(`#ffffff`)
            let strikeList = await strikeSchema.find({})
            //console.log(`Results: `, strikeList)
            if(Object.entries(strikeList).length === 0) {
              embed.setDescription(`There are no users currently`)
              return message.channel.send({embeds : [embed]})
            }
            let userList = ""
            let userCount = 0
            for (let index = 0; index < strikeList.length; index++) {
              const strikedUser = strikeList[index];
              let currentUser
              currentUser = await client.users.fetch(strikedUser.user).catch(err => {
                currentUser = `INVALID USER (${strikedUser.user})`
              })
              //console.log(currentUser, key, value.strike)
              if (strikedUser.strikes === 1) userList += `🟡 `
              if (strikedUser.strikes === 2) userList += `🔴 `
              if (strikedUser.strikes >= 3) userList += `❌ **(BANNED)** `
              if(typeof currentUser === "object") {
                userList += `${currentUser} (${currentUser.tag}): Strike ${strikedUser.strikes}\n`
              } else {
                userList += `${currentUser}: Strike ${strikedUser.strikes}\n`
              }
              userCount = userCount + 1
            }
            embed.setDescription(`${userList}`)
            embed.setFooter(`Current Users: ${userCount}`)
            message.channel.send({embeds : [embed]})
            return
        }
        case 'add': {
          let updateMessage = await message.channel.send(`Adding strike to ${userCheck}`)
          try {
          await strikeSchema.findOneAndUpdate(
          {
            user: `${userId}`
          }, 
          {
            user: `${userId}`,
            $inc: {
              strikes: 1,
            }
          },
          {
            upsert: true
          })} catch (err) {
            return updateMessage.edit(`Failed to add a strike to ${userCheck}`)
          }
          updateMessage.edit(`Added a strike to ${userCheck}`)
        return
        }
        case 'subtract': {
          let updateMessage = await message.channel.send(`Removing strike to ${userCheck}`)
          try {
          await strikeSchema.findOneAndUpdate(
          {
            user: `${userId}`,
            strikes:{$gte: 1}
          }, 
          {
            user: `${userId}`,
            $inc: {
              strikes: -1,
            }
          },
          {
            upsert: true
          })} catch (err) {
            return updateMessage.edit(`Failed to remove a strike to ${userCheck}, ${err}`)
          }
          updateMessage.edit(`Removed a strike to ${userCheck}`)
          return
        }
        case 'remove': {
        let strikedUser = await strikeSchema.exists({ 
          user: `${userId}`
        })
        //console.log(strikedUser)
        if(strikedUser === null) return message.channel.send(`This user does not exist!`)
        await strikeSchema.deleteOne({
          user: `${userId}`
        })
        message.channel.send(`Removed ${userCheck} from the strike list`)
         return
        }
        default: {
          return message.channel.send(`Invalid choice! Proper usage: \`${prefix}strike ADD [USERID] | SUBTRACT [USERID] | REMOVE [USERID] | LIST\``)
        }
  }
  }
}
