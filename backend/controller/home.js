const { ErrorHandler } = require('../errors/error.js');
const User = require('../models/userModel.js');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
dotenv.config({path: './config/config.env'});

const users = require("../models/userModel");

const getDashboard = async (req, res, next) => {
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

module.exports = { getDashboard };

