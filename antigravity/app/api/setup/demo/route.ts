import { NextResponse } from 'next/server'
import { DEMO_CREDENTIALS } from '@/lib/demo-credentials'

export async function POST() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json(
      {
        error:
          'Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API → service_role key), then restart the dev server.',
      },
      { status: 500 }
    )
  }

  const results: Array<{ email: string; status: string; error?: string }> = []

  for (const [key, demo] of Object.entries(DEMO_CREDENTIALS)) {
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: demo.email,
          password: demo.password,
          email_confirm: true,
          user_metadata: { full_name: demo.name, role: demo.role },
        }),
      })

      const body = (await res.json()) as { id?: string; msg?: string; message?: string }

      if (res.ok) {
        results.push({ email: demo.email, status: 'created' })
        continue
      }

      const message = body.msg ?? body.message ?? 'Unknown error'

      if (message.includes('already been registered') || message.includes('already exists')) {
        const listRes = await fetch(
          `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(demo.email)}`,
          {
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              apikey: serviceKey,
            },
          }
        )
        const listBody = (await listRes.json()) as { users?: Array<{ id: string }> }
        const userId = listBody.users?.[0]?.id

        if (userId) {
          await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              apikey: serviceKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              password: demo.password,
              email_confirm: true,
              user_metadata: { full_name: demo.name, role: demo.role },
            }),
          })
        }

        results.push({ email: demo.email, status: 'updated' })
      } else {
        results.push({ email: demo.email, status: 'failed', error: message })
      }
    } catch (err) {
      results.push({
        email: demo.email,
        status: 'failed',
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const failed = results.filter((r) => r.status === 'failed')
  if (failed.length === results.length) {
    return NextResponse.json({ error: 'Setup failed', results }, { status: 500 })
  }

  return NextResponse.json({
    message: 'Demo accounts ready. Use demo1234 to sign in.',
    results,
  })
}
