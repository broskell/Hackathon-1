import type { VerifyLogResult } from '@/types'
import { callGemini, parseGeminiJson } from './gemini'

export const VERIFY_LOG_PROMPT = (
  taskTitle: string,
  taskDescription: string,
  logContent: string
) => `
You are a strict AI accountability auditor. Your job is to evaluate whether this employee's work log reflects genuine, specific progress on the assigned task — or whether it is vague, irrelevant, or fabricated.

TASK TITLE: ${taskTitle}
TASK DESCRIPTION: ${taskDescription}

EMPLOYEE WORK LOG:
"${logContent}"

Evaluate on these 4 dimensions:
1. RELEVANCE — Does this log actually address the assigned task?
2. SPECIFICITY — Are concrete actions, files, outcomes, or blockers mentioned?
3. EVIDENCE — Is there measurable proof of work done?
4. COMPLETION CONFIDENCE — How likely is real progress happening?

Be strict. Vague logs like "worked on the task" or "made some progress" must score low.

Return ONLY valid JSON, no markdown, no explanation outside the JSON:
{
  "trust_score": <integer 0-100>,
  "confidence": "High" | "Medium" | "Low",
  "ai_verdict": "genuine" | "vague" | "suspicious",
  "ai_explanation": "<2-3 sentence honest assessment>",
  "ai_flags": ["<specific issue if any>"]
}
`

export async function verifyWorkLog(
  taskTitle: string,
  taskDescription: string,
  logContent: string
): Promise<VerifyLogResult> {
  const prompt = VERIFY_LOG_PROMPT(taskTitle, taskDescription, logContent)
  const text = await callGemini(prompt)
  return parseGeminiJson<VerifyLogResult>(text)
}
