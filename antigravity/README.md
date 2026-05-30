# Antigravity

AI-powered accountability platform that makes bluffing impossible. Managers get instant clarity. Employees get fair, data-driven feedback. AI verifies every work log.

## Tech Stack

- **Next.js 16** (App Router, RSC)
- **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (Postgres, Auth, RLS, Realtime)
- **Google Gemini 2.5 Flash** (AI verification)
- **Framer Motion** + **Recharts**

## Quick Start

### 1. Install dependencies

```bash
cd antigravity
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy `.env.example` to `.env.local` and fill in your keys

### 3. Configure environment

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

### 4. Seed demo data (optional)

Create demo accounts via `/signup`:

| Role | Email | Password |
|------|-------|----------|
| Manager | sarah.manager@antigravity.demo | demo1234 |
| Employee | alice.chen@antigravity.demo | demo1234 |

Then run `supabase/seed.sql` in the SQL Editor.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Flow (2 min)

1. **Manager login** → Dashboard with KPIs + AI Insights
2. **Create task** → Use "AI Assist" to auto-fill priority/deliverables
3. **Employee login** → Submit work log → AI trust score appears
4. **Manager** → Generate Team Summary → Audit trail shows all actions

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## Project Structure

```
app/
  manager/          # Manager portal (/manager/*)
  employee/         # Employee portal (/employee/*)
  (auth)/           # Login & signup
  api/              # REST API + AI routes
components/         # UI components
lib/                # Supabase, AI, scoring
hooks/              # Client data hooks
types/              # TypeScript interfaces
supabase/           # Schema + seed SQL
```

## Features

- Role-based auth with middleware guards
- AI work log verification (trust score, verdict, flags)
- AI team summary generation
- AI-assisted task creation
- Accountability score engine
- Real-time audit log feed
- Full audit trail for managers
- Dark premium UI with animations
