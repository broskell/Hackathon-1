'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogHistoryList } from '@/components/logs/LogHistoryList'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/format'
import { toast } from 'sonner'
import type { Task, TaskStatus, WorkLog } from '@/types'

export default function ManagerTaskDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [task, setTask] = useState<Task | null>(null)
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [taskRes, logsRes] = await Promise.all([
        supabase
          .from('tasks')
          .select('*, assignee:profiles!tasks_assigned_to_fkey(*)')
          .eq('id', id)
          .single(),
        fetch(`/api/logs?task_id=${id}`).then((r) => r.json()),
      ])
      setTask(taskRes.data as Task)
      setLogs(logsRes as WorkLog[])
      setLoading(false)
    }
    void load()
  }, [id])

  async function updateStatus(status: TaskStatus) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = (await res.json()) as Task
      setTask(updated)
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

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
        <div className="flex flex-wrap items-center gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
          {task.ai_generated && (
            <Badge variant="outline" className="border-accent/30 text-accent">
              AI Generated
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-surface lg:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-text-muted">Assignee</p>
              <p className="text-text-primary">{task.assignee?.full_name ?? 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-text-muted">Due Date</p>
              <p className="text-text-primary">{formatDate(task.due_date)}</p>
            </div>
            <div>
              <p className="text-text-muted">Status</p>
              <Select value={task.status} onValueChange={(v) => v && void updateStatus(v as TaskStatus)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
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
                <p className="text-text-muted">Plan</p>
                <p className="text-text-secondary">{task.suggested_plan}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface lg:col-span-2">
          <CardHeader>
            <CardTitle>Work Logs & AI Verdicts</CardTitle>
          </CardHeader>
          <CardContent>
            <LogHistoryList logs={logs} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
