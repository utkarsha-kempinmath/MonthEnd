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
    risk: {
        level: { type: String },
        overspendingProbability: { type: Number },
        financialInstabilityScore: { type: Number }
    },

    financialPosition: {
        spent: Number,
        budget: Number,
        remaining: Number,
        daysLeft: Number,
        avgDailySpend: Number
    },

    affordability: {
        canAfford: Boolean,
        safeLimit: Number,
        dangerLimit: Number
    },

    forecast: {
        projectedSpend: Number,
        remainingBuffer: Number,
        confidence: Number
    },

    goalStatus: {
        progress: Number,
        onTrack: Boolean
    },

    impact: {
        delayAmount: Number,
        delayRisk: String,
        budgetImpact: Number,
        goalImpact: Number,
        behaviorRisk: String
    },

    behavioral: {
        dominantPattern: String,
        trigger: String,
        consistencyScore: Number
    },

    predictions: {
        endOfMonthBalance: Number,
        goalAchievementProbability: Number
    },

    anomalies: { type: Object },

    insights: {
        summary: String,
        tags: [String]
    }
}

}, { timestamps: true });

behaviorSnapshotSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("BehaviorSnapshot", behaviorSnapshotSchema);