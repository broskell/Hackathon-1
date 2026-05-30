'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { AccountabilityScoreBadge } from '@/components/shared/AccountabilityScoreBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useEmployees } from '@/hooks/useEmployees'
import { getInitials } from '@/lib/format'

export default function ManagerEmployeesPage() {
  const { employees, loading } = useEmployees()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
        <h2 className="text-2xl font-bold text-text-primary">Employees</h2>
        <p className="text-sm text-text-secondary">Accountability scores and team performance</p>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees yet"
          description="Employees will appear here once they sign up."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-border bg-surface transition-colors hover:border-border-light">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-accent-muted text-accent">
                        {getInitials(employee.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text-primary">
                        {employee.full_name}
                      </p>
                      <p className="truncate text-xs text-text-muted">{employee.email}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Accountability Score</span>
                    <AccountabilityScoreBadge score={employee.accountability_score} size="sm" />
                  </div>
                  <Progress value={employee.accountability_score} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
