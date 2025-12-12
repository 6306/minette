const { botChannel } = require('../../../config/config.json');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
  ComponentType
} = require('discord.js');

module.exports = {
  commands: ['blackjack', 'bj'],
  description: 'Play a game of shitty blackjack with andy',
  callback: async (message, arguments, text) => {

    // Only allow non-mods to use this in the bot channel
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      if (message.channel.id !== botChannel) return;
    }

    // Filter so only the command user can press the buttons
    const userFilter = interaction => interaction.user.id === message.author.id;

    // Dealer starting hand
    let dealerCard01 = Math.floor(Math.random() * 10) + 1;
    let dealerCard02 = Math.floor(Math.random() * 10) + 1;
    let dealerCards = dealerCard01 + dealerCard02;

    // Generate a valid starting hand for the player
    const cardGen = () => {
      let card01 = Math.floor(Math.random() * 10) + 1;
      let card02 = Math.floor(Math.random() * 10) + 1;
      let cardValues = card01 + card02;
      if (cardValues > 21) {
        return cardGen();        // <-- return here so we actually get the new value
      } else {
        return cardValues;
      }
    };

    let playerCards = cardGen();

    // Buttons row
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('hit')
        .setLabel('Hit')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('hold')
        .setLabel('Hold')
        .setStyle(ButtonStyle.Danger)
    );

    // Initial embed
    let embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle(`Andy's Back Alley Blackjack`)
      .setDescription(`**Dealer**: ${dealerCard01} + ??\n\n**You**: ${playerCards}`)
      .setFooter({ text: `Player: ${message.member.user.tag}.` });

    let messageSent = await message.channel.send({ embeds: [embed], components: [buttons] });

    // Collector for button interactions
    let collector = messageSent.createMessageComponentCollector({
      filter: userFilter,
      componentType: ComponentType.Button,
      time: 30000
    });

    const hitGen = (count) => {
      let card01 = Math.floor(Math.random() * 10) + 1;
      count = card01 + count;
      collector.resetTimer();

      if (count > 21) {
        // Bust: stop collector with reason "bust"
        collector.stop('bust');
        return count;
      } else if (count === 21) {
        // Exactly 21: disable Hit, keep Hold enabled
        buttons.components[0].setDisabled(true);  // Hit
        buttons.components[1].setDisabled(false); // Hold
        messageSent.edit({ components: [buttons] });
        return count;
      } else {
        // Can still play
        buttons.components[0].setDisabled(false);
        buttons.components[1].setDisabled(false);
        messageSent.edit({ components: [buttons] });
        return count;
      }
    };

    const dealerGen = (count, playerCount) => {
      let card01 = Math.floor(Math.random() * 10) + 1;
      collector.resetTimer();

      if (count > 21) {
        // Dealer busts, player wins
        embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
        return messageSent.edit({
          content: `Dealer bust! **${message.author.username}** wins!`,
          embeds: [embed],
          components: [buttons]
        });
      } else if (count >= 17) {
        // Dealer stands, compare hands
        if (count > playerCount) {
          embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
          return messageSent.edit({
            content: `Andy wins with a count of ${count}! (${message.author.username}'s count: ${playerCount})`,
            embeds: [embed],
            components: [buttons]
          });
        } else if (count < playerCount) {
          embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
          return messageSent.edit({
            content: `${message.author.username} wins with a count of ${playerCount}`,
            embeds: [embed],
            components: [buttons]
          });
        } else {
          // Tie case
          embed.setDescription(`**Dealer**: ${count}\n\n**You**: ${playerCount}`);
          return messageSent.edit({
            content: `It's a tie! Both have ${count}.`,
            embeds: [embed],
            components: [buttons]
          });
        }
      } else if (count <= 16) {
        // Dealer hits again
        dealerCards = count + card01;
        embed.setDescription(`**Dealer**: ${dealerCards}\n\n**You**: ${playerCount}`);
        messageSent.edit({ embeds: [embed] });
        return dealerGen(dealerCards, playerCount);
      }
    };

    collector.on('collect', async i => {
      // Disable buttons immediately to avoid spamming while we process
      buttons.components[0].setDisabled(true);
      buttons.components[1].setDisabled(true);
      await messageSent.edit({ components: [buttons] });

      await i.deferUpdate();

      if (i.customId === 'hit') {
        playerCards = hitGen(playerCards);
        embed.setDescription(`**Dealer**: ${dealerCard01} + ??\n\n**You**: ${playerCards}`);
        await messageSent.edit({ embeds: [embed] });
      }

      if (i.customId === 'hold') {
        collector.stop('hold');
      }
    });

    collector.on('end', (collected, reason) => {
      // Disable buttons for good when round ends
      buttons.components[0].setDisabled(true);
      buttons.components[1].setDisabled(true);

      if (reason === 'hold') {
        return dealerGen(dealerCards, playerCards);
      } else if (reason === 'bust') {
        return messageSent.edit({
          content: `${message.author.username} bust!`,
          components: [buttons]
        });
      } else {
        return messageSent.edit({
          content: `Ended due to timeout.`,
          components: [buttons]
        });
      }
    });
  },
};
