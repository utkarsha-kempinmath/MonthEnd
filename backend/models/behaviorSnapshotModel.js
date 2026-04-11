const mongoose = require("mongoose");

const behaviorSnapshotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    month: {
        type: String,  // "2026-02"
        required: true
    },

    version: {
        type: Number,
        default: 1
    },

    stateInput: {
        type: Object,
        required: true
    },

    mlOutput: {
        type: Object,

        risk: {
            level,
            overspendingProbability,
            financialInstabilityScore
        },

        financialPosition: {
            spent,
            budget,
            remaining,
            daysLeft,
            avgDailySpend
        },

        affordability: {
            canAfford,
            safeLimit,
            dangerLimit
        },

        forecast: {
            projectedSpend,
            remainingBuffer,
            confidence
        },

        goalStatus: {
            progress,
            onTrack
        },

        impact: {
            delayAmount,
            delayRisk,
            budgetImpact,
            goalImpact,
            behaviorRisk
        },

        behavioral: {
            dominantPattern,
            trigger,
            consistencyScore
        },

        predictions: {
            endOfMonthBalance,
            goalAchievementProbability
        },

        anomalies,

        insights: {
            summary,
            tags
        }
    }

}, { timestamps: true });

behaviorSnapshotSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("BehaviorSnapshot", behaviorSnapshotSchema);