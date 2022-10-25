const { botChannel } = require('../../../config/config.json')
const Discord = module.require('discord.js');

module.exports = {
  commands: ['blackjack', 'bj'] ,
  description: 'Play a game of shitty blackjack with andy',
  callback: async (message, arguments, text) => {

    // TODO: figure out what the actual hell is going on here, no really i hate this
    return



    if(!message.member.permissions.has("MANAGE_MESSAGES")) {
      if(message.channel.id !== botChannel) return
    }
    let userFilter = interaction => interaction.user.id === message.author.id 
    let dealerCard01 = Math.floor(Math.random() * 10) + 1
    let dealerCard02 = Math.floor(Math.random() * 10) + 1
    let dealerCards = dealerCard01 + dealerCard02

    let cardGen = () => {
      let card01 = Math.floor(Math.random() * 10) + 1
      let card02 = Math.floor(Math.random() * 10) + 1
      let cardValues = card01 + card02
      if(cardValues > 21) {
        cardGen()
      } else {
        return cardValues
      }
    }

    let playerCards = cardGen()  
    const buttons = new Discord.ActionRowBuilder()
    .addComponents(
      [new Discord.ButtonBuilder()
      .setCustomId(`hit`)
      .setLabel(`Hit`)
      .setStyle(3),
      new Discord.ButtonBuilder()
      .setCustomId(`hold`)
      .setLabel(`Hold`)
      .setStyle(4)]
    )
    let embed = new Discord.EmbedBuilder()
    .setColor('#FFFFFF')
    .setTitle(`Andy's Back Alley Blackjack`)
    .setDescription(`**Dealer**: ${dealerCard01} + ??\n\n**You**:${playerCards}`)
    .setFooter({text: `Player: ${message.member.user.tag}.`})
    let messageSent = await message.channel.send({ embeds: [embed], components: [buttons] })

    let collector = await messageSent.createMessageComponentCollector({filter: userFilter, componentType: `BUTTON`, time: 30000})
    let hitGen = (count) => {
      let card01 = Math.floor(Math.random() * 10) + 1
      count = card01 + count
      collector.resetTimer()
      if (count > 21) {
        collector.stop(`bust`)
        return count
      } else if (count === 21) {
        buttons.components[0].setDisabled(true)
        buttons.components[1].setDisabled(false)
        messageSent.edit({components: [buttons]})
        return count
      } else {
        buttons.components[0].setDisabled(false)
        buttons.components[1].setDisabled(false)
        messageSent.edit({components: [buttons]})
        return count
      }
    }
    
    let dealerGen = (count, playerCount) => {
      let card01 = Math.floor(Math.random() * 10) + 1
      collector.resetTimer()
      if (count > 21) {
        embed.setDescription(`**Dealer**:${count}\n\n**You**:${playerCount}`)
        return messageSent.edit({content: `Dealer bust! **${message.author.username}** wins!`, embeds: [embed], components: [buttons]})
      }
       else if(count >= 17) {
        if (count > playerCount) {
          embed.setDescription(`**Dealer**:${count}\n\n**You**:${playerCount}`)
          messageSent.edit({content: `Andy wins with a count of ${count}! (${message.author.username}'s count: ${playerCount})`, embeds: [embed], components: [buttons]})
          return
        } else {
          embed.setDescription(`**Dealer**:${count}\n\n**You**:${playerCount}`)
          messageSent.edit({content: `${message.author.username} wins with a count of ${playerCount}`, embeds: [embed], components: [buttons]})
          return
        }
      } else if (count <= 16) {
        dealerCards = count + card01
        embed.setDescription(`${dealerCards}\n${playerCount}`)
        messageSent.edit({embed: [embed]})
        dealerGen(dealerCards, playerCards)
      }
    }

    collector.on('collect', i => {
      Discord.ButtonBuilder.from(buttons.components[0]).setDisabled(true)
      Discord.ButtonBuilder.from(buttons.components[1]).setDisabled(true)
      messageSent.edit({components: [buttons]})
      console.log(`we did something!`, i)
      i.deferUpdate()
      if(i.customId === 'hit') {
        playerCards = hitGen(playerCards)
        embed.setDescription(`**Dealer**:${dealerCard01} + ??\n\n**You**:${playerCards}`)
        messageSent.edit({embeds: [embed]})
      }
      if(i.customId === 'hold') {
        collector.stop(`hold`)
      } 

    })

    collector.on('end', (colected, reason) => {
      Discord.ButtonBuilder.from(buttons.components[0]).setDisabled(true)
      Discord.ButtonBuilder.from(buttons.components[1]).setDisabled(true)
      if(reason === 'hold') {
        return dealerGen(dealerCards, playerCards)
      } else if(reason === 'bust') {
        return messageSent.edit({content: `${message.author.username} bust!`})
      } else {
        return messageSent.edit({content: `Ended due to timeout.`})
      }
     
    })
    
  },
}
