import { NextResponse } from 'next/server'
import { verifyWorkLog } from '@/lib/ai/verify-log'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as {
      taskTitle: string
      taskDescription: string
      logContent: string
    }

    const result = await verifyWorkLog(
      body.taskTitle,
      body.taskDescription ?? '',
      body.logContent
    )

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
