const mongoose = require('mongoose')

const calanderSchema = mongoose.Schema({
    eventName: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    eventType: String
})

module.exports = mongoose.model('calander', calanderSchema)