🚀 Antigravity

«Make bluffing impossible.

AI-powered accountability platform that transforms task management into measurable, verifiable execution. Managers gain instant visibility. Employees receive fair, data-driven feedback. Every work log is analyzed, scored, and verified by AI.»

"Next.js" (https://img.shields.io/badge/Next.js-16-black)
"TypeScript" (https://img.shields.io/badge/TypeScript-Strict-blue)
"Supabase" (https://img.shields.io/badge/Supabase-PostgreSQL-green)
"Gemini" (https://img.shields.io/badge/Gemini-2.5%20Flash-orange)
"Tailwind" (https://img.shields.io/badge/Tailwind-v4-cyan)
"License" (https://img.shields.io/badge/License-MIT-purple)

---

📖 Overview

Traditional task management tools answer one question:

«"What tasks exist?"»

Antigravity answers a much more important question:

«"How do we know the work actually happened?"»

Modern teams lose countless hours chasing updates, verifying progress, reviewing vague work logs, and identifying blockers.

Antigravity introduces an AI-powered accountability engine that:

- Verifies employee work logs
- Detects vague or low-quality updates
- Generates AI-powered management summaries
- Calculates accountability scores
- Maintains a complete audit trail
- Provides actionable team insights

The result is a transparent workplace where performance is measured by evidence rather than assumptions.

---

🎯 Problem Statement

Most organizations struggle with:

- Lack of visibility into actual work progress
- Generic status updates with little evidence
- Difficulty identifying blockers early
- Time wasted chasing employee updates
- Subjective performance evaluation
- No centralized accountability system

Managers often ask:

- Who is actually working?
- Which tasks are at risk?
- Who needs help?
- Which updates are genuine?
- What should I focus on today?

Antigravity answers these questions automatically.

---

✨ Key Features

🤖 AI Work Log Verification

Employees submit work logs.

Antigravity analyzes:

- Relevance
- Specificity
- Evidence of work
- Completion confidence
- Deliverable quality

Example:

Low Quality Log

Worked on the website today.

Result:

Trust Score: 22%
Confidence: Low

Reason:
No measurable progress.
No deliverables mentioned.
No evidence provided.

High Quality Log

Fixed checkout API timeout issue.
Implemented retry logic.
Added tests and verified deployment.

Result:

Trust Score: 94%
Confidence: High

---

📊 Accountability Score Engine

Every employee receives a dynamic accountability score.

Factors include:

- Task completion rate
- Deadline adherence
- AI trust score
- Work log quality
- Consistency of updates

This helps managers identify:

- Top performers
- At-risk employees
- Coaching opportunities

---

🧠 AI Team Summary

Generate executive summaries instantly.

AI analyzes:

- Tasks
- Work logs
- Deadlines
- Performance trends

Outputs:

- Risks
- Blockers
- High performers
- Overdue tasks
- Recommended actions

Example:

3 tasks are overdue.

Priya completed 5 tasks ahead of schedule.

Finance module has the highest project risk.

Recommendation:
Allocate additional resources to the Finance team.

---

✨ AI-Assisted Task Creation

Managers can create tasks faster using AI.

Automatically generates:

- Priority level
- Suggested deadline
- Deliverables
- Execution plan

---

📝 Complete Audit Trail

Every critical action is tracked.

Captured events:

- Task creation
- Task updates
- Assignments
- Work log submissions
- Status changes
- AI evaluations

Managers always know:

- Who changed what
- When it happened
- Why it happened

---

📈 Manager Dashboard

Comprehensive command center featuring:

- KPI cards
- Accountability rankings
- Team performance analytics
- AI insights panel
- Audit activity feed
- Risk indicators
- Completion trends

---

👨‍💼 Employee Dashboard

Personal productivity center including:

- Assigned tasks
- Deadlines
- Progress tracking
- AI feedback
- Performance metrics
- Accountability score

---

🏗 Architecture

┌─────────────────────┐
│      Next.js        │
│   Frontend (RSC)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Supabase        │
│ Auth + Database     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Gemini 2.5 Flash  │
│ AI Verification     │
└─────────────────────┘

---

🛠 Tech Stack

Frontend

- Next.js 16
- React Server Components
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Recharts

Backend

- Supabase
- PostgreSQL
- Row Level Security
- Realtime Subscriptions

AI Layer

- Google Gemini 2.5 Flash

Deployment

- Vercel

---

📂 Project Structure

app/
├── manager/
├── employee/
├── api/
├── login/
└── signup/

components/
├── dashboard/
├── tasks/
├── audit/
├── charts/
└── ui/

lib/
├── ai/
├── supabase/
├── scoring/
└── utils/

hooks/
types/

supabase/
├── schema.sql
└── seed.sql

---

⚙️ Installation

Clone Repository

git clone https://github.com/yourusername/antigravity.git
cd antigravity

Install Dependencies

npm install

---

🔑 Environment Variables

Create:

.env.local

Add:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=

---

🗄 Database Setup

Run:

supabase/schema.sql

inside the Supabase SQL Editor.

Optional:

supabase/seed.sql

to generate demo data.

---

👥 Demo Accounts

Role| Email| Password
Manager| sarah.manager@antigravity.demo| demo1234
Employee| alice.chen@antigravity.demo| demo1234

---

🚀 Running Locally

npm run dev

Open:

http://localhost:3000

---

🎬 Demo Flow

Manager

1. Login
2. Create task
3. Use AI Assist
4. Assign employee
5. Monitor progress

Employee

1. Login
2. View assigned tasks
3. Submit work log
4. Receive AI feedback

Manager

1. Generate AI Team Summary
2. Review Accountability Scores
3. View Audit Trail

---

📊 Why Antigravity?

Task management tools track activity.

Antigravity verifies execution.

Instead of asking:

«“What tasks are assigned?”»

Managers can finally ask:

«“What work can I trust?”»

---

🔮 Future Roadmap

- Slack Integration
- Microsoft Teams Integration
- GitHub Activity Verification
- AI Performance Forecasting
- Team Health Analytics
- Automated Risk Prediction
- Organization-wide Reporting
- Custom AI Evaluation Models

---

🏆 Built For

Hackathons • Startups • Remote Teams • Agencies • Product Teams • Engineering Organizations

---

📜 License

MIT License

---

Antigravity — Making accountability measurable, transparent, and impossible to fake.