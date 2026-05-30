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
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/format'
import type { Profile, WorkLog } from '@/types'

export default function EmployeeAnalyticsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, logsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('work_logs')
          .select('*')
          .eq('employee_id', user.id)
          .order('created_at', { ascending: true }),
      ])

      setProfile(profileRes.data as Profile)
      setLogs((logsRes.data ?? []) as WorkLog[])
      setLoading(false)
    }
    void load()
  }, [])

  const chartData = logs.map((log) => ({
    date: formatDate(log.created_at),
    score: log.trust_score ?? 0,
  }))

  const avgTrust =
    logs.length > 0
      ? Math.round(logs.reduce((sum, l) => sum + (l.trust_score ?? 0), 0) / logs.length)
      : 0

  const genuineCount = logs.filter((l) => l.ai_verdict === 'genuine').length

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
          <p className="text-sm text-text-secondary">Your performance over time</p>
        </div>
        {profile && (
          <AccountabilityScoreBadge score={profile.accountability_score} size="lg" />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-surface">
          <CardContent className="p-6">
            <p className="text-sm text-text-muted">Total Logs</p>
            <p className="text-3xl font-bold text-text-primary">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-surface">
          <CardContent className="p-6">
            <p className="text-sm text-text-muted">Avg Trust Score</p>
            <p className="text-3xl font-bold text-text-primary">{avgTrust}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-surface">
          <CardContent className="p-6">
            <p className="text-sm text-text-muted">Genuine Verdicts</p>
            <p className="text-3xl font-bold text-success">{genuineCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Trust Score Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="py-12 text-center text-sm text-text-muted">
              Submit work logs to see your trust score trend
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#525252" fontSize={12} />
                <YAxis stroke="#525252" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: '#111111',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
