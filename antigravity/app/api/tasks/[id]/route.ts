import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TaskPriority, TaskStatus } from '@/types'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as Partial<{
      title: string
      description: string
      status: TaskStatus
      priority: TaskPriority
      assigned_to: string | null
      due_date: string | null
    }>

    const { data: existing } = await supabase.from('tasks').select('*').eq('id', id).single()

    const { data: task, error } = await supabase
      .from('tasks')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, assignee:profiles!tasks_assigned_to_fkey(*)')
      .single()

    if (error) throw error

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'TASK_UPDATED',
      entity_type: 'task',
      entity_id: id,
      previous_value: existing as unknown as Record<string, unknown>,
      new_value: task as unknown as Record<string, unknown>,
    })

    return NextResponse.json(task)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existing } = await supabase.from('tasks').select('*').eq('id', id).single()

    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'TASK_DELETED',
      entity_type: 'task',
      entity_id: id,
      previous_value: existing as unknown as Record<string, unknown>,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
