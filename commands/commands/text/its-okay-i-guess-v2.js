const Discord = module.require('discord.js');
const fs = module.require('fs');
const { itsOkayChannel, itsNotOkayUserID, botChannel } = require('../../../config/config.json')

module.exports = {
  commands: 'game' ,
  description: 'N/A',
  callback: async (message, arguments, text, client) => {
    let whq = message.channel.guild
    /*
    ----------------------------------------
    This is a fix to duplicated names, that is all, ill do cleanup later
    ----------------------------------------
    */
    //bot channel exclusive
    if(message.channel.id !== botChannel) return
    
    /* 
    fs file logging
    */
    const logPath = './restgame.log'

    try {
      if (!fs.existsSync(logPath)) {
          fs.writeFile('./restgame.log', "", function(err) {
              if(err) {
                console.log(`Problem creating log! ${err}`)
              } else {
                console.log(`log created!`)
              }
          }) 
      }
    } catch(err) {
      console.log(`There was a problem creating a log! ${err}`)
   }


    // snowflake time convert
    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
      const time = randomDate(new Date(2019, 20, 6), new Date());
      const timeSecondMesssage = randomDate(new Date(2019, 20, 6), new Date());
      const timeThirdMessage = randomDate(new Date(2019, 20, 6), new Date());

      timeSecondMesssage.setDate(timeSecondMesssage.getDate() - Math.floor(Math.random() * 21))
      timeThirdMessage.setDate(timeThirdMessage.getDate() - Math.floor(Math.random() * 11 + 5))

    let snowflakeGen1 = Discord.SnowflakeUtil.generate(time)
    let snowflakeGen2 = Discord.SnowflakeUtil.generate(timeSecondMesssage)
    let snowflakeGen3 = Discord.SnowflakeUtil.generate(timeThirdMessage)

    //pick our channel
    let randomChannel = itsOkayChannel[Math.floor(Math.random() * itsOkayChannel.length)];
    let fetchedChannel = await client.channels.fetch(`${randomChannel}`)
    if (!fetchedChannel) return console.log(`The channel ${randomChannel} is invaild, check config again!`)

    let channelMessages = await fetchedChannel.messages.fetch({limit: 8, before: `${snowflakeGen1}`})
    let filteredMessagesOnce = channelMessages.filter(m => m.author.id !== itsNotOkayUserID.find((id) => id === m.author.id))
    let filteredMessages = filteredMessagesOnce.filter(m => m.content !== '')

    let channelMessages1 = await fetchedChannel.messages.fetch({limit: 8, before: `${snowflakeGen2}`})
    let filteredMessagesTwice = channelMessages1.filter(m => m.author.id !== itsNotOkayUserID.find((id) => id === m.author.id))
    let filteredMessages2 = filteredMessagesTwice.filter(m => m.content !== '')

    let channelMessages2 = await fetchedChannel.messages.fetch({limit: 8, before: `${snowflakeGen3}`})
    let filteredMessagesThrice = channelMessages2.filter(m => m.author.id !== itsNotOkayUserID.find((id) => id === m.author.id))
    let filteredMessages3 = filteredMessagesThrice.filter(m => m.content !== '')


    function getRandomItem(set) {
      let items = Array.from(set);
      return items[Math.floor(Math.random() * items.length)];
  }
  let randomMessageMain = getRandomItem(filteredMessages)
  let nameArray = [ ]

    filteredMessages2.forEach(msg => {
      nameArray.push(msg.author.username)
    })
    filteredMessages3.forEach(msg => {
      nameArray.push(msg.author.username)
    })
  
    let cleanNameArray = [...new Set(nameArray)]
    cleanNameArray.filter(name => name != randomMessageMain[1].author.username)
    let randomMessageSecond = getRandomItem(cleanNameArray)
    cleanNameArray.filter(name => name != randomMessageSecond)
    let randomMessageThird = getRandomItem(cleanNameArray)

    let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).replace(/T/, ' ').replace(/\..+/, '')
    let writeLog = `[${date}] Array: ${nameArray}, Dupe-less: ${cleanNameArray}\n`

    try {
      fs.appendFile(`${logPath}`, `${writeLog}`, function (err) {
        if (err) {
            console.log(`Problem writing to log! ${err}`)
        } else {
            //console.log(`Apended to file!`)
        }
    })
    } catch (err) {
      console.log(`There was a problem writing to log! ${err}`)
    }

    let arr = [ ]
    arr.push(randomMessageMain[1].author.username)
    arr.push(randomMessageSecond)
    arr.push(randomMessageThird)

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

  shuffleArray(arr)

  
  let embed = new Discord.MessageEmbed()
    .setColor('#2F3136')
    .setTitle(`Here's a new random message!`)
    .setDescription(`\n${randomMessageMain[1].content}\n\nI wonder who it is, could it be:\n1️⃣\u2800**${arr[0]}**\n2️⃣\u2800**${arr[1]}**\n3️⃣\u2800**${arr[2]}**\n\n**30 seconds starts now!**`)
    .setFooter(`Player: ${message.member.user.tag}`)
    message.channel.send({embeds: [embed]})
    let userFilter = m => m.author.id === message.author.id
    let userResponse = await message.channel.awaitMessages({filter: userFilter, max: 1, time: 30000, errors: ['time']}).catch(error => {
      message.channel.send(`Timeout ${message.author}! The correct answer was **${randomMessageMain[1].author.username}**`)
      return
  })
  if (typeof userResponse == 'undefined') {
    return
  }
  let userGuess = userResponse.map(msg => msg.content).join(' ')
  let numberChoice
  if(!isNaN(userGuess)) {
    try {
      userGuess = userGuess - 1
      numberChoice = arr[userGuess]
    } catch (error) {
      message.channel.send(`Error! idk go tell someone about it, your choice.`)
      return
    }
    if (typeof numberChoice == 'undefined') {
      message.channel.send(`Out of valid range, Choose a valid number next time.`)
      return
    }
    userGuess = numberChoice
  }
  if (userGuess.toLowerCase() === randomMessageMain[1].author.username.toLowerCase()) {
    message.channel.send(`The correct answer was **${randomMessageMain[1].author.username}**, you said **${userGuess}**`)
    return
  } else {
    message.channel.send(`The correct answer was **${randomMessageMain[1].author.username}**, you said **${userGuess}**`)
    return
  }
  },
}
