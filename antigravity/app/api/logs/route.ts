import { NextResponse } from 'next/server'
import { verifyWorkLog } from '@/lib/ai/verify-log'
import {
  calculateAccountabilityScore,
  confidenceToScore,
} from '@/lib/scoring/accountability'
import { createClient } from '@/lib/supabase/server'
import type { Task } from '@/types'

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
    const taskId = searchParams.get('task_id')

    let query = supabase
      .from('work_logs')
      .select('*, employee:profiles(*), task:tasks(*)')
      .order('created_at', { ascending: false })

    if (taskId) query = query.eq('task_id', taskId)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch logs'
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
      task_id: string
      content: string
      hours_worked?: number
    }

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', body.task_id)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const typedTask = task as Task
    let verification

    try {
      verification = await verifyWorkLog(
        typedTask.title,
        typedTask.description ?? '',
        body.content
      )
    } catch {
      verification = {
        trust_score: 50,
        confidence: 'Medium' as const,
        ai_verdict: 'vague' as const,
        ai_explanation: 'AI verification unavailable. Log saved for manual review.',
        ai_flags: ['AI service unavailable'],
      }
    }

    const { data: log, error } = await supabase
      .from('work_logs')
      .insert({
        task_id: body.task_id,
        employee_id: user.id,
        content: body.content,
        hours_worked: body.hours_worked ?? null,
        trust_score: verification.trust_score,
        confidence: verification.confidence,
        ai_explanation: verification.ai_explanation,
        ai_flags: verification.ai_flags,
        ai_verdict: verification.ai_verdict,
      })
      .select('*, employee:profiles(*)')
      .single()

    if (error) throw error

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'LOG_SUBMITTED',
      entity_type: 'work_log',
      entity_id: log.id,
      new_value: log as unknown as Record<string, unknown>,
    })

    if (typedTask.status === 'todo') {
      await supabase
        .from('tasks')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', body.task_id)
    }

    const { data: employeeTasks } = await supabase
      .from('tasks')
      .select('id, status, due_date')
      .eq('assigned_to', user.id)

    const { data: employeeLogs } = await supabase
      .from('work_logs')
      .select('trust_score, confidence, task_id')
      .eq('employee_id', user.id)

    const tasks = employeeTasks ?? []
    const logs = employeeLogs ?? []
    const now = new Date()

    const completedOnTime = tasks.filter(
      (t) => t.status === 'done' && (!t.due_date || new Date(t.due_date) >= now)
    ).length
    const overdueTasks = tasks.filter(
      (t) =>
        t.status !== 'done' && t.due_date && new Date(t.due_date) < now
    ).length
    const avgTrust =
      logs.length > 0
        ? logs.reduce((sum, l) => sum + (l.trust_score ?? 0), 0) / logs.length
        : 0
    const avgConfidence =
      logs.length > 0
        ? logs.reduce((sum, l) => sum + confidenceToScore(l.confidence), 0) / logs.length
        : 0
    const tasksWithLogs = new Set(logs.map((l) => l.task_id)).size

    const score = calculateAccountabilityScore({
      totalTasks: tasks.length,
      completedOnTime,
      overdueTasks,
      avgTrustScore: avgTrust,
      avgConfidenceScore: avgConfidence,
      logConsistencyRatio: tasks.length > 0 ? tasksWithLogs / tasks.length : 0,
    })

    await supabase.from('profiles').update({ accountability_score: score }).eq('id', user.id)

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit log'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
