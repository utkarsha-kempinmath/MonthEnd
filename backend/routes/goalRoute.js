const express = require("express")
const router = express.Router()

const isLoggedIn = require("../middleware/auth")
const {
    getAllGoals,
    createGoal,
    getGoalAnalysis
} = require("../controller/goal")

router.get("/", isLoggedIn, getAllGoals)
router.post("/", isLoggedIn, createGoal)
router.get("/:goalId/analysis", isLoggedIn, getGoalAnalysis)
router.put("/:goalId", isLoggedIn, updateGoal)
router.delete("/:goalId", isLoggedIn, deleteGoal)

module.exports = router
