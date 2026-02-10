const Expense = require('../models/expensesModel')

exports.addExpense = async (req, res) => {
    try {

        const expense = await Expense.create({
            ...req.body,
            user: req.user._id
        })

        res.status(201).json({
            success: true,
            expense
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        )

        res.json({
            success: true,
            expense
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        res.json({
            success: true,
            message: "Expense deleted"
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


exports.getExpenses = async (req, res) => {
    try {

        const expenses = await Expense.find({
            user: req.user._id
        }).sort({ date: -1 })

        res.json({
            success: true,
            expenses
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
