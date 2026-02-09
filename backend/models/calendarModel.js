const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    eventName: {
        type: String,
        required: true,
        trim: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: Date,

    eventType: {
        type: String,
        enum: ['exam', 'submission', 'fest', 'reminder', 'other'],
        default: 'other'
    }

}, { timestamps: true })

module.exports = mongoose.model('calendar', calendarSchema)

