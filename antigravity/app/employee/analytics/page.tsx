'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AccountabilityScoreBadge } from '@/components/shared/AccountabilityScoreBadge'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEmployeeProfile, getWorkLogs } from '@/lib/mock-data'
import { formatDate } from '@/lib/format'
import type { Profile, WorkLog } from '@/types'

export default function EmployeeAnalyticsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      await new Promise((r) => setTimeout(r, 200))
      const p = getEmployeeProfile()
      setProfile(p)
      setLogs(getWorkLogs({ employee_id: p.id }))
      setLoading(false)
    })()
  }, [])

  const chartData = logs.map((log) => ({
    date: formatDate(log.created_at),
    score: log.trust_score ?? 0,
  }))

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
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
          <h2 className="text-2xl font-bold text-text-primary">Analytics</h2>
          <p className="text-sm text-text-secondary">Trust scores and accountability trends</p>
        </div>
        {profile && (
          <AccountabilityScoreBadge score={profile.accountability_score} size="lg" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Trust Score History</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">No logs yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#666" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="score" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-border bg-surface-2 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    Trust: {log.trust_score ?? '—'}
                  </span>
                  <span className="text-xs text-text-muted">{formatDate(log.created_at)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{log.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
