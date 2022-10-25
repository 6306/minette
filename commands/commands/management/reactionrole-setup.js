const { mapReduce } = require("../../../config/schemas/rr-messageschema");

const Discord = module.require("discord.js");
const Mongoose = module.require(`mongoose`);
const { prefix } = module.require(`../../../config/config.json`);
const rrMessageSchema = module.require(
  `../../../config/schemas/rr-messageschema.js`
);
const rrSchema = module.require(`../../../config/schemas/rr-schema.js`);

module.exports = {
  commands: ["reactionroles-setup", "rr-setup"],
  description: "Manage reaction roles",
  permissions: [Discord.PermissionsBitField.Flags.ManageMessages],
  callback: async (message, arguments, text, client) => {
    /*this is fine*/
    /*no it isnt*/
    //console.log(arguments.length);
    if (arguments.length == 0 || arguments.length > 2)
      return message.channel.send(
        `Missing arguments or too many! Usage: \`${prefix}reactionroles-setup [CHANNELID] [MESSAGEID]\``
      );
    //console.log(arguments[0]);

    //bandage fix
    let fetchedChannel = await client.channels.fetch(arguments[0]).catch(err => {return false})
    if(!fetchedChannel) return console.log(`The channel ${arguments[0]} is invalid!`)

    let rrMessage = await fetchedChannel.messages.fetch(arguments[1]).catch((err) => {return false});
    if (!rrMessage) return message.channel.send(`Message id is invalid`);
    //console.log(rrMessage);

    /* i love stealing my own code */
    let embed = new Discord.EmbedBuilder()
      .setTitle(`Configure to this message?`)
      .setDescription(
        `**Message:** ${rrMessage.content ?? 'N/A'}\n**User:** ${rrMessage.author.username}`
      );
    let confirmationMessage = await message.channel.send({ embeds: [embed] });
    confirmationMessage.react(`✅`).then(() => confirmationMessage.react(`❌`));
    let reactFilter = (reaction, user) => {
      return (
        [`✅`, "❌"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };
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
      await rrMessageSchema.findOneAndUpdate(
        {
          guildId: `${message.guildId}`,
        },
        {
          guildId: `${message.guildId}`,
          channelId: `${arguments[0]}`,
          messageId: `${arguments[1]}`,
        },
        {
          upsert: true,
        }
      );
      message.channel.send(`Set Message... Configuring`);
    } else {
      return message.channel.send(`Configuration Canceled`);
    }
    /* setup reactions */
    let rrReactions = await rrSchema.find({});
    for (let i = 0; i < rrReactions.length; i++) {
      const rrEmoji = rrReactions[i];
      await rrMessage.react(rrEmoji.emoji);
    }
    message.channel.send(`Reaction roles setup complete!`);
  },
};
