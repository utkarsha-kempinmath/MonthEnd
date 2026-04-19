📉 MonthEnd
Patterns over prescriptions.
An Allowance-Based Financial Wellness Platform

A student-focused budgeting and financial wellness system designed for Indian teenagers and young adults to build healthy money habits, reduce financial stress, and learn financial decision-making in a safe, non-judgmental way.

</div>

📸 App Showcase
(Add your app screenshots in the assets folder and update the links below)

<div align="center">
<img src="app imgs\dashboard.jpeg" width="22%" />
<img src="app imgs\expectedVsActual.jpeg" width="22%" />
</div>

🛑 Problem Statement
In India, most students:

Receive fixed monthly allowances.

Do not earn independently during school or college.

Lack structured financial literacy.

Experience anxiety, guilt, or dependency due to poor budgeting.

Most existing finance apps are built for earning adults, not allowance-based students. This project addresses that gap.

💡 Core Idea
This project treats money management as a behavioral and educational challenge, not a financial optimization problem. Instead of only tracking expenses, the system:

Learns a student’s spending behavior.

Predicts consequences before money is spent.

Encourages reflection and informed decision-making.

The focus is awareness and well-being, not control or profit.

✨ Key Features
✅ Allowance-Based Budgeting
Fixed monthly allowance setup.

Expected expense limits vs. Actual expense tracking.

Secure Google Auth & traditional Sign-Up options.

<div align="center">
<img src="app imgs\allowance.jpeg" width="22%" />
</div>

📊 Spending Visualization
Category-wise breakdown.

Deviation from expected spending.

Monthly summaries for reflection.

<div align="center">
<img src="app imgs\reflections.jpeg" width="22%" />
</div>

🧠 Behavioral Budget Twin (What-If Simulation)
Creates a temporary in-memory snapshot of the user’s current budget state.

Simulates hypothetical expenses before spending.

Shows the impact on: End-of-month balance, savings goals, and spending risk level.

(Real user data is never modified during simulations).

<div align="center">
<img src="app imgs\chatbot1.jpeg" width="22%" />
</div>

💬 Conversational Financial Assistant (Chatbot)
A supportive chatbot that answers questions like: "Can I afford this right now?" or "How will this affect my goal?"

Explains predictions using numbers and past behavior.

Avoids alarms, judgment, or generic advice.

Note: This is an explainable, rule-based and ML-assisted decision-support system, not a standalone generative AI.

👨‍👩‍👧 Automated Parent Reports (Cron Jobs)
Users can selectively choose a date to share their monthly progress with parents.

<div align="center">
<img src="app imgs\share.jpeg" width="22%" />
</div>

Fully customizable privacy: users choose exactly which insights to share (Goals, Category Split, Reflections).

Automated email reports sent via backend scheduling.

<div align="center">
<img src="app imgs\chatbot2.jpeg" width="22%" />
</div>

🎯 Goal Setting & Reflection
Short-term goal creation (e.g., saving for a device).

Goal feasibility evaluation and monthly reflection to reinforce learning.

<div align="center">
<img src="app imgs\goals.jpeg" width="22%" />
</div>

▶️ Demo Flow (End-to-End User Journey)
Allowance Setup: User securely logs in and enters their monthly allowance and expected limits.

<div align="center">
<img src="app imgs\auth.png" width="22%" />
</div>

Expense Logging: Daily expenses are added and categorized.

<div align="center">
<img src="app imgs\expense.jpeg" width="22%" />
</div>

Visualization & Awareness: The dashboard displays expected vs. actual spending and remaining allowance.

What-If Query: User asks the chatbot, “Can I spend ₹600 today?”

<div align="center">
<img src="app imgs\chatbot1.jpeg" width="22%" />
</div>

Budget Twin Simulation: System clones the budget state, injects the expense, and recalculates risks.

<div align="center">
<img src="app imgs\chatbot2.jpeg" width="22%" />
</div>

Explainable Response: Chatbot replies: “Based on your last two months, this expense may increase your end-of-month shortfall risk by 40%.”

User Decision: User decides whether to proceed, adjust, or delay.

Monthly Reflection & Sharing: At month-end, the system summarizes learnings and optionally emails a customized report to parents.

🏗️ System Architecture & Tech Stack
Frontend (Mobile App): React Native, Expo, Native Android (.aab/.apk)

Backend: Node.js, Express, REST APIs (Deployed on Render)

Database: MongoDB (User profiles, allowances, expenses, share configs)

Authentication: Google OAuth2.0, JWT Tokens

Background Jobs: Node-Cron (Automated parent reporting via email)

Intelligence Layer: Rule-based logic, statistical trend analysis, and in-memory state cloning.

🎨 Design Principles
Explainable > Complex

Preventive > Reactive

Educational > Prescriptive

Trust > Automation

The system is designed to support user judgment, not replace it.

🌍 Intended Impact
Reduce financial stress among students.

Improve financial literacy through lived experience.

Encourage responsible independence.

Provide a safe introduction to money management.

Track Alignment: Health, Education & Social Impact

📌 Disclaimer
This project:

Does not offer financial advice.

Does not handle real payments or investments.

Does not promote borrowing or trading.

It is strictly a budgeting and financial awareness tool. It’s about being more aware.