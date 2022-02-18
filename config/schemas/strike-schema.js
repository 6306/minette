const mongoose = require(`mongoose`)

const strikeSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    strikes: {
        type: Number,
        min: 0,
        required: true
    }
})

module.exports = mongoose.model('moderationStrike', strikeSchema)