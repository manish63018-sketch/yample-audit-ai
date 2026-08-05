import { routeAI } from './aiRouter'
import validator from './aiValidator'
import formatter from './aiFormatter'
import memory from './memoryLayer'

type BestPracticeOptions = {
  route?: string
  schema?: any
  measuredData?: any
}

export async function runWithBestPractices(promptName: string, prompt: string, options: BestPracticeOptions = {}) {
  // 1. Build and store prompt
  const promptRecord = { name: promptName, prompt, createdAt: new Date().toISOString() }
  const mem = memory.readMemory() || {}
  mem.lastPrompt = promptRecord
  memory.writeMemory(mem)

  // 2. Route to provider
  const route: any = (options.route as any) || 'default'
  const raw = await routeAI(route, prompt, {})

  // 3. Validate
  const rawText = raw?.choices?.[0]?.message?.content || raw?.completion || JSON.stringify(raw)
  const validation = validator.validateAIJson(rawText, options.schema)
  if (!validation.ok) return { ok: false, error: 'Validation failed', details: validation }

  // 4. Hallucination check
  const halluc = validator.detectHallucination(validation.parsed, options.measuredData)
  if (!halluc.ok) return { ok: false, error: 'Hallucination detected', details: halluc }

  // 5. Format
  const md = formatter.formatToMarkdown(validation.parsed.summary || 'No summary', validation.parsed.recommendations || [])

  // 6. Store audit trail
  mem.lastResponse = { raw, parsed: validation.parsed, md }
  memory.writeMemory(mem)

  return { ok: true, raw, parsed: validation.parsed, md }
}

export default { runWithBestPractices }
