'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, Briefcase, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-surface p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
            <BarChart3 className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">Antigravity</span>
        </div>
        <div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-text-primary">
            Make bluffing
            <br />
            <span className="text-accent">impossible.</span>
          </h1>
          <p className="max-w-md text-text-secondary">
            AI-verified work logs. Accountability scores. Full audit trail — hackathon demo
            with sample data, no sign-up required.
          </p>
        </div>
        <p className="text-xs text-text-muted">© 2026 Antigravity · LeapStart Hackathon</p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-1 flex-col items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                <BarChart3 className="size-4 text-white" />
              </div>
              <span className="font-bold">Antigravity</span>
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-text-primary">Choose your portal</h2>
          <p className="mb-8 text-sm text-text-secondary">
            Pick a role to explore the demo. All data is static — no database or login.
          </p>

          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="h-auto flex-col items-start gap-2 px-6 py-5 text-left"
              onClick={() => router.push('/manager/dashboard')}
            >
              <span className="flex items-center gap-2 text-base font-semibold">
                <Briefcase className="size-5" />
                Manager Portal
              </span>
              <span className="text-xs font-normal opacity-90">
                Dashboards, tasks, AI insights, audit trail — Sarah Mitchell
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-auto flex-col items-start gap-2 px-6 py-5 text-left"
              onClick={() => router.push('/employee/dashboard')}
            >
              <span className="flex items-center gap-2 text-base font-semibold">
                <UserCircle className="size-5" />
                Employee Portal
              </span>
              <span className="text-xs font-normal text-text-secondary">
                Tasks, work logs, AI trust scores — Alice Chen
              </span>
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-text-muted">
            <Link href="/manager/insights" className="text-accent hover:underline">
              Skip to AI insights
            </Link>
            {' · '}
            <Link href="/manager/audit" className="text-accent hover:underline">
              Audit trail
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
