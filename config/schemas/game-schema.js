const mongoose = require(`mongoose`)

const gameSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    streak: {
        type: Number,
        min: 0,
        required: true
    },
    longestStreak: {
        type: Number,
        min: 0,
        required: true
    },
    losingStreak: {
        type: Number,
        min: 0,
        required: true
    },
    longestLosingStreak: {
        type: Number,
        min: 0,
        required: true
    }
})

module.exports = mongoose.model('gameStreak', gameSchema)