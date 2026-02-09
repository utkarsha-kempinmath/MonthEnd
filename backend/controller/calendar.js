const Calendar = require('../models/calendarModel')

exports.addEvent = async (req, res) => {
    try {
        const event = await Calendar.create({
            ...req.body,
            user: req.user._id
        })

        res.status(201).json({
            success: true,
            event
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getEvents = async (req, res) => {
    try {
        const events = await Calendar.find({ user: req.user._id })
            .sort({ startDate: 1 })

        res.json({
            success: true,
            events
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const event = await Calendar.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        )

        res.json({
            success: true,
            event
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        await Calendar.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
