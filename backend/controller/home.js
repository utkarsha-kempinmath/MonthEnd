const { ErrorHandler } = require('../errors/error.js');
const User = require('../models/userModel.js');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
dotenv.config({path: './config/config.env'});

const users = require("../models/userModel");
const Expense = require('../models/expensesModel')
const Planning = require('../models/planningModel')
const { generateInsights } = require('../services/insightsGeneral.js')

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
    const user = await users.findById(req.user._id);

    const expenses = user.expenses;
    const allowance = user.allowance;

    const totalIncome = allowance.reduce((acc, a) => acc + a.amount, 0);

    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

    const remaining = totalIncome - totalSpent;

    const categoryMap = {};

    expenses.forEach(e => {
      categoryMap[e.catagory] =
        (categoryMap[e.catagory] || 0) + e.amount;
    });

    const categorySplit = Object.entries(categoryMap).map(
      ([catagory, amount]) => ({ catagory, amount })
    );

    res.json({
      success: true,
      totalIncome,
      totalSpent,
      remaining,
      categorySplit
    });

  } catch (err) {
    next(err);
  }
};