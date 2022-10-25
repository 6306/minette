const Discord = require(`discord.js`)
const { prefix, commandErrors } = require('../../config/config.json')

const validatePermissions = (permissions) => {
  const validPermissions = [
    Discord.PermissionsBitField.Flags.CreateInstantInvite,
    Discord.PermissionsBitField.Flags.KickMembers,
    Discord.PermissionsBitField.Flags.BanMembers,
    Discord.PermissionsBitField.Flags.Administrator,
    Discord.PermissionsBitField.Flags.ManageChannels,
    Discord.PermissionsBitField.Flags.ManageGuild,
    Discord.PermissionsBitField.Flags.AddReactions,
    Discord.PermissionsBitField.Flags.ViewAuditLog,
    Discord.PermissionsBitField.Flags.PrioritySpeaker,
    Discord.PermissionsBitField.Flags.Stream,
    Discord.PermissionsBitField.Flags.ViewChannel,
    Discord.PermissionsBitField.Flags.SendMessages,
    Discord.PermissionsBitField.Flags.SendTTSMessages,
    Discord.PermissionsBitField.Flags.ManageMessages,
    Discord.PermissionsBitField.Flags.EmbedLinks,
    Discord.PermissionsBitField.Flags.AttachFiles,
    Discord.PermissionsBitField.Flags.ReadMessageHistory,
    Discord.PermissionsBitField.Flags.MentionEveryone,
    Discord.PermissionsBitField.Flags.UseExternalEmojis,
    Discord.PermissionsBitField.Flags.ViewGuildInsights,
    Discord.PermissionsBitField.Flags.Connect,
    Discord.PermissionsBitField.Flags.Speak,
    Discord.PermissionsBitField.Flags.MuteMembers,
    Discord.PermissionsBitField.Flags.DeafenMembers,
    Discord.PermissionsBitField.Flags.MoveMembers,
    Discord.PermissionsBitField.Flags.UseVAD,
    Discord.PermissionsBitField.Flags.ChangeNickname,
    Discord.PermissionsBitField.Flags.ManageNicknames,
    Discord.PermissionsBitField.Flags.ManageRoles,
    Discord.PermissionsBitField.Flags.ManageWebhooks,
    Discord.PermissionsBitField.Flags.ManageEmojisAndStickers,
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}
const allCommands = {}
  module.exports = (comamandOptions) => {
    let {
      commands,
      permissions = [],
    } = comamandOptions

    if(!commands) {
      return
    }

    if(typeof commands === 'string') {
      commands = [commands]
    }

  console.log(`Adding command: "${commands[0]}"`)

    if(permissions.length) {
      if(typeof permission === 'string') {
        permissions = [permissions]
      }
      validatePermissions(permissions)
    }

    for(const command of commands) {
      allCommands[command] = {
        ...comamandOptions,
        commands,
        permissions
      }
    }
  }



module.exports.listen = (client) => {
  client.on('messageCreate', message => {
    const { member, content, guild } = message

    const arguments = content.split(/[ ]+/)

    const name = arguments.shift().toLowerCase()

    if(name.startsWith(prefix)) {
      const command = allCommands[name.replace(prefix, '')]
      if(!command) {
        return
      }
      const {
        permissions,
        permissionError = "You lack permissions to use this!",
        expectedArgs = '',
        requiredRoles = [],
        minArgs = 0,
        maxArgs = null,
        description = 'n/a',
        callback
      } = command

      for(const permission of permissions) {
        if(!member.permissions.has(permission)) {
          if(commandErrors) message.reply(permissionError)
          return
        }
      }

      for(const requiredRole of requiredRoles) {
        const role = guild.roles.cache.find(role =>
        role.name === requiredRole)

        if(!role || !member.roles.cache.has(role.id)) {
          if(commandErrors) message.reply(`Missing role(s): ${requiredRole} to use this command`)
          return
        }
      }

      if (
      arguments.length < minArgs ||
      (maxArgs !== null && arguments.length > maxArgs)
    ) {
      if(commandErrors) message.reply(`Unexpected arguments! Use ${name} ${expectedArgs}`)
      return
    }

      callback(message, arguments, arguments.join(" "), client)
    }
  })
}
