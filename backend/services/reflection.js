const calculateStdDev = (arr) => {
    if (!arr.length) return 0

    const mean = arr.reduce((a, b) => a + b, 0) / arr.length
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length
    return Math.sqrt(variance)
}

const safeDivide = (a, b) => {
    if (!b) return 0
    return a / b
}

exports.buildBehavioralStateInput = ({
    currentExpenses = [],
    previousExpenses = [],
    currentPlan = { totalBudget: 0 },
    year,
    monthIndex
}) => {

    if (!currentExpenses.length) return null

    //basic

    const totalSpent = currentExpenses.reduce((sum, e) => sum + e.amount, 0)
    const prevTotalSpent = previousExpenses.reduce((sum, e) => sum + e.amount, 0)

    const totalBudget = currentPlan.totalBudget || 0

    const transactionCount = currentExpenses.length
    const prevTransactionCount = previousExpenses.length

    //financial

    const budgetUtilization = safeDivide(totalSpent, totalBudget)

    const planDeviationRatio = totalBudget
        ? (totalSpent - totalBudget) / totalBudget
        : 0

    const spendingDelta = prevTotalSpent
        ? (totalSpent - prevTotalSpent) / prevTotalSpent
        : 0

    const transactionDelta = prevTransactionCount
        ? (transactionCount - prevTransactionCount) / prevTransactionCount
        : 0

    //emotional

    const emotionTotals = {}
    const prevEmotionTotals = {}

    currentExpenses.forEach(e => {
        if (e.emotion?.primary) {
            emotionTotals[e.emotion.primary] =
                (emotionTotals[e.emotion.primary] || 0) + e.amount
        }
    })

    previousExpenses.forEach(e => {
        if (e.emotion?.primary) {
            prevEmotionTotals[e.emotion.primary] =
                (prevEmotionTotals[e.emotion.primary] || 0) + e.amount
        }
    })

    const allEmotions = new Set([
        ...Object.keys(emotionTotals),
        ...Object.keys(prevEmotionTotals)
    ])

    const distribution = {}

    allEmotions.forEach(emo => {
        distribution[emo] = safeDivide(emotionTotals[emo] || 0, totalSpent)
    })

    const stressSpendRatio = safeDivide(emotionTotals["stressed"] || 0, totalSpent)

    const emotionalVolatilityIndex = [...allEmotions].reduce((sum, emo) => {
        const currRatio = safeDivide(emotionTotals[emo] || 0, totalSpent)
        const prevRatio = safeDivide(prevEmotionTotals[emo] || 0, prevTotalSpent)
        return sum + Math.abs(currRatio - prevRatio)
    }, 0)

    //temporal

    const dailyMap = {}

    currentExpenses.forEach(e => {
        const day = new Date(e.date).getDate()
        dailyMap[day] = (dailyMap[day] || 0) + e.amount
    })

    const dailyValues = Object.values(dailyMap)

    const daysInMonth = new Date(year, monthIndex, 0).getDate()

    const dailyStd = calculateStdDev(dailyValues)
    const dailyMean = safeDivide(totalSpent, daysInMonth)

    const dailyVolatilityScore = dailyMean
        ? dailyStd / dailyMean
        : 0

    const spikeThreshold = dailyMean + dailyStd
    const spikeDays = dailyValues.filter(v => v > spikeThreshold).length

    const spikeFrequency = safeDivide(spikeDays, daysInMonth)

    //event

    const highestDaySpend = dailyValues.length
        ? Math.max(...dailyValues)
        : 0

    const highestExpenditureEventScore = dailyMean
        ? highestDaySpend / dailyMean
        : 0

    return {
        version: 1,

        financial: {
            budgetUtilization,
            planDeviationRatio,
            spendingDelta,
            transactionDelta
        },

        emotion: {
            distribution,
            stressSpendRatio,
            emotionalVolatilityIndex
        },

        temporal: {
            dailyVolatilityScore,
            spikeFrequency
        },

        event: {
            highestExpenditureEventScore
        }
    }
}