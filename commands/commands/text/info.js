const Discord = module.require('discord.js')
const loadCommands = module.require(`../../core/load-commands.js`)
const { prefix, serverName, commandErrors, reply, verifyNotice, verifyWelcome, cleanupVerify, autoDm } = module.require('../../../config/config.json')

module.exports = {
    commands: 'help',
    description: 'Lists out all commands + extra stats',
    permissions: [Discord.PermissionsBitField.Flags.ManageMessages],
    callback: (message, arguments, text, client) => {
       let embed = new Discord.EmbedBuilder()
       const commands = loadCommands()
       let messageReply = ''

       for (const command of commands) {
        let permissions = command.permission
  
        if (permissions) {
          let hasPermission = true
          if (typeof permissions === 'string') {
            permissions = [permissions]
          }
  
          for (const permission of permissions) {
            if (!message.member.permissions.has(permission)) {
              hasPermission = false
              break
            }
          }
  
          if (!hasPermission) {
            continue
          }
        }

           const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands
           const args = command.expectedArgs ? `${command.expectedArgs}` : ''
           const { description } = command
           
           messageReply += `**${prefix}${mainCommand}${args}** = ${description}\n`
       }

       embed.setTitle(`${serverName}'s Commands`)
       embed.setDescription(`${messageReply}`)
       embed.setFooter({ text: `Command Errors: ${commandErrors}. Auto Reply: ${reply}. Verification Notification: ${verifyNotice}. Welcome Message: ${verifyWelcome}. Verfication Channel Cleanup: ${cleanupVerify}. Auto DM: ${autoDm}.`})
       message.channel.send({embeds: [embed]})
    }

}