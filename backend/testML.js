const { runAnalytics } = require("./services/mlBridge");

const test = async () => {
    try {
        const payload = {
            user: {
                userId: "test123",
                monthlyAllowance: 10000
            },
            expenses: [
                { date: "2026-04-01", category: "food", amount: 200 },
                { date: "2026-04-02", category: "travel", amount: 500 },
                { date: "2026-04-03", category: "shopping", amount: 800 },
                { date: "2026-04-04", category: "food", amount: 300 },
                { date: "2026-04-05", category: "misc", amount: 400 }
            ]
        };

        const result = await runAnalytics(payload);

        console.log("✅ ML OUTPUT:");
        console.log(JSON.stringify(result, null, 2));

    } catch (err) {
        console.error("❌ ERROR:", err);
    }
};

test();