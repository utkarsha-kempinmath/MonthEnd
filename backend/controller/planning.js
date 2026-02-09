const Planning = require('../models/planningModel')

exports.savePlan = async (req, res) => {
    try {

        const { categories, month } = req.body

        const total = categories.reduce((sum, c) => sum + c.amount, 0)

        const plan = await Planning.findOneAndUpdate(
            { user: req.user._id, month },
            { categories, total },
            { upsert: true, new: true }
        )

        res.json({
            success: true,
            plan
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getPlan = async (req, res) => {
    try {

        const { month } = req.query

        const plan = await Planning.findOne({
            user: req.user._id,
            month
        })

        res.json({
            success: true,
            plan
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
