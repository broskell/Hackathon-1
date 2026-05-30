'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ClipboardList, Plus } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonTable } from '@/components/shared/SkeletonCard'
import { TaskCreateModal } from '@/components/tasks/TaskCreateModal'
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEmployees } from '@/hooks/useEmployees'
import { useTasks } from '@/hooks/useTasks'
import { formatDate } from '@/lib/format'

export default function ManagerTasksPage() {
  const { tasks, loading, refetch } = useTasks()
  const { employees } = useEmployees()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Tasks</h2>
          <p className="text-sm text-text-secondary">Manage and assign team tasks</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks yet"
          description="Create your first task to start tracking team accountability."
          actionLabel="Create Task"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="border-border">
                  <TableCell>
                    <Link
                      href={`/manager/tasks/${task.id}`}
                      className="font-medium text-text-primary hover:text-accent"
                    >
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <TaskPriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {task.assignee?.full_name ?? '—'}
                  </TableCell>
                  <TableCell className="text-text-muted">{formatDate(task.due_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TaskCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        employees={employees}
        onCreated={() => void refetch()}
      />
    </motion.div>
  )
}
