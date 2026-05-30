import type { SmartTaskResult } from '@/types'
import { callGemini, parseGeminiJson } from './gemini'

export const SMART_TASK_PROMPT = (title: string, description: string) => `
You are an AI project manager. A manager has given you a brief task description. Generate a fully structured task breakdown.

TASK TITLE: ${title}
BRIEF DESCRIPTION: ${description}

Return ONLY valid JSON:
{
  "priority": "low" | "medium" | "high" | "critical",
  "suggested_due_days": <integer, days from today>,
  "deliverables": ["<concrete output 1>", "<concrete output 2>", "<concrete output 3>"],
  "suggested_plan": "<step-by-step plan in 4-5 sentences>",
  "estimated_hours": <number>
}
`

export async function suggestTaskMetadata(
  title: string,
  description: string
): Promise<SmartTaskResult> {
  const prompt = SMART_TASK_PROMPT(title, description)
  const text = await callGemini(prompt)
  return parseGeminiJson<SmartTaskResult>(text)
}
