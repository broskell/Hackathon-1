# Antigravity

**AI accountability for remote teams** — hackathon demo with static data. No login, no database, no API keys.

---

## Run it (30 seconds)

```bash
cd antigravity
npm install
npm run dev
```

Open **http://localhost:3000** → choose **Manager Portal** or **Employee Portal**.

That’s it.

---

## Demo flow (for judges)

1. **Manager Portal** → Dashboard (KPIs, charts, activity feed)  
2. **Tasks** → open a task → change status  
3. **Insights** → **Generate Team Summary** (mock AI)  
4. **Audit** → sample audit trail  
5. **Employee Portal** → **Tasks** → open **AI verification pipeline**  
6. Submit a work log (try vague text like “worked on stuff” vs detailed text)  
7. **Analytics** → trust score chart  

Use **Switch portal** in the header to go back to role selection.

---

## What’s included (all mock data)

- 3 employees, 5 tasks, work logs with AI trust scores  
- Manager dashboard, task management, employee roster  
- Employee tasks, work log form, analytics  
- AI team summary, smart task assist, log verification (simulated delays, no Gemini required)  
- Audit trail & activity feed  

Data lives in `lib/mock-data.ts` — edit there to change what reviewers see.

---

## Tech stack

Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Recharts · Framer Motion

*(Supabase/Gemini code paths remain in repo but are unused in demo mode.)*

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |

---

**LeapStart Hackathon** — Antigravity: make bluffing impossible.
