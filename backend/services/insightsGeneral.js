exports.generateInsights = (stats) => {

    const insights = []

    stats.forEach(s => {

        const diff = s.actual - s.expected

        if (diff > s.expected * 0.2) {
            insights.push(
                `${s.category} spending exceeded expectation by ₹${diff}`
            )
        }

        if (diff < -s.expected * 0.2) {
            insights.push(
                `You saved ₹${Math.abs(diff)} in ${s.category}`
            )
        }
    })

    if (insights.length === 0) {
        insights.push("Your spending is well aligned with your plan this month 👍")
    }

    return insights.slice(0, 2)
}
