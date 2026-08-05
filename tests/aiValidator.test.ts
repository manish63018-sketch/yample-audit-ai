import { describe, it, expect } from 'vitest'
import { validateAIJson } from '../services/aiValidator'

describe('aiValidator', () => {
  it('validates a correct JSON string', () => {
    const raw = JSON.stringify({ executive_summary: 'Ok', recommendations: [{ problem: 'A', impact: 'B', priority: 'Low', recommendation: 'Do X' }] })
    const res = validateAIJson(raw)
    expect(res.ok).toBe(true)
    expect(res.parsed).toBeDefined()
  })

  it('returns error for invalid JSON', () => {
    const raw = '{ invalid json '
    const res = validateAIJson(raw)
    expect(res.ok).toBe(false)
  })
})
