'use client'

import { AlertTriangle, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAI } from '@/hooks/useAI'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeamSummaryResult } from '@/types'
import { useState } from 'react'

interface AIInsightsPanelProps {
  initialSummary?: TeamSummaryResult | null
}

export function AIInsightsPanel({ initialSummary }: AIInsightsPanelProps) {
  const { generateTeamSummary, loading } = useAI()
  const [summary, setSummary] = useState<TeamSummaryResult | null>(initialSummary ?? null)

  async function handleGenerate() {
    try {
      const result = await generateTeamSummary()
      setSummary(result)
      toast.success('Team summary generated')
    } catch {
      toast.error('Failed to generate team summary')
    }
  }

  const healthColors = {
    green: 'bg-success/10 text-success border-success/20',
    yellow: 'bg-warning/10 text-warning border-warning/20',
    red: 'bg-danger/10 text-danger border-danger/20',
  }

  return (
    <Card className="border-border bg-surface">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-text-primary">
          <Sparkles className="size-5 text-accent" />
          AI Team Intelligence
        </CardTitle>
        <Button onClick={() => void handleGenerate()} disabled={loading} size="sm">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {!summary ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Sparkles className="size-10 text-accent/50" />
            <p className="text-sm text-text-secondary">
              Click Generate Summary for AI-powered team insights
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-text-primary">{summary.headline}</p>
              {summary.overall_team_health && (
                <Badge
                  variant="outline"
                  className={healthColors[summary.overall_team_health]}
                >
                  {summary.overall_team_health.toUpperCase()}
                </Badge>
              )}
            </div>

            {summary.high_performers.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-success">
                  <TrendingUp className="size-3" /> High Performers
                </p>
                {summary.high_performers.map((p) => (
                  <p key={p.employee_id} className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">{p.employee_name}</span>
                    {' — '}
                    {p.reason}
                  </p>
                ))}
              </div>
            )}

            {summary.risks.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-warning">
                  <AlertTriangle className="size-3" /> Risks
                </p>
                {summary.risks.slice(0, 3).map((r) => (
                  <p key={r.task_id} className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">{r.task_title}</span>
                    {' — '}
                    {r.reason}
                  </p>
                ))}
              </div>
            )}

            {summary.recommendations.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Recommendations
                </p>
                <ul className="flex flex-col gap-1">
                  {summary.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-text-secondary">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
