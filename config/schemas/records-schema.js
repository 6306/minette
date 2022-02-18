const mongoose = require(`mongoose`)
const strikeSchema = require("./strike-schema")

const requiredString = {
    type: String,
    required: true
}

const recordSchema = mongoose.Schema({
    user: requiredString,
    type: requiredString,
    offense: requiredString,
    reason: requiredString,
    date: requiredString,
    time: {
        type: String
    },
    url: requiredString
})

module.exports = mongoose.model('moderationRecord', recordSchema)