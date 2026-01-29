const mongoose = require('mongoose')

const expensesSchema = mongoose.Schema({
    amt: Number,
    date: {
        type: Date,
        default: Date.now
    },
    catagory: String,
    detail: String,
    tag: String,
    isCorrected: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('expenses', expensesSchema)