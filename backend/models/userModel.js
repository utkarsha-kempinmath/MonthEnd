const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    calander: {
        type: Array,
        default: []
    },
    allowance: {
        type: Array,
        default: []
    },
    planning: {
        type: Array,
        default: []
    },
    expenses: {
        type: Array,
        default: []
    },
    goal: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('user', userSchema)