'use client'

import { motion } from 'framer-motion'
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WorkLog } from '@/types'

const verdictConfig = {
  genuine: {
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    label: 'Genuine',
    icon: ShieldCheck,
  },
  vague: {
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    label: 'Vague',
    icon: Shield,
  },
  suspicious: {
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    label: 'Suspicious',
    icon: ShieldAlert,
  },
}

interface TrustScoreCardProps {
  log: WorkLog
}

export function TrustScoreCard({ log }: TrustScoreCardProps) {
  const verdict = log.ai_verdict ?? 'vague'
  const config = verdictConfig[verdict]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('rounded-xl border p-5', config.bg, config.border)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn('size-5', config.color)} />
          <span className={cn('font-semibold', config.color)}>{config.label}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-primary">{log.trust_score ?? 0}</p>
          <p className="text-xs text-text-muted">Trust Score</p>
        </div>
      </div>
      <p className="mb-3 text-sm text-text-secondary">{log.ai_explanation}</p>
      {log.confidence && (
        <p className="text-xs text-text-muted">Confidence: {log.confidence}</p>
      )}
      {log.ai_flags && log.ai_flags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {log.ai_flags.map((flag, i) => (
            <span
              key={i}
              className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-text-secondary"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
