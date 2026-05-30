# Antigravity

**AI accountability for remote teams — work logs verified, managers never flying blind.**

Built for **LeapStart Hackathon**. Antigravity is a dual-portal platform where employees submit proof-of-work, **Gemini** scores trust and flags bluffing patterns, and managers get live dashboards, AI team summaries, and a full audit trail.

---

## Why it exists

Remote work broke the “I saw you at your desk” signal. Managers guess. Employees feel judged unfairly. Antigravity replaces vibes with **structured tasks, verified logs, and explainable AI scores** — so feedback is data-backed, not political.

---

## Demo in 60 seconds (for judges)

1. Open the app → **Sign in**
2. Click **Fill Manager Demo** → Sign in  
3. **Manager** → Dashboard → **Insights** → generate a team summary  
4. Sign out → **Fill Employee Demo** → Sign in  
5. **Employee** → open a task → submit a work log → see **AI trust score + verdict**  
6. Back as manager → **Audit** → every action is logged in real time  

No slide deck required — the product tells the story.

---

## Demo accounts

| Role | Email | Password |
|------|--------|----------|
| **Manager** | `sarah.manager@antigravity.demo` | `demo1234` |
| **Employee** | `alice.chen@antigravity.demo` | `demo1234` |

On first run, use **Create Demo Accounts** on the login page (needs `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`), or create these users in Supabase Auth and run `supabase/FIX-PROFILE-ACCESS.sql`.

---

## Features

| Area | What you get |
|------|----------------|
| **Manager portal** | KPI dashboard, task CRUD, employee roster, AI insights, audit trail |
| **Employee portal** | Assigned tasks, work log submission, personal analytics |
| **AI verification** | Trust score, verdict, risk flags on every log (Gemini 2.5 Flash) |
| **AI assist** | Task priority & deliverables suggested from a short description |
| **Team summaries** | One-click AI digest: risks, blockers, top performers |
| **Accountability engine** | Composite scores from completion, timeliness, and AI trust |
| **Security** | Supabase Auth, RLS on all tables, role-based middleware |
| **UX** | Dark premium UI, Framer Motion, Recharts, shadcn/ui |

---

## Tech stack

- **Next.js 16** — App Router, Server Components, API routes  
- **TypeScript** — strict, end-to-end types  
- **Tailwind CSS v4** + **shadcn/ui**  
- **Supabase** — Postgres, Auth, RLS, Realtime  
- **Google Gemini** — work-log verification & manager insights  
- **Recharts** + **Framer Motion**

---

## Quick start

### Prerequisites

- Node.js 20+  
- A [Supabase](https://supabase.com) project  
- A [Google AI Studio](https://aistudio.google.com/apikey) API key (Gemini)

### 1. Clone & install

```bash
cd antigravity
npm install
```

### 2. Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_or_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get keys from **Supabase → Project Settings → API** (`service_role` is secret — never commit it).

### 3. Database

In **Supabase → SQL Editor**, run in order:

1. `supabase/schema.sql` — tables, RLS, triggers  
2. `supabase/FIX-TRIGGER.sql` — if signup says “Database error saving new user”  
3. `supabase/FIX-PROFILE-ACCESS.sql` — if login says profile not found  

Optional: `supabase/seed.sql` for sample tasks.

### 4. Run

```bash
npm run dev
```

Open **http://localhost:3000** → login → **Create Demo Accounts** → sign in.

### 5. Production build

```bash
npm run build
npm start
```

---

## Deploy (Vercel)

1. Push this repo to GitHub  
2. [Import on Vercel](https://vercel.com/new) — root directory: `antigravity`  
3. Add the same env vars as `.env.local`  
4. Redeploy after adding secrets  

Set **Auth redirect URLs** in Supabase to your production domain (`https://your-app.vercel.app/**`).

---

## Project structure

```
antigravity/
├── app/
│   ├── (auth)/          # Login & signup
│   ├── manager/         # Manager portal
│   ├── employee/        # Employee portal
│   └── api/             # REST + AI routes
├── components/          # UI + shared
├── lib/
│   ├── supabase/        # Client, middleware, profiles
│   └── ai/              # Gemini prompts & scoring
├── hooks/               # Data fetching
├── types/               # Shared TypeScript types
└── supabase/            # SQL schema & fixes
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| “URL and Key required” | Add `NEXT_PUBLIC_SUPABASE_*` to `.env.local`, restart dev server |
| “Database error saving new user” | Run `supabase/FIX-TRIGGER.sql` |
| “Profile not found” | Run `supabase/FIX-PROFILE-ACCESS.sql`; ensure `profiles.id` = `auth.users.id` |
| Create Demo Accounts fails | Set `SUPABASE_SERVICE_ROLE_KEY`, restart `npm run dev` |
| Redirect loop | Run full `schema.sql`; confirm user has a `profiles` row |
| AI routes 500 | Set `GEMINI_API_KEY` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |

---

## License

MIT — hackathon submission, use and adapt freely.

---

**Antigravity** — because accountability shouldn’t depend on gravity (or guesswork).
