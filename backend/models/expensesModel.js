const mongoose = require('mongoose')

const expensesSchema = mongoose.Schema({
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    },
    category: String,
    detail: String,
    tag: String,
    isCorrected: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('expenses', expensesSchema)