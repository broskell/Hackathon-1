'use client'

import { motion } from 'framer-motion'
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel'

export default function ManagerInsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-text-primary">AI Insights</h2>
        <p className="text-sm text-text-secondary">
          Full team intelligence powered by Gemini
        </p>
      </div>
      <AIInsightsPanel />
    </motion.div>
  )
}
