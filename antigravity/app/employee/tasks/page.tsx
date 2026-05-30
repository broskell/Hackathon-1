'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { TaskCard } from '@/components/tasks/TaskCard'
import { getEmployeeProfile, getTasks } from '@/lib/mock-data'
import type { Task } from '@/types'

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      await new Promise((r) => setTimeout(r, 200))
      const profile = getEmployeeProfile()
      setTasks(getTasks({ assigned_to: profile.id }))
      setLoading(false)
    })()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-text-primary">My Tasks</h2>
        <p className="text-sm text-text-secondary">All tasks assigned to you</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks assigned"
          description="Your manager will assign tasks here."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} href={`/employee/tasks/${task.id}`} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
