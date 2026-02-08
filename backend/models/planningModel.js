const mongoose = require('mongoose')

const planningSchema = mongoose.Schema({
    food: Number,
    transport: Number,
    academics: Number,
    care: Number,
    other: Number
})

module.exports = mongoose.model('planning', planningSchema)