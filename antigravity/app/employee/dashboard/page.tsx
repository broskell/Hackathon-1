'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Target } from 'lucide-react'
import { AccountabilityScoreBadge } from '@/components/shared/AccountabilityScoreBadge'
import { KPICard } from '@/components/dashboard/KPICard'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { TaskCard } from '@/components/tasks/TaskCard'
import { getEmployeeProfile, getTasks } from '@/lib/mock-data'
import type { Profile, Task } from '@/types'

export default function EmployeeDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      await new Promise((r) => setTimeout(r, 200))
      const p = getEmployeeProfile()
      setProfile(p)
      setTasks(getTasks({ assigned_to: p.id }))
      setTasksLoading(false)
    })()
  }, [])

  const activeTasks = tasks.filter((t) => t.status !== 'done')
  const completedTasks = tasks.filter((t) => t.status === 'done')

  if (tasksLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Welcome back{profile ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h2>
          <p className="text-sm text-text-secondary">Your tasks and accountability score</p>
        </div>
        {profile && (
          <AccountabilityScoreBadge score={profile.accountability_score} size="lg" />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard label="Active Tasks" value={activeTasks.length} icon={Clock} index={0} />
        <KPICard label="Completed" value={completedTasks.length} icon={CheckCircle2} index={1} />
        <KPICard
          label="Accountability"
          value={profile?.accountability_score ?? 0}
          icon={Target}
          index={2}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Your tasks</h3>
          <Link href="/employee/tasks" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeTasks.slice(0, 4).map((task) => (
            <TaskCard key={task.id} task={task} href={`/employee/tasks/${task.id}`} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
