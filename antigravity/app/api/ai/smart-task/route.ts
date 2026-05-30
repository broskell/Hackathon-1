import { NextResponse } from 'next/server'
import { suggestTaskMetadata } from '@/lib/ai/smart-task'
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await request.json()) as { title: string; description: string }
    const result = await suggestTaskMetadata(body.title, body.description ?? '')

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Smart task failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
