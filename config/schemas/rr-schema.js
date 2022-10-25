const mongoose = require(`mongoose`)

const rrSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    roleId: {
       type: String,
       required: true,
       unique: true
    },
    emoji: {
        type: String,
        required: true,
        unique: true
    },
    limit: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('reactioroles', rrSchema)