const mongoose = require('mongoose')

const goalSchema = mongoose.Schema({
    title: String,
    targetAmount: Number,
    currentAmount: Number,
    deadline: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('goal', goalSchema)