import { describe, it, expect } from 'vitest'
import promptEngine from '../services/promptEngine'

describe('promptEngine', () => {
  it('builds prompt with role and data', () => {
    const prompt = promptEngine.buildPrompt('audit_prompt', { role: 'Tester', data: { url: 'https://example.com' } })
    expect(prompt).toContain('ROLE:')
    expect(prompt).toContain('Tester')
    expect(prompt).toContain('"url": "https://example.com"')
  })
})
