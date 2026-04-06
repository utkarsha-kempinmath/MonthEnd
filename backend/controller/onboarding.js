const BehaviorProfile = require('../models/behaviorProfileModel')
const { buildBehaviorProfile } = require('../services/behaviorProfile')
const Calendar = require('../models/calendarModel')
const Goal = require('../models/goalModel')

exports.completeOnboarding = async (req, res) => {
  try {
    const userId = req.user._id

    const { profileAnswers, eventAnswers, goalData } = req.body

    // 1. SAVE BEHAVIOR PROFILE
    const traits = buildBehaviorProfile(profileAnswers)

    await BehaviorProfile.findOneAndUpdate(
      { user: userId },
      { traits, version: 1 },
      { upsert: true, new: true }
    )

    // 2. SAVE EVENTS
    const events = []

    const now = new Date()

    for (let i = 0; i < eventAnswers.exams; i++) {
      events.push({
        user: userId,
        eventName: "Exam",
        startDate: now,
        eventType: "academic",
        expectedImpact: eventAnswers.intensity
      })
    }

    for (let i = 0; i < eventAnswers.fests; i++) {
      events.push({
        user: userId,
        eventName: "Fest",
        startDate: now,
        eventType: "social",
        expectedImpact: eventAnswers.intensity
      })
    }

    for (let i = 0; i < eventAnswers.personal; i++) {
      events.push({
        user: userId,
        eventName: "Personal Event",
        startDate: now,
        eventType: "personal",
        expectedImpact: eventAnswers.intensity
      })
    }

    if (events.length > 0) {
      await Calendar.insertMany(events)
    }

    // 3. SAVE GOAL
    if (goalData) {
      await Goal.create({
        user: userId,
        name: goalData.name,
        targetAmount: goalData.targetAmount,
        timelineMonths: goalData.timelineMonths
      })
    }

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}