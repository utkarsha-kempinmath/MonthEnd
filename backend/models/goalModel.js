const mongoose = require('mongoose')

const goalSchema = mongoose.Schema({
    goal: String,
    target: Number,
    timeline: String,
    amt: Number,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('goal', goalSchema)