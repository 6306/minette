const { botChannel } = require('../../../config/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  commands: ['blackjack', 'bj'],
  description: 'Play a game of shitty blackjack with andy',
  callback: async (message, arguments, text) => {

    // Check if the message is sent in the correct channel and the user has permission
    if (!message.member.permissions.has("0x0000000000000400")) { //0x0000000000000400 is VIEW_CHANNEL according to https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags. I just used the value and it works so everyone should be able to gamble away in Blackjack.
      if (message.channel.id !== botChannel) return;
    }

    console.log(`Channel type: ${message.channel.type}`);
    if (message.channel.type === 0) {
      console.log('The command is running in a guild text channel.');
    } else {
      console.log('The command is not running in a guild text channel.');
    }

    let userFilter = interaction => interaction.user.id === message.author.id;
    let dealerCard01 = Math.floor(Math.random() * 10) + 1;
    let dealerCard02 = Math.floor(Math.random() * 10) + 1;
    let dealerCards = dealerCard01 + dealerCard02;

    let cardGen = () => {
      let card01 = Math.floor(Math.random() * 10) + 1;
      let card02 = Math.floor(Math.random() * 10) + 1;
      let cardValues = card01 + card02;
      if (cardValues > 21) {
        return cardGen();
      } else {
        return cardValues;
      }
    };

    let playerCards = cardGen();
    let embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle(`Andy's Back Alley Blackjack`)
      .setDescription(`**Dealer**: ${dealerCard01} + ??\n\n**You**: ${playerCards}`)
      .setFooter({ text: `Player: ${message.member.user.tag}.` });

    let messageSent = await message.channel.send({ embeds: [embed] });
    await messageSent.react('✅'); // Hit
    await messageSent.react('❌'); // Hold

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = messageSent.createReactionCollector({ filter, time: 30000 });

    let hitGen = (count) => {
      let card01 = Math.floor(Math.random() * 10) + 1;
      count = card01 + count;
      collector.resetTimer();
      if (count > 21) {
        collector.stop('bust');
        return count;
      } else if (count === 21) {
        return count;
      } else {
        return count;
      }
    };

    let dealerGen = (count, playerCount) => {
      let card01 = Math.floor(Math.random() * 10) + 1;
      collector.resetTimer();
      if (count > 21) {
        embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
        return messageSent.edit({ content: `Dealer bust! **${message.author.username}** wins!`, embeds: [embed] });
      } else if (count >= 17) {
        if (count > playerCount) {
          embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
          return messageSent.edit({ content: `Andy wins with a count of ${count}! (${message.author.username}'s count: ${playerCount})`, embeds: [embed] });
        } else {
          embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
          return messageSent.edit({ content: `${message.author.username} wins with a count of ${playerCount}`, embeds: [embed] });
        }
      } else if (count <= 16) {
        dealerCards = count + card01;
        return dealerGen(dealerCards, playerCards);
      }
    };

    collector.on('collect', (reaction, user) => {
      reaction.users.remove(user.id);
      if (reaction.emoji.name === '✅') {
        playerCards = hitGen(playerCards);
        embed.setDescription(`**Dealer**: ${dealerCard01} + ??\n\n**You**: ${playerCards}`);
        messageSent.edit({ embeds: [embed] });
      } else if (reaction.emoji.name === '❌') {
        collector.stop('hold');
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'hold') {
        dealerGen(dealerCards, playerCards);
      } else if (reason === 'bust') {
        messageSent.edit({ content: `${message.author.username} bust!` });
      } else {
        messageSent.edit({ content: 'Ended due to timeout.' });
      }
    });
  },
};
