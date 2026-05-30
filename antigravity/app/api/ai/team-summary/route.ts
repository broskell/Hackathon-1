import { NextResponse } from 'next/server'
import { generateTeamSummary } from '@/lib/ai/team-summary'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Task, WorkLog } from '@/types'

export async function POST() {
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

    const [tasksRes, employeesRes, logsRes] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('role', 'employee'),
      supabase
        .from('work_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

    const tasks = (tasksRes.data ?? []) as Task[]
    const employees = (employeesRes.data ?? []) as Profile[]
    const logs = (logsRes.data ?? []) as WorkLog[]

    const summary = await generateTeamSummary(tasks, employees, logs)

    const { data: saved, error } = await supabase
      .from('team_summaries')
      .insert({
        generated_by: user.id,
        risks: summary.risks,
        blockers: summary.blockers,
        high_performers: summary.high_performers,
        overdue_summary: summary.overdue_summary,
        recommendations: summary.recommendations,
      })
      .select()
      .single()

    if (error) throw error

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'TEAM_SUMMARY_GENERATED',
      entity_type: 'team_summary',
      entity_id: saved.id,
      new_value: summary as unknown as Record<string, unknown>,
    })

    return NextResponse.json({ ...summary, id: saved.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Summary generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
