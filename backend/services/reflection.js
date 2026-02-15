exports.generateReflections = (expenses) => {

    const observations = []

    if (!expenses.length) {
        return ["No spending data for this month yet."]
    }

    const dayMap = {}
    const categoryMap = {}
    const emotionMap = {}

    expenses.forEach(e => {

        const day = new Date(e.date).getDate()

        dayMap[day] = (dayMap[day] || 0) + e.amount
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount

        if (e.emotionTags?.length) {
            e.emotionTags.forEach(tag => {
                emotionMap[tag] = (emotionMap[tag] || 0) + 1
            })
        }
    })

    let peakDay = 0
    let peakValue = 0

    Object.entries(dayMap).forEach(([d, val]) => {
        if (val > peakValue) {
            peakValue = val
            peakDay = d
        }
    })

    let topCategory = ""
    let topValue = 0

    Object.entries(categoryMap).forEach(([c, val]) => {
        if (val > topValue) {
            topValue = val
            topCategory = c
        }
    })

    let topEmotion = ""
    let emotionCount = 0

    Object.entries(emotionMap).forEach(([e, val]) => {
        if (val > emotionCount) {
            emotionCount = val
            topEmotion = e
        }
    })

    if (peakDay)
        observations.push(`Highest spending happened on day ${peakDay} (₹${peakValue}).`)

    if (topCategory)
        observations.push(`${topCategory} was your biggest expense category this month.`)

    if (topEmotion)
        observations.push(`Most purchases were tagged '${topEmotion}'.`)

    if (observations.length === 0)
        observations.push("Your spending stayed fairly consistent this month")

    return observations.slice(0, 3)
}
