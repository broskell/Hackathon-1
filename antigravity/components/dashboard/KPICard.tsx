import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  icon: LucideIcon
  delta?: number
  deltaLabel?: string
  index?: number
}

export function KPICard({ label, value, icon: Icon, delta, deltaLabel, index = 0 }: KPICardProps) {
  const isPositive = delta !== undefined && delta >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-light"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        <div className="rounded-lg bg-accent-muted p-2">
          <Icon className="size-4 text-accent" />
        </div>
      </div>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            'mt-1 flex items-center gap-1 text-xs',
            isPositive ? 'text-success' : 'text-danger'
          )}
        >
          {isPositive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {deltaLabel ?? `${isPositive ? '+' : ''}${delta}% this week`}
        </p>
      )}
    </motion.div>
  )
}
