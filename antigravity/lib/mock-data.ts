import type {
  AuditLog,
  Profile,
  SmartTaskResult,
  Task,
  TeamSummaryResult,
  VerifyLogResult,
  WorkLog,
} from '@/types'

const now = new Date()
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString()

export const MOCK_MANAGER: Profile = {
  id: 'mgr-001',
  full_name: 'Sarah Mitchell',
  email: 'sarah.manager@antigravity.demo',
  role: 'manager',
  avatar_url: null,
  accountability_score: 0,
  created_at: daysAgo(90),
}

export const MOCK_EMPLOYEES: Profile[] = [
  {
    id: 'emp-001',
    full_name: 'Alice Chen',
    email: 'alice.chen@antigravity.demo',
    role: 'employee',
    avatar_url: null,
    accountability_score: 87,
    created_at: daysAgo(60),
  },
  {
    id: 'emp-002',
    full_name: 'Marcus Rivera',
    email: 'marcus.rivera@antigravity.demo',
    role: 'employee',
    avatar_url: null,
    accountability_score: 72,
    created_at: daysAgo(45),
  },
  {
    id: 'emp-003',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@antigravity.demo',
    role: 'employee',
    avatar_url: null,
    accountability_score: 91,
    created_at: daysAgo(30),
  },
]

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-001',
    title: 'Ship Q2 analytics dashboard',
    description:
      'Build manager-facing charts for task completion, trust scores, and team health. Wire Recharts with mock API first, then real data.',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 'emp-001',
    created_by: 'mgr-001',
    due_date: daysAgo(-5),
    deliverables: ['Chart components', 'KPI cards', 'Export CSV'],
    suggested_plan: 'Week 1: layout + KPIs. Week 2: charts + polish.',
    ai_generated: true,
    estimated_hours: 24,
    created_at: daysAgo(14),
    updated_at: daysAgo(1),
    assignee: MOCK_EMPLOYEES[0],
    creator: MOCK_MANAGER,
  },
  {
    id: 'task-002',
    title: 'AI work-log verification pipeline',
    description:
      'Integrate Gemini to score logs: trust score, verdict, flags, and human-readable explanation.',
    status: 'review',
    priority: 'critical',
    assigned_to: 'emp-001',
    created_by: 'mgr-001',
    due_date: daysAgo(-2),
    deliverables: ['POST /verify endpoint', 'TrustScoreCard UI', 'Prompt tuning'],
    suggested_plan: null,
    ai_generated: false,
    estimated_hours: 16,
    created_at: daysAgo(21),
    updated_at: daysAgo(2),
    assignee: MOCK_EMPLOYEES[0],
    creator: MOCK_MANAGER,
  },
  {
    id: 'task-003',
    title: 'Employee onboarding flow',
    description: 'Document portal walkthrough and seed demo tasks for new hires.',
    status: 'todo',
    priority: 'medium',
    assigned_to: 'emp-002',
    created_by: 'mgr-001',
    due_date: daysAgo(-10),
    deliverables: ['README section', 'Loom video script'],
    suggested_plan: null,
    ai_generated: false,
    estimated_hours: 8,
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
    assignee: MOCK_EMPLOYEES[1],
    creator: MOCK_MANAGER,
  },
  {
    id: 'task-004',
    title: 'Audit trail & realtime feed',
    description: 'Log all mutations to audit_logs and show live activity on manager dashboard.',
    status: 'done',
    priority: 'high',
    assigned_to: 'emp-003',
    created_by: 'mgr-001',
    due_date: daysAgo(3),
    deliverables: ['audit_logs table', 'ActivityFeed component'],
    suggested_plan: null,
    ai_generated: true,
    estimated_hours: 12,
    created_at: daysAgo(28),
    updated_at: daysAgo(4),
    assignee: MOCK_EMPLOYEES[2],
    creator: MOCK_MANAGER,
  },
  {
    id: 'task-005',
    title: 'Fix mobile sidebar navigation',
    description: 'Collapsible nav on small screens; test iOS Safari.',
    status: 'overdue',
    priority: 'low',
    assigned_to: 'emp-002',
    created_by: 'mgr-001',
    due_date: daysAgo(5),
    deliverables: ['Responsive sidebar', 'Touch targets 44px'],
    suggested_plan: null,
    ai_generated: false,
    estimated_hours: 6,
    created_at: daysAgo(20),
    updated_at: daysAgo(6),
    assignee: MOCK_EMPLOYEES[1],
    creator: MOCK_MANAGER,
  },
]

