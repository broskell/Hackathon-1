export type UserRole = 'manager' | 'employee'

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'overdue'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type AIVerdict = 'genuine' | 'vague' | 'suspicious'
export type AIConfidence = 'High' | 'Medium' | 'Low'
export type TeamHealth = 'green' | 'yellow' | 'red'
export type Severity = 'low' | 'medium' | 'high'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url: string | null
  accountability_score: number
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_to: string | null
  created_by: string
  due_date: string | null
  deliverables: string[]
  suggested_plan: string | null
  ai_generated: boolean
  estimated_hours: number | null
  created_at: string
  updated_at: string
  assignee?: Profile
  creator?: Profile
}

export interface WorkLog {
  id: string
  task_id: string
  employee_id: string
  content: string
  hours_worked: number | null
  trust_score: number | null
  confidence: AIConfidence | null
  ai_explanation: string | null
  ai_flags: string[]
  ai_verdict: AIVerdict | null
  created_at: string
  employee?: Profile
  task?: Task
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  previous_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  created_at: string
  user?: Profile
}

export interface TeamSummary {
  id: string
  generated_by: string | null
  risks: TeamRisk[]
  blockers: TeamBlocker[]
  high_performers: TeamHighPerformer[]
  overdue_summary: OverdueSummary
  recommendations: string[]
  created_at: string
  overall_team_health?: TeamHealth
  headline?: string
}

export interface TeamRisk {
  task_id: string
  task_title: string
  reason: string
  severity: Severity
}

export interface TeamBlocker {
  employee_id: string
  employee_name: string
  issue: string
}

export interface TeamHighPerformer {
  employee_id: string
  employee_name: string
  reason: string
}

export interface OverdueSummary {
  count: number
  critical_tasks: string[]
}

export interface VerifyLogResult {
  trust_score: number
  confidence: AIConfidence
  ai_verdict: AIVerdict
  ai_explanation: string
  ai_flags: string[]
}

export interface SmartTaskResult {
  priority: TaskPriority
  suggested_due_days: number
  deliverables: string[]
  suggested_plan: string
  estimated_hours: number
}

export interface TeamSummaryResult {
  risks: TeamRisk[]
  blockers: TeamBlocker[]
  high_performers: TeamHighPerformer[]
  overdue_summary: OverdueSummary
  recommendations: string[]
  overall_team_health: TeamHealth
  headline: string
}

export interface ScoreInput {
  totalTasks: number
  completedOnTime: number
  overdueTasks: number
  avgTrustScore: number
  avgConfidenceScore: number
  logConsistencyRatio: number
}
