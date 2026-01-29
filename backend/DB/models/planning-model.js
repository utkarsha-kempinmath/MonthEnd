const mongoose = require('mongoose')

const planningSchema = mongoose.Schema({
    foodAmt: Number,
    transportAmt: Number,
    academicsAmt: Number,
    careAmt: Number,
    otherAmt: Number
})

module.exports = mongoose.model('planning', planningSchema)