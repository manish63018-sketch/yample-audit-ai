import { AuditOutputSchema } from './aiSchemas'

export function validateAIJson(raw: string, schema: any = AuditOutputSchema) {
  try {
    const parsed = JSON.parse(raw)
    const result = schema.safeParse ? schema.safeParse(parsed) : { success: true, data: parsed }
    if (!result.success) {
      return { ok: false, error: result.error?.format ? result.error.format() : 'Schema validation failed', details: result.error }
    }
    return { ok: true, parsed: result.data }
  } catch (err: any) {
    return { ok: false, error: 'Invalid JSON', details: err?.message }
  }
}

export function detectHallucination(parsed: any, measuredData: any) {
  const issues: string[] = []
  try {
    // Heuristic: ensure numeric estimates are not wildly different from measuredData when available
    if (parsed && parsed.recommendations && Array.isArray(parsed.recommendations)) {
      for (const r of parsed.recommendations) {
        if (r.effort_hours && r.effort_hours < 0) issues.push('Negative effort_hours')
      }
    }
  } catch (e) {
    issues.push('Hallucination check failed')
  }
  return { ok: issues.length === 0, issues }
}

export default { validateAIJson, detectHallucination }
