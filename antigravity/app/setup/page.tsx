'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Database, ExternalLink, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function SetupPage() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg">
        <Alert className="border-warning/30 bg-warning/10">
          <AlertCircle className="text-warning" />
          <AlertTitle className="text-lg text-text-primary">Database setup required</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-4 text-text-secondary">
            <p>
              You are signed in, but the <strong className="text-text-primary">profiles</strong>{' '}
              table is missing or not configured. Run the schema in Supabase before using the app.
            </p>

            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm">
              <li>
                Open{' '}
                <a
                  href="https://supabase.com/dashboard/project/nbgkafzkbtqxjiumnnyu/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  Supabase SQL Editor
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                Copy all SQL from{' '}
                <code className="rounded bg-surface-2 px-1">antigravity/supabase/schema.sql</code>{' '}
                in this project
              </li>
              <li>Paste into the editor and click <strong>Run</strong></li>
              <li>Return here and click Continue below</li>
            </ol>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <a
                  href="https://supabase.com/dashboard/project/nbgkafzkbtqxjiumnnyu/sql/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Database className="size-4" />
                  Open SQL Editor
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  router.push('/login')
                  router.refresh()
                }}
              >
                Continue to app
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => void handleSignOut()}>
              <LogOut className="size-4" />
              Sign out and use different account
            </Button>

            <p className="text-xs text-text-muted">
              After running the schema, use{' '}
              <Link href="/login" className="text-accent hover:underline">
                login
              </Link>{' '}
              and click <strong>Create Demo Accounts</strong> if you have not already.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