export const MOCK_WORK_LOGS: WorkLog[] = [
  {
    id: 'log-001',
    task_id: 'task-001',
    employee_id: 'emp-001',
    content:
      'Implemented KPI grid and wired Recharts bar chart to static dataset. Fixed tooltip styling for dark mode.',
    hours_worked: 4.5,
    trust_score: 92,
    confidence: 'High',
    ai_explanation:
      'Specific deliverables mentioned with measurable UI outcomes. Matches task scope.',
    ai_flags: [],
    ai_verdict: 'genuine',
    created_at: daysAgo(1),
    employee: MOCK_EMPLOYEES[0],
    task: MOCK_TASKS[0],
  },
  {
    id: 'log-002',
    task_id: 'task-002',
    employee_id: 'emp-001',
    content: 'Worked on stuff. Made progress.',
    hours_worked: 2,
    trust_score: 34,
    confidence: 'High',
    ai_explanation:
      'Vague language with no concrete artifacts, file names, or outcomes. High risk of padding.',
    ai_flags: ['no_specifics', 'generic_phrasing'],
    ai_verdict: 'vague',
    created_at: daysAgo(2),
    employee: MOCK_EMPLOYEES[0],
    task: MOCK_TASKS[1],
  },
  {
    id: 'log-003',
    task_id: 'task-004',
    employee_id: 'emp-003',
    content:
      'Added Supabase realtime channel on audit_logs. Tested INSERT events in dev; ActivityFeed animates new rows.',
    hours_worked: 3,
    trust_score: 88,
    confidence: 'Medium',
    ai_explanation: 'Technical details align with completed task. Minor: no PR link cited.',
    ai_flags: [],
    ai_verdict: 'genuine',
    created_at: daysAgo(4),
    employee: MOCK_EMPLOYEES[2],
    task: MOCK_TASKS[3],
  },
]

export const MOCK_AUDIT_LOGS: (AuditLog & { user?: Profile })[] = [
  {
    id: 'audit-001',
    user_id: 'emp-001',
    action: 'work_log_submitted',
    entity_type: 'work_log',
    entity_id: 'log-001',
    previous_value: null,
    new_value: { trust_score: 92 },
    created_at: daysAgo(1),
    user: MOCK_EMPLOYEES[0],
  },
  {
    id: 'audit-002',
    user_id: 'mgr-001',
    action: 'task_created',
    entity_type: 'task',
    entity_id: 'task-001',
    previous_value: null,
    new_value: { title: 'Ship Q2 analytics dashboard' },
    created_at: daysAgo(14),
    user: MOCK_MANAGER,
  },
  {
    id: 'audit-003',
    user_id: 'mgr-001',
    action: 'team_summary_generated',
    entity_type: 'team_summary',
    entity_id: 'summary-001',
    previous_value: null,
    new_value: { headline: 'Team on track with one overdue item' },
    created_at: daysAgo(0),
    user: MOCK_MANAGER,
  },
  {
    id: 'audit-004',
    user_id: 'emp-001',
    action: 'work_log_submitted',
    entity_type: 'work_log',
    entity_id: 'log-002',
    previous_value: null,
    new_value: { trust_score: 34, ai_verdict: 'vague' },
    created_at: daysAgo(2),
    user: MOCK_EMPLOYEES[0],
  },
  {
    id: 'audit-005',
    user_id: 'mgr-001',
    action: 'task_status_updated',
    entity_type: 'task',
    entity_id: 'task-004',
    previous_value: { status: 'in_progress' },
    new_value: { status: 'done' },
    created_at: daysAgo(4),
    user: MOCK_MANAGER,
  },
]

