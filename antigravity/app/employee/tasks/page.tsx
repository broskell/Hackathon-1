'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { TaskCard } from '@/components/tasks/TaskCard'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/types'

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('tasks')
        .select('*, assignee:profiles!tasks_assigned_to_fkey(*)')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false })
      setTasks((data ?? []) as Task[])
      setLoading(false)
    }
    void load()
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
          description="Your manager hasn't assigned any tasks yet."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task, i) => (
            <TaskCard key={task.id} task={task} href={`/employee/tasks/${task.id}`} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
