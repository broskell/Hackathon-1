# 🚀 Antigravity

**Make bluffing impossible.**

AI-powered accountability platform that transforms task management into measurable, verifiable execution. Managers gain instant visibility. Employees receive fair, data-driven feedback. Every work log is analyzed, scored, and verified by AI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-cyan)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## ⚡ Quick Start: Hackathon Demo (30 seconds)

**AI accountability for remote teams** — hackathon demo with static data. No login, no database, no API keys required.

```bash
cd antigravity
npm install
npm run dev
```

Open **http://localhost:3000** → choose **Manager Portal** or **Employee Portal**.

That’s it.

---

## 🎬 Demo Flow (For Judges)

1. **Manager Portal** → Dashboard (KPIs, charts, activity feed)
2. **Tasks** → open a task → change status
3. **Insights** → **Generate Team Summary** (mock AI)
4. **Audit** → sample audit trail
5. **Employee Portal** → **Tasks** → open **AI verification pipeline**
6. Submit a work log (try vague text like "worked on stuff" vs detailed text)
7. **Analytics** → trust score chart

> Use **Switch portal** in the header to go back to role selection.

---

## 📦 What's Included in Demo Mode (Mock Data)

- 3 employees, 5 tasks, work logs with AI trust scores
- Manager dashboard, task management, employee roster
- Employee tasks, work log form, analytics
- AI team summary, smart task assist, log verification (simulated delays, no real Gemini API required)
- Audit trail & activity feed

*Data lives in `lib/mock-data.ts` — edit there to change what reviewers see. Supabase/Gemini code paths remain in repo but are unused in this demo mode.*

---

## 📖 Overview

Traditional task management tools answer one question: *"What tasks exist?"*
Antigravity answers a much more important question: *"How do we know the work actually happened?"*

Modern teams lose countless hours chasing updates, verifying progress, reviewing vague work logs, and identifying blockers. Antigravity introduces an AI-powered accountability engine that:

- Verifies employee work logs
- Detects vague or low-quality updates
- Generates AI-powered management summaries
- Calculates accountability scores
- Maintains a complete audit trail
- Provides actionable team insights

The result is a transparent workplace where performance is measured by evidence rather than assumptions.

---

## ✨ Key Features

### 🤖 AI Work Log Verification
Employees submit work logs, and Antigravity analyzes: Relevance, Specificity, Evidence of work, Completion confidence, Deliverable quality.

**Example of Low Quality Log:**
> "Worked on the website today."
> **Result:** Trust Score: 22% (Confidence: Low. Reason: No measurable progress, no deliverables mentioned.)

**Example of High Quality Log:**
> "Fixed checkout API timeout issue. Implemented retry logic. Added tests and verified deployment."
> **Result:** Trust Score: 94% (Confidence: High.)

### 📊 Accountability Score Engine
Every employee receives a dynamic accountability score based on task completion rate, deadline adherence, AI trust score, work log quality, and consistency of updates.

### 🧠 AI Team Summary
Generate executive summaries instantly. AI analyzes tasks, work logs, deadlines, and performance trends to output risks, blockers, high performers, overdue tasks, and recommended actions.

### ✨ AI-Assisted Task Creation
Managers can create tasks faster using AI, which automatically generates priority level, suggested deadline, deliverables, and execution plan.

### 📝 Complete Audit Trail
Every critical action is tracked, including task creation, updates, assignments, work log submissions, status changes, and AI evaluations.

---

## 🏗 Architecture & Tech Stack

**Frontend:** Next.js 16 (RSC) · TypeScript · Tailwind CSS v4 · shadcn/ui · Recharts · Framer Motion
**Backend:** Supabase (Auth + PostgreSQL + RLS + Realtime)
**AI Layer:** Google Gemini 2.5 Flash
**Deployment:** Vercel

```text
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
```

---

## 🗄 Real Environment Setup (Beyond Demo)

**Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

**Database Setup**:
Run `supabase/schema.sql` inside the Supabase SQL Editor.
Optional: `supabase/seed.sql` to generate demo data.

**Demo Accounts (If DB is connected)**:
| Role | Email | Password |
|------|-------|----------|
| Manager | sarah.manager@antigravity.demo | demo1234 |
| Employee | alice.chen@antigravity.demo | demo1234 |

---

## 📊 Why Antigravity?

Task management tools track activity. **Antigravity verifies execution.**
Instead of asking: *“What tasks are assigned?”*, Managers can finally ask: *“What work can I trust?”*

## 🏆 Built For

Hackathons • Startups • Remote Teams • Agencies • Product Teams • Engineering Organizations

**LeapStart Hackathon** — Antigravity: make bluffing impossible.
