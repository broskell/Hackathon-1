'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Task } from '@/types'

const COLORS = {
  todo: '#6366f1',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  done: '#22c55e',
  overdue: '#ef4444',
}

interface TaskStatusPieChartProps {
  tasks: Task[]
}

export function TaskStatusPieChart({ tasks }: TaskStatusPieChartProps) {
  const counts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const data = Object.entries(counts).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
    color: COLORS[name as keyof typeof COLORS] ?? '#6366f1',
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-muted">
        No task data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#111111',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            color: '#f5f5f5',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
