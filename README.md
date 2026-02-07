MonthEnd
<<<<<<< HEAD

=======
>>>>>>> 14bea29476738d90e3ae86ad5256dd04a1bd840a
Patterns over prescriptions.

Allowance-Based Financial Wellness Platform

A student-focused budgeting and financial wellness system designed for Indian teenagers and young adults to build healthy money habits, reduce financial stress, and learn financial decision-making in a safe, non-judgmental way.

This project treats money management as a behavioral and educational challenge, not a financial optimization problem.

Problem Statement

In India, most students:

Receive fixed monthly allowances

Do not earn independently during school or college

Lack structured financial literacy

Experience anxiety, guilt, or dependency due to poor budgeting

Most existing finance apps are built for earning adults, not allowance-based students.

This project addresses that gap.

Core Idea

Instead of only tracking expenses, the system:

Learns a student’s spending behavior

Predicts consequences before money is spent

Encourages reflection and informed decision-making

The focus is awareness and well-being, not control or profit.

✨ Key Features ✅ Allowance-Based Budgeting

Fixed monthly allowance setup

Expected expense limits

Actual vs expected expense tracking

📊 Spending Visualization

Category-wise breakdown

Deviation from expected spending

Monthly summaries for reflection

🧠 Behavioral Budget Twin (What If Simulation)

Creates a temporary in-memory snapshot of the user’s current budget state

Simulates hypothetical expenses before spending

Shows impact on:

End-of-month balance

Savings goals

Spending risk level

Real user data is never modified during simulations.

💬 Conversational Financial Assistant (Chatbot)

A supportive chatbot that:

Answers questions like:

“Can I afford this right now?”

“How will this affect my goal?”

Explains predictions using numbers and past behavior

Avoids alarms, judgment, or generic advice

⚠️ This is not a generative AI chatbot. It is an explainable, rule-based and ML-assisted decision-support system.

🎯 Goal Setting & Reflection

Short-term goal creation (e.g., saving for a device)

Goal feasibility evaluation

Monthly reflection to reinforce learning

🏗️ System Architecture (High Level)

Frontend: Web dashboard with expense tracking and chat interface

Backend: API layer handling logic and simulations

Behavioral Engine:

Spending pattern detection

Risk scoring

What-if simulations via in-memory state cloning

Data Layer: User profiles, allowances, expenses, derived insights

The chatbot acts as a conversational interface, not standalone intelligence.

▶️ Demo Flow (End-to-End)

This is the typical user journey demonstrated in the prototype:

Allowance Setup User enters their monthly allowance and expected spending limits.

Expense Logging Daily expenses are added manually and categorized.

Visualization & Awareness The dashboard shows:

Expected vs actual spending

Category-wise patterns

Remaining allowance for the month

What If Query via Chatbot User asks: “Can I spend ₹600 today?”

Budget Twin Simulation

System creates a temporary snapshot of the current budget state

Injects the hypothetical expense

Recalculates end-of-month balance and risk

Explainable Response Chatbot replies with a clear, data-backed explanation, for example:

“Based on your last two months, this expense may increase your end-of-month shortfall risk by 40%.”

User Decision User decides whether to proceed, adjust, or delay the expense.

Monthly Reflection At month-end, the system summarizes spending behavior and learnings.

Tech Stack (Current & Planned) Frontend

React-based web UI

Budget and chart visualizations

Backend

Node.js + Express

REST APIs

Database: MongoDB

Intelligence Layer

Rule-based logic

Statistical trend analysis

AI-ML-assisted enhancements planned in later phases

🚧 Project Status

Implemented

Frontend UI

Budget tracking and visualization

System and chatbot architecture design

In Progress / Planned

Backend APIs

Behavioral modeling

Chatbot integration

Goal feasibility logic

This is an early-stage, learning-focused prototype, intentionally scoped for clarity and feasibility.

Design Principles

Explainable > Complex

Preventive > Reactive

Educational > Prescriptive

Trust > Automation

The system is designed to support user judgment, not replace it.

🌍 Intended Impact

Reduce financial stress among students

Improve financial literacy through lived experience

Encourage responsible independence

Provide a safe introduction to money management

Track Alignment: Health, Education & Social Impact

📌 Disclaimer

This project:

Does not offer financial advice

Does not handle payments or investments

Does not promote borrowing or trading

It is strictly a budgeting and financial awareness tool. It’s about being more aware.
