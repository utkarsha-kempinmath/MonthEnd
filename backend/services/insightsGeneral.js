exports.generateInsights = (stats, month) => {

    if (!stats || stats.length === 0) {
        return [`No spending data available for ${month}`]
    }

    const insights = []

    const sorted = [...stats].sort((a, b) =>
        Math.abs(b.diff) - Math.abs(a.diff)
    )

    sorted.forEach(s => {

        const diff = s.diff
        if (diff > s.expected * 0.2) {
            insights.push(
                `${s.category} spending exceeded expectation by ₹${diff}`
            )
        }

        else if (diff < -s.expected * 0.2) {
            insights.push(
                `You saved ₹${Math.abs(diff)} in ${s.category}`
            )
        }
    })

    if (insights.length === 0) {
        insights.push(`Spending stayed close to plan in ${month} `)
    }

    return insights.slice(0, 2)
}
