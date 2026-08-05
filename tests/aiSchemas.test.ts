import { describe, it, expect } from 'vitest'
import { AuditOutputSchema } from '../services/aiSchemas'

describe('AuditOutputSchema', () => {
  it('accepts valid audit output with recommendations', () => {
    const obj = {
      executive_summary: 'Summary',
      recommendations: [
        { problem: 'Slow images', impact: 'Performance', priority: 'High', recommendation: 'Compress images', effort_hours: 2 }
      ]
    }
    const res = AuditOutputSchema.safeParse(obj)
    expect(res.success).toBe(true)
  })

  it('rejects invalid recommendation missing fields', () => {
    const obj = { recommendations: [{ problem: 'X' }] }
    const res = AuditOutputSchema.safeParse(obj)
    expect(res.success).toBe(false)
  })
})
