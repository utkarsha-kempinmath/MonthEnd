const express = require('express')
const router = express.Router()

const isLoggedIn = require('../middleware/auth')
const controller = require('../controller/expenses')

router.post('/', isLoggedIn, controller.addExpense)
router.get('/', isLoggedIn, controller.getExpenses)

module.exports = router
