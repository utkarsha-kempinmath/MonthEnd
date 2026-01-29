const mongoose = require('mongoose')

const allowanceSchema = mongoose.Schema({
    amt: Number,
    source: String,
    period: String,
    startDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('allowance', allowanceSchema)