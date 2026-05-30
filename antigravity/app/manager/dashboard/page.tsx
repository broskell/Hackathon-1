'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react'
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { EmployeeLeaderboard } from '@/components/dashboard/EmployeeLeaderboard'
import { KPICard } from '@/components/dashboard/KPICard'
import { OverdueAlertBanner } from '@/components/dashboard/OverdueAlertBanner'
import { TaskStatusPieChart } from '@/components/dashboard/TaskStatusPieChart'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmployees } from '@/hooks/useEmployees'
import { useTasks } from '@/hooks/useTasks'

export default function ManagerDashboardPage() {
  const { tasks, loading: tasksLoading } = useTasks()
  const { employees, loading: employeesLoading } = useEmployees()

  const doneCount = tasks.filter((t) => t.status === 'done').length
  const overdueCount = tasks.filter((t) => {
    if (!t.due_date || t.status === 'done') return false
    return new Date(t.due_date) < new Date()
  }).length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const avgScore =
    employees.length > 0
      ? Math.round(
          employees.reduce((sum, e) => sum + e.accountability_score, 0) / employees.length
        )
      : 0

  if (tasksLoading || employeesLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
        <p className="text-sm text-text-secondary">Team overview and AI intelligence</p>
      </div>

      <OverdueAlertBanner tasks={tasks} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total Tasks" value={tasks.length} icon={CheckCircle2} delta={12} index={0} />
        <KPICard label="In Progress" value={inProgress} icon={Clock} delta={8} index={1} />
        <KPICard label="Overdue" value={overdueCount} icon={AlertTriangle} delta={-5} index={2} />
        <KPICard label="Team Avg Score" value={avgScore} icon={Users} delta={3} index={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-surface lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-text-primary">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusPieChart tasks={tasks} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <p className="text-xs text-text-muted">Completed: {doneCount}</p>
              <p className="text-xs text-text-muted">Total: {tasks.length}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <AIInsightsPanel />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-text-primary">Employee Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeLeaderboard employees={employees} />
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-text-primary">Live Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
