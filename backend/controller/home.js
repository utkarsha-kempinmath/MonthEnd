const { ErrorHandler } = require('../errors/error.js');
const User = require('../models/userModel.js');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { generateReflections } = require("../services/reflection")
const { generateInsights } = require('../services/insightsGeneral.js')
dotenv.config({ path: './config/config.env' });

const users = require("../models/userModel");
const Expense = require('../models/expensesModel')
const Planning = require('../models/planningModel')
const BehaviorSnapshot = require('../models/behaviorSnapshotModel')
const { buildBehavioralStateInput } = require("../services/reflection")

exports.getMonthlyReflection = async (req, res) => {
    try {

        const userId = req.user._id
        const monthQuery = req.query.month

        const now = monthQuery ? new Date(monthQuery + "-01") : new Date()

        const year = now.getFullYear()
        const monthIndex = now.getMonth()

        const start = new Date(year, monthIndex, 1)
        const end = new Date(year, monthIndex + 1, 1)

        const prevStart = new Date(year, monthIndex - 1, 1)
        const prevEnd = new Date(year, monthIndex, 1)

        const [expenses, previousExpenses, plan] = await Promise.all([
            Expense.find({ user: userId, date: { $gte: start, $lt: end } }),
            Expense.find({ user: userId, date: { $gte: prevStart, $lt: prevEnd } }),
            Planning.findOne({ user: userId, month: monthQuery })
        ])

        const monthString = monthQuery
            ? monthQuery
            : `${year}-${String(monthIndex + 1).padStart(2, '0')}`

        const existingSnapshot = await BehaviorSnapshot.findOne({
            user: userId,
            month: monthString
        })

        const currentNow = new Date()
        const currentMonthString = `${currentNow.getFullYear()}-${String(currentNow.getMonth() + 1).padStart(2, '0')}`

        if (existingSnapshot && monthString !== currentMonthString) {
            return res.json({
                success: true,
                dailyTrend,
                stateInput: existingSnapshot.stateInput,
                mlOutput: existingSnapshot.mlOutput
            })
        }

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
        const dailyTrend = new Array(daysInMonth).fill(0)

        expenses.forEach(e => {
            const day = new Date(e.date).getDate()
            dailyTrend[day - 1] += e.amount
        })

        const stateInput = buildBehavioralStateInput({
            currentExpenses: expenses,
            previousExpenses,
            currentPlan: plan,
            year,
            monthIndex: monthIndex + 1
        })

        if (!stateInput) {
            return res.json({
                success: true,
                dailyTrend,
                reflections: ["No spending data for this month yet."]
            })
        }

        // TEMP ML (Replace later)
        const mlOutput = {
            riskScores: {
                overspendRisk: stateInput.financial.budgetUtilization > 1 ? 0.8 : 0.3
            },
            anomalyFlag: stateInput.event.highestExpenditureEventScore > 3
        }

        await BehaviorSnapshot.findOneAndUpdate(
            { user: userId, month: monthQuery },
            {
                version: 1,
                stateInput,
                mlOutput
            },
            { upsert: true, new: true }
        )

        res.json({
            success: true,
            dailyTrend,
            stateInput,
            mlOutput
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getMonthlyAnalysis = async (req, res) => {
    try {

        const userId = req.user._id

        let { month } = req.query   // "2026-02"

        const now = new Date()

        if (!month) {
            month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        }

        const [year, monthIndex] = month.split('-').map(Number)

        const start = new Date(year, monthIndex - 1, 1)
        const end = new Date(year, monthIndex, 1)

        const plan = await Planning.findOne({
            user: userId,
            month
        })

        const expenses = await Expense.find({
            user: userId,
            date: { $gte: start, $lt: end }
        })

        const actualMap = {}

        expenses.forEach(e => {
            actualMap[e.category] =
                (actualMap[e.category] || 0) + e.amount
        })

        const stats = []

        if (plan) {
            plan.categories.forEach(cat => {

                const actual = actualMap[cat.name] || 0

                stats.push({
                    category: cat.name,
                    expected: cat.amount,
                    actual,
                    diff: actual - cat.amount
                })
            })
        }

        const insights = generateInsights(stats, month)

        res.json({
            success: true,
            month,
            stats,
            insights
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id

    const now = new Date()
    const year = now.getFullYear()
    const monthIndex = now.getMonth()

    const start = new Date(year, monthIndex, 1)
    const end = new Date(year, monthIndex + 1, 1)

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lt: end }
    })

    const plan = await Planning.findOne({
      user: userId,
      month: `${year}-${String(monthIndex + 1).padStart(2, "0")}`
    })

    const totalIncome = plan
      ? plan.categories.reduce((acc, c) => acc + c.amount, 0)
      : 0

    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0)

    const remaining = totalIncome - totalSpent

    const categoryMap = {}

    expenses.forEach(e => {
      categoryMap[e.category] =
        (categoryMap[e.category] || 0) + e.amount
    })

    const categorySplit = Object.entries(categoryMap).map(
      ([category, amount]) => ({ category, amount })
    )

    res.json({
      success: true,
      totalIncome,
      totalSpent,
      remaining,
      categorySplit
    })

  } catch (err) {
    next(err)
  }
}