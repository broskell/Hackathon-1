import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TaskPriority, TaskStatus } from '@/types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assignedTo = searchParams.get('assigned_to')
    const status = searchParams.get('status')

    let query = supabase
      .from('tasks')
      .select('*, assignee:profiles!tasks_assigned_to_fkey(*), creator:profiles!tasks_created_by_fkey(*)')
      .order('created_at', { ascending: false })

    if (assignedTo) query = query.eq('assigned_to', assignedTo)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

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
      title: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      assigned_to?: string
      due_date?: string
      deliverables?: string[]
      suggested_plan?: string
      ai_generated?: boolean
      estimated_hours?: number
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title: body.title,
        description: body.description ?? null,
        status: body.status ?? 'todo',
        priority: body.priority ?? 'medium',
        assigned_to: body.assigned_to ?? null,
        created_by: user.id,
        due_date: body.due_date ?? null,
        deliverables: body.deliverables ?? [],
        suggested_plan: body.suggested_plan ?? null,
        ai_generated: body.ai_generated ?? false,
        estimated_hours: body.estimated_hours ?? null,
      })
      .select('*, assignee:profiles!tasks_assigned_to_fkey(*)')
      .single()

    if (error) throw error

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'TASK_CREATED',
      entity_type: 'task',
      entity_id: task.id,
      new_value: task as unknown as Record<string, unknown>,
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
