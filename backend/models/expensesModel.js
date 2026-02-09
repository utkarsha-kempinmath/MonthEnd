const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    category: {
        type: String,
        required: true
    },

    note: String,

    emotions: [
        {
            type: String
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model('expense', expenseSchema)
