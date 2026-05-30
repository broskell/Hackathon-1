'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { AlertCircle, BarChart3, ExternalLink, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage, normalizeAuthEmail } from '@/lib/auth-errors'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { DEMO_CREDENTIALS } from '@/lib/demo-credentials'
import { PasswordInput } from '@/components/shared/PasswordInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupDone, setSetupDone] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('error') === 'schema') {
      toast.error('Database not set up. Run supabase/schema.sql in Supabase SQL Editor.')
    }
  }, [searchParams])

  function fillDemo(role: 'manager' | 'employee') {
    const demo = DEMO_CREDENTIALS[role]
    setEmail(demo.email)
    setPassword(demo.password)
  }

  async function setupDemoAccounts() {
    setSetupLoading(true)
    setSetupError(null)
    try {
      const res = await fetch('/api/setup/demo', { method: 'POST' })
      const data = (await res.json()) as { message?: string; error?: string }

      if (res.ok) {
        setSetupDone(true)
        toast.success(data.message ?? 'Demo accounts created! Sign in now.')
        return
      }

      // Do not fall back to client signUp — it hits the auth trigger and shows
      // "Database error saving new user" when profiles insert fails.
      throw new Error(
        data.error ??
          'Setup failed. Add SUPABASE_SERVICE_ROLE_KEY to .env.local, run supabase/FIX-TRIGGER.sql in SQL Editor, restart npm run dev, then try again.'
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Setup failed'
      setSetupError(message)
      toast.error(message)
    } finally {
      setSetupLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const normalizedEmail = normalizeAuthEmail(email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })
      if (error) throw new Error(getAuthErrorMessage(error, 'login'))

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Sign-in succeeded but session was not created. Try again.')
      }

      const profile = await ensureProfile(supabase, data.user)

      toast.success('Welcome back!')
      router.push(`/${profile.role}/dashboard`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

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
            AI-verified work logs. Real-time accountability scores. Full audit trail.
            Managers get clarity. Employees get fair feedback.
          </p>
        </div>
        <p className="text-xs text-text-muted">© 2026 Antigravity</p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-1 flex-col items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                <BarChart3 className="size-4 text-white" />
              </div>
              <span className="font-bold">Antigravity</span>
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-text-primary">Sign in</h2>
          <p className="mb-4 text-sm text-text-secondary">
            Enter your credentials to access your portal
          </p>

          {!setupDone && (
            <Alert className="mb-6 border-warning/30 bg-warning/10">
              <AlertCircle className="text-warning" />
              <AlertTitle className="text-text-primary">One-time setup required</AlertTitle>
              <AlertDescription className="text-text-secondary">
                Demo logins fail until accounts exist. Click{' '}
                <strong className="text-text-primary">Create Demo Accounts</strong> below first.
              </AlertDescription>
            </Alert>
          )}

          {setupError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle />
              <AlertTitle>Setup blocked</AlertTitle>
              <AlertDescription className="flex flex-col gap-2 text-sm">
                <span>{setupError}</span>
                <span>
                  1. Open{' '}
                  <a
                    href="https://supabase.com/dashboard/project/nbgkafzkbtqxjiumnnyu/settings/api"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    Supabase API settings
                    <ExternalLink className="size-3" />
                  </a>
                </span>
                <span>
                  2. Copy the <strong>service_role</strong> secret key into{' '}
                  <code className="rounded bg-surface-2 px-1">.env.local</code> as{' '}
                  <code className="rounded bg-surface-2 px-1">SUPABASE_SERVICE_ROLE_KEY</code>
                </span>
                <span>3. Restart <code className="rounded bg-surface-2 px-1">npm run dev</code></span>
                <span>4. Click Create Demo Accounts again, then Sign in</span>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-surface-2 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
              Demo credentials
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-text-primary">Manager</p>
                  <p className="text-xs text-text-secondary">{DEMO_CREDENTIALS.manager.email}</p>
                  <p className="text-xs text-text-muted">Password: {DEMO_CREDENTIALS.manager.password}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('manager')}>
                  Use
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <div>
                  <p className="font-medium text-text-primary">Employee</p>
                  <p className="text-xs text-text-secondary">{DEMO_CREDENTIALS.employee.email}</p>
                  <p className="text-xs text-text-muted">Password: {DEMO_CREDENTIALS.employee.password}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('employee')}>
                  Use
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              Accounts don&apos;t exist yet? Click the button below once.
            </p>
            <Button
              type="button"
              variant={setupDone ? 'outline' : 'default'}
              className="mt-3 w-full"
              onClick={() => void setupDemoAccounts()}
              disabled={setupLoading}
            >
              {setupLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating demo accounts...
                </>
              ) : setupDone ? (
                'Recreate Demo Accounts'
              ) : (
                'Create Demo Accounts'
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            No account?{' '}
            <Link href="/signup" className="font-medium text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
