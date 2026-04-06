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
const Calendar = require('../models/calendarModel')
const BehaviorProfile = require('../models/behaviorProfileModel')
const Goal = require("../models/goalModel")
const Allowance = require("../models/allowanceModel")

exports.getMonthlyReflection = async (req, res) => {
    try {

        const userId = req.user._id
        const monthQuery = req.query.month

        const baseDate = monthQuery ? new Date(monthQuery + "-01") : new Date()

        const year = baseDate.getFullYear()
        const monthIndex = baseDate.getMonth()

        const start = new Date(year, monthIndex, 1)
        const end = new Date(year, monthIndex + 1, 1)

        const prevStart = new Date(year, monthIndex - 1, 1)
        const prevEnd = new Date(year, monthIndex, 1)

        // ✅ FIX: define before usage
        const monthString = monthQuery
            ? monthQuery
            : `${year}-${String(monthIndex + 1).padStart(2, '0')}`

        const goals = await Goal.find({ user: req.user._id })
        const allowance = await Allowance.findOne({ user: req.user._id })

        const [expenses, previousExpenses, plan, events, profileDoc] = await Promise.all([
            Expense.find({ user: userId, date: { $gte: start, $lt: end } }),
            Expense.find({ user: userId, date: { $gte: prevStart, $lt: prevEnd } }),
            Planning.findOne({ user: userId, month: monthString }),
            Calendar.find({
                user: userId,
                $or: [
                    {
                        startDate: { $lte: end },
                        endDate: { $gte: start }
                    },
                    {
                        startDate: { $lte: end },
                        endDate: null
                    }
                ]
            }),
            BehaviorProfile.findOne({ user: userId })
        ])

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

        const formattedAllowance = allowance
            ? {
                monthlyAllowance: allowance.amount || 0,
                totalSpent,
                remaining: (allowance.amount || 0) - totalSpent,
                utilization:
                    allowance.amount > 0
                        ? totalSpent / allowance.amount
                        : 0
            }
            : {
                monthlyAllowance: 0,
                totalSpent,
                remaining: -totalSpent,
                utilization: 0
            }

        const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
        const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0)

        const avgTimeline = goals.length
            ? goals.reduce((sum, g) => sum + g.timelineMonths, 0) / goals.length
            : 0

        const goalCount = goals.length

        const pressureScore = totalTarget
            ? (totalTarget - totalSaved) / totalTarget
            : 0

        const aggregatedGoals = {
            totalTarget,
            totalSaved,
            avgTimeline,
            goalCount,
            pressureScore
        }

        const profile = profileDoc ? profileDoc.traits : null

        const examCount = events.filter(e => e.eventType === 'academic').length
        const festCount = events.filter(e => e.eventType === 'social').length
        const otherEventCount = events.filter(e => e.eventType === 'personal').length

        const now = new Date()

        let daysToNextEvent = Infinity
        let daysSinceLastEvent = Infinity
        let isEventActive = false

        let totalEventDays = 0
        let weightedIntensitySum = 0

        const intensityMap = {
            academic: 0.9,
            social: 0.8,
            personal: 0.6,
            financial: 0.5,
            other: 0.4
        }

        events.forEach(e => {
            const start = new Date(e.startDate)
            const endDate = e.endDate ? new Date(e.endDate) : start

            const duration =
                Math.max(1, (endDate - start) / (1000 * 60 * 60 * 24) + 1)

            totalEventDays += duration

            const intensity = intensityMap[e.eventType] || 0.5
            weightedIntensitySum += intensity * duration

            if (now >= start && now <= endDate) {
                isEventActive = true
            }

            if (start >= now) {
                const diff = (start - now) / (1000 * 60 * 60 * 24)
                daysToNextEvent = Math.min(daysToNextEvent, diff)
            }

            if (endDate <= now) {
                const diff = (now - endDate) / (1000 * 60 * 60 * 24)
                daysSinceLastEvent = Math.min(daysSinceLastEvent, diff)
            }
        })

        const eventIntensityScore =
            totalEventDays > 0
                ? weightedIntensitySum / totalEventDays
                : 0

        const eventContext = {
            examCount,
            festCount,
            otherEventCount,
            isEventActive,
            daysToNextEvent: isFinite(daysToNextEvent) ? daysToNextEvent : null,
            daysSinceLastEvent: isFinite(daysSinceLastEvent) ? daysSinceLastEvent : null,
            totalEventDays,
            eventIntensityScore
        }

        const existingSnapshot = await BehaviorSnapshot.findOne({
            user: userId,
            month: monthString
        })

        const currentNow = new Date()
        const currentMonthString = `${currentNow.getFullYear()}-${String(currentNow.getMonth() + 1).padStart(2, '0')}`

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
        const dailyTrend = new Array(daysInMonth).fill(0)

        expenses.forEach(e => {
            const day = new Date(e.date).getDate()
            dailyTrend[day - 1] += e.amount
        })

        if (existingSnapshot && monthString !== currentMonthString) {
            return res.json({
                success: true,
                dailyTrend,
                eventContext,
                stateInput: existingSnapshot.stateInput,
                mlOutput: existingSnapshot.mlOutput
            })
        }

        const stateInput = buildBehavioralStateInput({
            currentExpenses: expenses,
            previousExpenses,
            currentPlan: plan,
            year,
            monthIndex
        })

        if (!stateInput) {
            return res.json({
                success: true,
                dailyTrend,
                reflections: ["No spending data for this month yet."]
            })
        }

        const enrichedState = {
            ...stateInput,
            eventContext
        }

        const mlInput = {
            state: enrichedState,
            goals: aggregatedGoals,
            allowance: formattedAllowance,
            profile
        }

        const mlOutput = {
            risk: {
                overspendingProbability:
                    mlInput.state.financial.budgetUtilization > 1 ? 0.8 : 0.3
            },
            behavioral: {
                dominantPattern:
                    mlInput.state.emotion.stressSpendRatio > 0.5
                        ? "emotional_spending"
                        : "controlled",
            },
            anomalies: [
                (mlInput.state.eventContext?.eventIntensityScore || 0) > 0.7
                    ? { type: "event_spike", severity: 0.7 }
                    : null
            ].filter(Boolean),
            insights: {
                summary: "basic rule-based insight"
            }
        }

        await BehaviorSnapshot.findOneAndUpdate(
            { user: userId, month: monthString },
            {
                version: 1,
                stateInput: enrichedState,
                profileInput: profile,
                mlInput,
                mlOutput
            },
            { upsert: true, new: true }
        )

        res.json({
            success: true,
            dailyTrend,
            stateInput: enrichedState,
            mlOutput
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
exports.getMonthlyAnalysis = async (req, res) => {
    try {

        const userId = req.user._id

        let { month } = req.query

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