import { describe, it, expect, vi, afterEach } from 'vitest'
import * as aiRouter from '../services/aiRouter'
import { runWithBestPractices } from '../services/aiBestPractices'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('aiBestPractices', () => {
  it('parses AI provider JSON and returns structured output', async () => {
    // Mock routeAI to return a predictable response
    vi.spyOn(aiRouter, 'routeAI').mockImplementation(async () => {
      const obj = { executive_summary: 'Test summary', recommendations: [{ problem: 'P', impact: 'I', priority: 'High', recommendation: 'Do X', effort_hours: 2 }] }
      return { choices: [{ message: { content: JSON.stringify(obj) } }] }
    })

    const res = await runWithBestPractices('audit_prompt', 'PROMPT', { measuredData: {} })
    expect(res.ok).toBe(true)
    expect(res.parsed).toBeDefined()
    expect(Array.isArray(res.parsed.recommendations)).toBe(true)
  })
})
