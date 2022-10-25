const Discord = module.require("discord.js");
const rrMessageSchema = module.require(
  `../../config/schemas/rr-messageschema.js`
);
const rrSchema = module.require(`../../config/schemas/rr-schema.js`);

module.exports = (client) => {
  client.on("messageReactionAdd", async (reaction, user) => {
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
      guildId: `${reaction.message.guildId}`,
      emoji: reaction._emoji.toString(),
    });
    if (reactionCheck === null) return;
    /* this is where we can actually process this*/
    let reactionRole = await rrSchema.findOne({
      guildId: `${reaction.message.guildId}`,
      emoji: reaction._emoji.toString(),
    });

    let reactionMember = await reaction.message.guild.members.fetch(`${user.id}`);

    if(reactionRole.limit) {
      let limitedRoles = await rrSchema.find({
        guildId: `${reaction.message.guildId}`,
        limit: true
      })
      let roleArray = []
      for (let index = 0; index < limitedRoles.length; index++) {
        const element = limitedRoles[index];
        roleArray.push(element.roleId)
      }

      let userRoles = reactionMember.roles.cache.filter(r => r.id !== reaction.message.guild.id).map(r => r.id)
      let matchingRole = userRoles.filter(id => roleArray.includes(id))
      //console.log(matchingRole[0])
      if(matchingRole.length > 0) {
        let matchingRoleId = matchingRole[0]
        reactionMember.roles.remove(matchingRoleId)
        let roleEmoji = limitedRoles.find(role => role.roleId === matchingRoleId)
      //console.log(roleEmoji)

        let uniEmojiCheck = /\p{Extended_Pictographic}/u;
        if (!roleEmoji.emoji.match(uniEmojiCheck)) {
          let regex = roleEmoji.emoji.replace(/^<a?:\w+:(\d+)>$/, "$1");
        reaction.message.reactions.cache.find(r => r.emoji.id === regex).users.remove(user)
        } else {
        reaction.message.reactions.cache.find(r => r.emoji.name === roleEmoji.emoji).users.remove(user)
        }
      }
      
      // if(reactionMember.roles.cache.some(r => r.id === roleArray.find(id => id === r.id))) {
      //   reaction.message.reactions.cache.find(r => r.emoji.name === reaction.emoji.name).users.remove(user)
      //   return
      // }


    }
    /* i lied this is only incase a role is gone for some reason and we have reaction roles for them*/
    let role = await reaction.message.guild.roles.fetch(reactionRole.roleId).catch((err) => {
      return false;
    });
    if (!role) return;
    /* this is literally it, thats all */
    /* no it isnt this is a user not a member */
    reactionMember.roles.add(reactionRole.roleId);
  });
};
