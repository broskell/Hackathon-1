import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'
import { formatDate } from '@/lib/format'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  href: string
  index?: number
}

export function TaskCard({ task, href, index = 0 }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={href}
        className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-light hover:bg-surface-2"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-semibold text-text-primary">{task.title}</h3>
          <TaskPriorityBadge priority={task.priority} />
        </div>
        {task.description && (
          <p className="mb-4 line-clamp-2 text-sm text-text-secondary">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <TaskStatusBadge status={task.status} />
          {task.due_date && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Calendar className="size-3" />
              {formatDate(task.due_date)}
            </span>
          )}
          {task.assignee && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <User className="size-3" />
              {task.assignee.full_name}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
