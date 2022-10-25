const Discord = module.require("discord.js");
const Mongoose = module.require(`mongoose`);
const { prefix } = module.require(`../../../config/config.json`);
const rrSchema = module.require(`../../../config/schemas/rr-schema.js`);

module.exports = {
  commands: ["reactionroles", "rr"],
  description: "Manage reaction roles",
  permissions: [Discord.PermissionsBitField.Flags.ManageMessages],
  callback: async (message, arguments, text) => {
    /* this sure is going to suck but i do not care as much right now*/
    if (arguments.length == 0 || arguments.length > 2)
      return message.channel.send(
        `Missing arguments or too many arguments! Usage: \`${prefix}reactionroles [ROLEID] [EMOJI]\``
      );
    //console.log(arguments[0], arguments[1]);

    /* check if roles are valid */
    let roleCheck = await message.guild.roles
      .fetch(arguments[0])
      .catch((err) => {
        return false;
      });
    if (!roleCheck) return message.channel.send(`Role id is invalid!`);
    let userHighestRole = message.member.roles.highest;
    if (message.guild.roles.comparePositions(userHighestRole, roleCheck) < 1)
      return message.channel.send(
        `Cannot set a role higher or equal to your highest role`
      );

    /* check emoji */
    let uniEmojiCheck = /\p{Extended_Pictographic}/u;
    let roleEmoji = arguments[1];
    if (!isNaN(arguments[1])) return message.channel.send(`Invalid emoji!`);
    /* unicode emoji check */
    if (!arguments[1].match(uniEmojiCheck)) {
      let regex = roleEmoji.replace(/^<a?:\w+:(\d+)>$/, "$1");
      roleEmoji = message.guild.emojis.cache.find(
        (emoji) => emoji.id === regex
      );
      //lol i hope nothing fucks up lol
    }

    /* limiting roles here */
    /* see its just like hit game the stanley parable 2*/
    let limitEmbed = new Discord.EmbedBuilder()
      .setTitle(`Limit this role?`)
      .setDescription(`**Role:** ${roleCheck}\n**Emote:** ${roleEmoji}`)
      .setFooter({text: `Limiting this role will cause this role to be one per person in a group of limited roles`})
    let confirmationMessage = await message.channel.send({ embeds: [limitEmbed] })
    confirmationMessage.react(`✅`).then(() => confirmationMessage.react(`❌`));
    let reactFilter = (reaction, user) => {
      return (
        [`✅`, "❌"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };
    let reactionCollector2 = await confirmationMessage
      .awaitReactions({
        filter: reactFilter,
        max: 1,
        time: 15000,
        errors: ["time"],
      })
      .catch((error) => {
        message.channel.send(`Timeout due to inactivity.`);
      });
    if (typeof reactionCollector2 == "undefined") {
      return;
    }
    let anotherReaction = reactionCollector2.first();
    let limitedRole = false
    if (anotherReaction.emoji.name === "✅") {
      limitedRole = true
    }
    await confirmationMessage.reactions.removeAll()

    /* final confirmation */
    let embed = new Discord.EmbedBuilder()
      .setTitle(`Add this role reaction?`)
      .setDescription(`**Role:** ${roleCheck}\n**Emote:** ${roleEmoji}\n **Limited**: ${limitedRole}`)
      .setFooter({text: `There is no current way to undo (reasonably), are you sure about this`})
    confirmationMessage.edit({ embeds: [embed] });
    confirmationMessage.react(`✅`).then(() => confirmationMessage.react(`❌`));
    let reactionCollector = await confirmationMessage
      .awaitReactions({
        filter: reactFilter,
        max: 1,
        time: 15000,
        errors: ["time"],
      })
      .catch((error) => {
        message.channel.send(`Timeout due to inactivity.`);
      });
    if (typeof reactionCollector == "undefined") {
      return;
    }
    let reaction = reactionCollector.first();
    if (reaction.emoji.name === "✅") {
      try {
        await rrSchema.findOneAndUpdate(
          {
            roleId: `${roleCheck.id}`,
          },
          {
            guildId: `${message.guildId}`,
            roleId: `${roleCheck.id}`,
            emoji: `${roleEmoji}`,
            limit: limitedRole
          },
          {
            upsert: true,
          }
        );
      } catch (err) {
        return message.channel.send(`Duplicate role/emoji set! (${err})`);
      }
      return message.channel.send(`Set reaction role!`);
    } else {
      return message.channel.send(`Reaction role not set.`);
    }
  },
};
