import type { Profile, Task, TeamSummaryResult, WorkLog } from '@/types'
import { callGemini, parseGeminiJson } from './gemini'

export const TEAM_SUMMARY_PROMPT = (
  tasks: Task[],
  employees: Profile[],
  logs: WorkLog[]
) => `
You are an AI Chief of Staff. A manager has just asked you for a full team briefing.

Here is the live team data:

TASKS (${tasks.length} total):
${JSON.stringify(tasks, null, 2)}

EMPLOYEES (${employees.length} total):
${JSON.stringify(employees, null, 2)}

RECENT WORK LOGS (last 50):
${JSON.stringify(logs, null, 2)}

Generate a complete, honest, actionable team intelligence report.

Return ONLY valid JSON:
{
  "risks": [{ "task_id": "<uuid>", "task_title": "<str>", "reason": "<str>", "severity": "low" | "medium" | "high" }],
  "blockers": [{ "employee_id": "<uuid>", "employee_name": "<str>", "issue": "<str>" }],
  "high_performers": [{ "employee_id": "<uuid>", "employee_name": "<str>", "reason": "<str>" }],
  "overdue_summary": { "count": <int>, "critical_tasks": ["<title>"] },
  "recommendations": ["<specific action 1>", "<specific action 2>", "<specific action 3>"],
  "overall_team_health": "green" | "yellow" | "red",
  "headline": "<one sentence executive summary>"
}
`

export async function generateTeamSummary(
  tasks: Task[],
  employees: Profile[],
  logs: WorkLog[]
): Promise<TeamSummaryResult> {
  const prompt = TEAM_SUMMARY_PROMPT(tasks, employees, logs)
  const text = await callGemini(prompt)
  return parseGeminiJson<TeamSummaryResult>(text)
}
