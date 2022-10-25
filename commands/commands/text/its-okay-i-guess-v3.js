const Discord = module.require('discord.js');
const mongoose = module.require(`mongoose`)
const gameSchema = module.require(`../../../config/schemas/game-schema.js`)
const { itsOkayChannel, itsNotOkayUserID, botChannel, dbConnection, prefix } = require('../../../config/config.json')

module.exports = {
  commands: 'game' ,
  description: 'N/A',
  callback: async (message, arguments, text, client) => {
    let whq = message.channel.guild
    let avatar = message.author.displayAvatarURL()    
    //bot channel exclusive
    if(message.channel.id !== botChannel) return

    const statManager = async () => {
      let userStats = await gameSchema.exists(
        {
          user: `${message.author.id}`
        }
      )
      if(!userStats) {
        const newUser = {
          user: `${message.author.id}`,
          streak: 0,
          longestStreak: 0,
          losingStreak: 0,
          longestLosingStreak: 0
        }
        await gameSchema(newUser).save()
      }
        userStats = await gameSchema.findOne(
          {
            user: `${message.author.id}`
          }
        )
        let streakStatus = 'Current Streak'
        let streakCount = userStats.streak
        if(userStats.streak <= 0) {
        streakStatus = 'Current Losing Streak'
        streakCount = userStats.losingStreak
        }
        let embed = new Discord.EmbedBuilder()
        .setAuthor({name: `${message.author.tag}'s Stats!`})
        .setDescription(`🎉 • **Achievements** • 🎉\n todo\n`)
        .setThumbnail(avatar)
        .addFields(
          { name: `${streakStatus}`, value: `${streakCount}`, inline: true},
          { name: 'Longest Streak', value: `${userStats.longestStreak}`, inline: true},
          { name: 'Longest Losing Streak', value: `${userStats.longestLosingStreak}`, inline: true}
        )
        .setFooter({ text: `See current rankings by using ${prefix}game leaderboard`})
        message.channel.send({embeds: [embed]})
        return
    }
    const leaderboardManager = async () => {
      let fullList = await gameSchema.find({})
      let sort_by_key = (array, key) =>
    {
      return array.sort(function(a, b)
      {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      });
    }
    let listLength = 10
    let arrayList = [ ]
    if(listLength > fullList.length) {
      listLength = fullList.length
    }
    for(let i = 0; i < fullList.length; i++) {
      let currentListing = fullList[i]
      arrayList.push(currentListing)
    }

    let streakListing = 'longestStreak'
    if(arguments.length > 1 && arguments[1].toLowerCase() === "losses") {
      streakListing = 'longestLosingStreak'
    }

    fullList = sort_by_key(arrayList, streakListing)

    let rankings = ""

    for(let i = 0; i < listLength; i++) {
      let currentUser = arrayList[i]
      let fetchedUser = await client.users.fetch(currentUser.user).catch(err => {return null})
      let streakCount = currentUser.longestStreak
      let streakType = 'Streak'
      if(arguments.length > 1 && arguments[1].toLowerCase() === "losses") {
        streakCount = currentUser.longestLosingStreak
        streakType = 'Losing Streak'
      }
      rankings += `${i + 1}. ${fetchedUser.tag ?? `Failed to fetch name`} with ${streakCount} as their longest ${streakType}\n`
    }
    let embed = new Discord.EmbedBuilder()
    .setTitle(`Top Game Streaks`)
    .setDescription(`\`\`\`${rankings}\`\`\``)
    .setFooter({text: `something something check the losers using ${prefix}game leaderboard losses`})
    message.channel.send({embeds: [embed]})
    }

    if(arguments.length > 0 && arguments[0].toLowerCase() === "stats") {
      await statManager()
      return
    } 
    if(arguments.length > 0 && arguments[0].toLowerCase() === "leaderboard") {
      await leaderboardManager()
      return
    } 
    
    // snowflake time convert
    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
      const time = randomDate(whq.createdAt, new Date());
      const timeSecondMesssage = randomDate(whq.createdAt, new Date());
      const timeThirdMessage = randomDate(whq.createdAt, new Date());

      time.setDate(time.getDate() + Math.floor(Math.random() * 34))
      timeSecondMesssage.setDate(timeSecondMesssage.getDate() + Math.floor(Math.random() * 21))
      timeThirdMessage.setDate(timeThirdMessage.getDate() + Math.floor(Math.random() * 11 + 5))

    let snowflakeGen1 = Discord.SnowflakeUtil.generate(time)
    let snowflakeGen2 = Discord.SnowflakeUtil.generate(timeSecondMesssage)
    let snowflakeGen3 = Discord.SnowflakeUtil.generate(timeThirdMessage)

    const randomMessages = async (snowflake) =>  {
      let randomChannel = itsOkayChannel[Math.floor(Math.random() * itsOkayChannel.length)];
      let fetchedChannel = await client.channels.fetch(`${randomChannel}`).catch(err => {return false})
      if (!fetchedChannel) return console.log(`The channel ${randomChannel} is invaild, check config again!`)

      let channelMessages = await fetchedChannel.messages.fetch({limit: 8, before: `${snowflake}`})
      channelMessages = channelMessages.filter(m => m.author.id !== itsNotOkayUserID.find((id) => id === m.author.id))
      channelMessages = channelMessages.filter(m => m.content !== '')
      return channelMessages
    }

    let channelMessages = await randomMessages(snowflakeGen1)
    let channelMessages2 = await randomMessages(snowflakeGen2)
    let channelMessages3 = await randomMessages(snowflakeGen3)


    function getRandomItem(set) {
      let items = Array.from(set);
      return items[Math.floor(Math.random() * items.length)];
  }

  let randomMessageMain = getRandomItem(channelMessages)
  let nameArray = [ ]

    channelMessages2.forEach(msg => {
      nameArray.push(msg.author.username)
    })
    channelMessages3.forEach(msg => {
      nameArray.push(msg.author.username)
    })
  
    let cleanNameArray = [...new Set(nameArray)]
    cleanNameArray = cleanNameArray.filter(name => name != randomMessageMain[1].author.username)
    let randomMessageSecond = getRandomItem(cleanNameArray)
    cleanNameArray = cleanNameArray.filter(name => name != randomMessageSecond)
    let randomMessageThird = getRandomItem(cleanNameArray)

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

  
  let embed = new Discord.EmbedBuilder()
    .setColor('#2F3136')
    .setTitle(`Here's a new random message!`)
    .setDescription(`\n${randomMessageMain[1].content}\n\nI wonder who it is, could it be:\n1️⃣\u2800**${arr[0]}**\n2️⃣\u2800**${arr[1]}**\n3️⃣\u2800**${arr[2]}**\n\n**30 seconds starts now!**`)
    .setFooter({text: `Player: ${message.member.user.tag}\nDont want to appear here? Ask a staff member.`, iconURL: `${avatar}`})
    let sentEmbed = await message.channel.send({embeds: [embed]})
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

  let streakUpdate = async (increase, lostRound, connection) => {
    /* god i want to kill myself making this again */
    if(!connection) return false
    let currentStats = await gameSchema.exists(
      {
        user: `${message.author.id}`
      }
    )
    if(!currentStats) {
      const newUser = {
        user: `${message.author.id}`,
        streak: 0,
        longestStreak: 0,
        losingStreak: 0,
        longestLosingStreak: 0
      }
      await gameSchema(newUser).save()
    }
      currentStats = await gameSchema.findOne(
        {
          user: `${message.author.id}`
        }
      )

      if(lostRound) {
        let futureLostStreak = currentStats.losingStreak + 1
        let futureLongestLosingStreak = currentStats.longestLosingStreak
        if(futureLostStreak > currentStats.longestLosingStreak) {
          futureLongestLosingStreak = futureLostStreak
        } 
       let finalStats = await gameSchema.findOneAndUpdate(
      {
         user: `${message.author.id}`
      },
      {
        user: `${message.author.id}`,
        streak: 0,
        longestStreak: currentStats.longestStreak,
        losingStreak: futureLostStreak,
        longestLosingStreak: futureLongestLosingStreak
      },
      {
        upsert: true,
        new: true
      }
       ) 
       return finalStats
      }
      
      if(increase) {
        let futureStreak = currentStats.streak + 1
        let futureLongestStreak = currentStats.longestStreak
        if(futureStreak > currentStats.longestStreak) {
          futureLongestStreak = futureStreak
        }
        let finalStats = await gameSchema.findOneAndUpdate(
          {
            user: `${message.author.id}`
         },
         {
           user: `${message.author.id}`,
           streak: futureStreak,
           longestStreak: futureLongestStreak,
           losingStreak: 0,
           longestLosingStreak: currentStats.longestLosingStreak
         },
         {
           upsert: true,
           new: true
         }
        )
        return finalStats
      }
  }


  //how to ruin a man, well not yet atleast

  // const achievementManager = async (stats, roundStatus) => {
    
  // }


  








  let finalEmbed = new Discord.EmbedBuilder()


  if (userGuess.toLowerCase() === randomMessageMain[1].author.username.toLowerCase()) {
    let statTrack = await streakUpdate(true, false, dbConnection)
    let finalMessage = `\n${randomMessageMain[1].content}\n\n<:poger:959673675068624906> The correct answer was **${randomMessageMain[1].author.username}**, you said **${userGuess}**`
    let footerText = `Player: ${message.member.user.tag}`
    if(statTrack) footerText += `\nCurrent Streak: ${statTrack.streak}, Longest Streak: ${statTrack.longestStreak}, Longest Losing Streak: ${statTrack.longestLosingStreak}, See user stats by using ${prefix}game stats`
    finalEmbed.setColor('#33ff5b')
    finalEmbed.setTitle('wow this game is amazing')
    finalEmbed.setDescription(`${finalMessage}`)
    finalEmbed.setFooter({text: `${footerText}`, iconURL: `${avatar}`})
    sentEmbed.edit({embeds: [finalEmbed]})
    return
  } else {
    let statTrack = await streakUpdate(false, true, dbConnection)
     let finalMessage = `\n${randomMessageMain[1].content}\n\n<:sadded:959702691066564619> The correct answer was **${randomMessageMain[1].author.username}**, you said **${userGuess}**`
     let footerText = `Player: ${message.member.user.tag}`
     if(statTrack) footerText += `\nCurrent Losing Streak: ${statTrack.losingStreak}, Longest Losing Streak: ${statTrack.longestLosingStreak}, Longest Streak: ${statTrack.longestStreak}, See user stats by using ${prefix}game stats`
     finalEmbed.setColor('#f20000')
     finalEmbed.setTitle('wow this game fucking sucks')
     finalEmbed.setDescription(`${finalMessage}`)
     finalEmbed.setFooter({text: `${footerText}`, iconURL: `${avatar}`})
     sentEmbed.edit({embeds: [finalEmbed]})
    return
  }
  },
}

