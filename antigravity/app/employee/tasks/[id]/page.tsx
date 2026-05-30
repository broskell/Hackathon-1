'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogHistoryList } from '@/components/logs/LogHistoryList'
import { WorkLogForm } from '@/components/logs/WorkLogForm'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/format'
import type { Task, WorkLog } from '@/types'

export default function EmployeeTaskDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [task, setTask] = useState<Task | null>(null)
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(true)

  async function loadLogs() {
    const res = await fetch(`/api/logs?task_id=${id}`)
    const data = (await res.json()) as WorkLog[]
    setLogs(data)
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()
      setTask(data as Task)
      await loadLogs()
      setLoading(false)
    }
    void load()
  }, [id])

  if (loading) return <SkeletonCard />
  if (!task) return <p className="text-text-muted">Task not found</p>

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{task.title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Submit Work Log</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkLogForm
              taskId={id}
              onSubmitted={(log) => {
                setLogs((prev) => [log, ...prev])
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-text-muted">Due Date</p>
              <p className="text-text-primary">{formatDate(task.due_date)}</p>
            </div>
            {task.deliverables.length > 0 && (
              <div>
                <p className="mb-2 text-text-muted">Deliverables</p>
                <ul className="flex flex-col gap-1">
                  {task.deliverables.map((d, i) => (
                    <li key={i} className="text-text-secondary">• {d}</li>
                  ))}
                </ul>
              </div>
            )}
            {task.suggested_plan && (
              <div>
                <p className="text-text-muted">Suggested Plan</p>
                <p className="text-text-secondary">{task.suggested_plan}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <LogHistoryList logs={logs} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
