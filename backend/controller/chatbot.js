const { buildBehavioralStateInput } = require("../services/reflection")
const Calendar = require('../models/calendarModel')
const Expense = require('../models/expensesModel')
const Planning = require('../models/planningModel')
const BehaviorProfile = require('../models/behaviorProfileModel')
const Goal = require("../models/goalModel")
const Allowance = require("../models/allowanceModel")
const { callMLService } = require("../services/mlService")

exports.handleChatQuery = async (req, res) => {
  try {

    const userId = req.user._id
    const { queryType, amount } = req.body

    const now = new Date()
    const year = now.getFullYear()
    const monthIndex = now.getMonth()

    const start = new Date(year, monthIndex, 1)
    const end = new Date(year, monthIndex + 1, 1)

    const [expenses, plan, events, profileDoc, goals, allowance] = await Promise.all([
      Expense.find({ user: userId, date: { $gte: start, $lt: end } }),
      Planning.findOne({ user: userId, month: `${year}-${String(monthIndex + 1).padStart(2, '0')}` }),
      Calendar.find({ user: userId }),
      BehaviorProfile.findOne({ user: userId }),
      Goal.find({ user: userId }),
      Allowance.findOne({ user: userId })
    ])

    const stateInput = buildBehavioralStateInput({
      currentExpenses: expenses,
      previousExpenses: [],
      currentPlan: plan,
      year,
      monthIndex
    })

    const examCount = events.filter(e => e.eventType === 'academic').length
    const festCount = events.filter(e => e.eventType === 'social').length
    const otherEventCount = events.filter(e => e.eventType === 'personal').length

    const enrichedState = {
      ...stateInput,
      eventContext: {
        examCount,
        festCount,
        otherEventCount
      }
    }

    const profile = profileDoc ? profileDoc.traits : null

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0)

    const mlInput = {
      state: enrichedState,
      profile,
      goals: {
        totalTarget,
        totalSaved
      },
      allowance: {
        monthlyAllowance: allowance?.amount || 0
      }
    }

    let response = {}

    if (queryType === "affordability") {
      const remaining = mlInput.allowance.monthlyAllowance -
        expenses.reduce((sum, e) => sum + e.amount, 0)

      response = {
        type: "affordability",
        affordability: {
          canAfford: amount <= remaining,
          safeLimit: remaining * 0.7,
          dangerLimit: remaining * 0.9
        },
        chatbot: {
          message: amount <= remaining
            ? "You're within budget. This won't hurt your month."
            : "This might push you over budget. Consider delaying."
        }
      }
    }

    else if (queryType === "behavior_analysis") {
      response = {
        type: "behavior_analysis",
        behavioral: {
          dominantPattern:
            mlInput.state.emotion?.stressSpendRatio > 0.5
              ? "stress_spending"
              : "controlled"
        },
        chatbot: {
          message:
            "You tend to spend more during stressful periods."
        }
      }
    }

    res.json({
      success: true,
      response
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}