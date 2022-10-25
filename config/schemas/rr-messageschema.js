const mongoose = require(`mongoose`)

const rrMessageSchema = mongoose.Schema({
    messageId: {
       type: String,
       require: true,
       unique: true
    },
    channelId: {
      type: String,
      require: true,
      unique: true
   },
    guildId: {
        type: String,
        require: true,
     },
})

module.exports = mongoose.model('rrMessage', rrMessageSchema)