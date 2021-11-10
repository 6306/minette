const { prefix, commandErrors } = require('../../config/config.json')

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}
const allCommands = {}
  module.exports = (  comamandOptions) => {
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