export function getEmployees(): Profile[] {
  return [...MOCK_EMPLOYEES]
}

export function getTasks(filters?: { assigned_to?: string; status?: string }): Task[] {
  let list = [...MOCK_TASKS]
  if (filters?.assigned_to) {
    list = list.filter((t) => t.assigned_to === filters.assigned_to)
  }
  if (filters?.status) {
    list = list.filter((t) => t.status === filters.status)
  }
  return list
}

export function getTaskById(id: string): Task | undefined {
  return MOCK_TASKS.find((t) => t.id === id)
}

export function getWorkLogs(filters?: { task_id?: string; employee_id?: string }): WorkLog[] {
  let list = [...MOCK_WORK_LOGS]
  if (filters?.task_id) list = list.filter((l) => l.task_id === filters.task_id)
  if (filters?.employee_id) list = list.filter((l) => l.employee_id === filters.employee_id)
  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getAuditLogs(): (AuditLog & { user?: Profile })[] {
  return [...MOCK_AUDIT_LOGS]
}

export function getEmployeeProfile(): Profile {
  return MOCK_EMPLOYEES[0]
}

export const MOCK_VERIFY_LOG: VerifyLogResult = {
  trust_score: 78,
  confidence: 'Medium',
  ai_verdict: 'genuine',
  ai_explanation:
    'Log includes actionable detail. Consider citing PR links or file paths for higher confidence.',
  ai_flags: [],
}

export const MOCK_TEAM_SUMMARY: TeamSummaryResult & { id: string } = {
  id: 'summary-001',
  headline: 'Strong velocity with one overdue task and a vague log to review',
  overall_team_health: 'yellow',
  risks: [
    {
      task_id: 'task-005',
      task_title: 'Fix mobile sidebar navigation',
      reason: 'Overdue by 5 days; assigned to Marcus',
      severity: 'medium',
    },
  ],
  blockers: [
    {
      employee_id: 'emp-002',
      employee_name: 'Marcus Rivera',
      issue: 'Waiting on design tokens for mobile nav',
    },
  ],
  high_performers: [
    {
      employee_id: 'emp-003',
      employee_name: 'Priya Sharma',
      reason: 'Completed audit trail ahead of schedule; avg trust 88',
    },
  ],
  overdue_summary: { count: 1, critical_tasks: ['Fix mobile sidebar navigation'] },
  recommendations: [
    'Review Alice’s vague log on AI verification task',
    'Unblock Marcus on design tokens or reassign task-005',
    'Celebrate Priya’s audit trail delivery in standup',
  ],
}

export const MOCK_SMART_TASK: SmartTaskResult = {
  priority: 'high',
  suggested_due_days: 7,
  deliverables: ['Acceptance criteria doc', 'Implementation PR', 'Demo recording'],
  suggested_plan: 'Days 1–2: spec. Days 3–5: build. Day 6: QA. Day 7: demo.',
  estimated_hours: 20,
}

export function createMockWorkLog(
  taskId: string,
  content: string,
  hours?: number
): WorkLog {
  const task = getTaskById(taskId)
  const vague = content.length < 40 || /worked on stuff|made progress/i.test(content)
  return {
    id: `log-${Date.now()}`,
    task_id: taskId,
    employee_id: 'emp-001',
    content,
    hours_worked: hours ?? null,
    trust_score: vague ? 38 : 85,
    confidence: 'High',
    ai_explanation: vague
      ? 'Log lacks specific outcomes or artifacts.'
      : 'Detailed, task-aligned update with clear outcomes.',
    ai_flags: vague ? ['vague_phrasing'] : [],
    ai_verdict: vague ? 'vague' : 'genuine',
    created_at: new Date().toISOString(),
    employee: MOCK_EMPLOYEES[0],
    task,
  }
}
