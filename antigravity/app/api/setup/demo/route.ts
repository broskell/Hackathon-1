import { NextResponse } from 'next/server'
import { DEMO_CREDENTIALS } from '@/lib/demo-credentials'

async function upsertProfile(
  supabaseUrl: string,
  serviceKey: string,
  userId: string,
  demo: { email: string; name: string; role: string }
) {
  const res = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      id: userId,
      full_name: demo.name,
      email: demo.email,
      role: demo.role,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Profile upsert failed: ${text}`)
  }
}

export async function POST() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json(
      {
        error:
          'Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API → service_role secret), then restart npm run dev.',
      },
      { status: 500 }
    )
  }

  const results: Array<{ email: string; status: string; error?: string }> = []

  for (const demo of Object.values(DEMO_CREDENTIALS)) {
    try {
      let userId: string | undefined

      const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
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

      const createBody = (await createRes.json()) as {
        id?: string
        msg?: string
        message?: string
      }

      if (createRes.ok && createBody.id) {
        userId = createBody.id
        results.push({ email: demo.email, status: 'created' })
      } else {
        const message = createBody.msg ?? createBody.message ?? 'Unknown error'

        if (
          !message.includes('already been registered') &&
          !message.includes('already exists')
        ) {
          results.push({ email: demo.email, status: 'failed', error: message })
          continue
        }

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
        userId = listBody.users?.[0]?.id

        if (!userId) {
          results.push({ email: demo.email, status: 'failed', error: message })
          continue
        }

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

        results.push({ email: demo.email, status: 'updated' })
      }

      if (userId) {
        await upsertProfile(supabaseUrl, serviceKey, userId, demo)
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
    return NextResponse.json(
      {
        error: failed[0]?.error ?? 'Setup failed',
        results,
        hint: 'Also run supabase/FIX-TRIGGER.sql in SQL Editor.',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: 'Demo accounts ready. Sign in with demo1234.',
    results,
  })
}
