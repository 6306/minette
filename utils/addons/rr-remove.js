const Discord = module.require("discord.js");
const rrMessageSchema = module.require(
  `../../config/schemas/rr-messageschema.js`
);
const rrSchema = module.require(`../../config/schemas/rr-schema.js`);

module.exports = (client) => {
  client.on("messageReactionRemove", async (reaction, user) => {
    /* fuck off bots */
    if(user.bot) return
    /* this is only done because of partials */
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (err) {
        return console.log(
          `something went wrong when fetching this reaction: ${err}`
        );
      }
    }
    /* real quick check */
    let messageCheck = await rrMessageSchema.exists({
      messageId: `${reaction.message.id}`,
      guildId: `${reaction.message.guildId}`,
    });
    if (messageCheck === null) return;
    //console.log(reaction._emoji.toString());
    /* oh my fucking god do i really have to do this, cant wait for the 10 bajillion second processing time */
    let reactionCheck = await rrSchema.exists({
      emoji: reaction._emoji.toString(),
    });
    if (reactionCheck === null) return;
    /* this is where we can actually process this*/
    let reactionRole = await rrSchema.findOne({
      emoji: reaction._emoji.toString(),
    });
    /* i lied this is only incase a role is gone for some reason and we have reaction roles for them*/
    let role = await reaction.message.guild.roles.fetch(reactionRole.roleId).catch((err) => {
      return false;
    });
    if (!role) return;
    /* this is literally it, thats all */
    /* no it isnt this is a user not a member */
    let reactionMember = await reaction.message.guild.members.fetch(`${user.id}`);
    reactionMember.roles.remove(reactionRole.roleId);
  });
};
