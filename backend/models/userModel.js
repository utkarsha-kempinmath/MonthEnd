const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    passwordHash: String,
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
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

module.exports = mongoose.model('User', userSchema)