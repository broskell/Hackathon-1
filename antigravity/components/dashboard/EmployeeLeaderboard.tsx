import Link from 'next/link'
import { motion } from 'framer-motion'
import { AccountabilityScoreBadge } from '@/components/shared/AccountabilityScoreBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'
import type { Profile } from '@/types'

interface EmployeeLeaderboardProps {
  employees: Profile[]
}

export function EmployeeLeaderboard({ employees }: EmployeeLeaderboardProps) {
  if (employees.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">No employees yet</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {employees.map((employee, index) => (
        <motion.div
          key={employee.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href="/manager/employees"
            className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-surface-2"
          >
            <span className="flex size-6 items-center justify-center text-xs font-bold text-text-muted">
              #{index + 1}
            </span>
            <Avatar className="size-9">
              <AvatarFallback className="bg-accent-muted text-accent text-xs">
                {getInitials(employee.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {employee.full_name}
              </p>
              <p className="truncate text-xs text-text-muted">{employee.email}</p>
            </div>
            <AccountabilityScoreBadge score={employee.accountability_score} size="sm" />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
