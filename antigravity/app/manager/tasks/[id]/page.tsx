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
import { getTaskById, getWorkLogs } from '@/lib/mock-data'
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
    void (async () => {
      await new Promise((r) => setTimeout(r, 200))
      setTask(getTaskById(id) ?? null)
      setLogs(getWorkLogs({ task_id: id }))
      setLoading(false)
    })()
  }, [id])

  function updateStatus(status: TaskStatus) {
    if (!task) return
    setTask({ ...task, status })
    toast.success('Status updated (demo)')
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
              AI-assisted
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-text-muted">Assignee</p>
              <p className="font-medium text-text-primary">
                {task.assignee?.full_name ?? 'Unassigned'}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Due date</p>
              <p className="font-medium text-text-primary">
                {task.due_date ? formatDate(task.due_date) : '—'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-text-muted">Status</p>
              <Select value={task.status} onValueChange={(v) => updateStatus(v as TaskStatus)}>
                <SelectTrigger className="w-40">
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
                <ul className="list-inside list-disc text-text-secondary">
                  {task.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Work Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <LogHistoryList logs={logs} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
