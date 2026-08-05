import fetch from 'node-fetch'

export async function callClaude(prompt: string, options: any = {}) {
  const key = process.env.CLAUDE_API_KEY
  if (!key) throw new Error('CLAUDE_API_KEY not set')
  // Placeholder: Claude API endpoint and payload vary by provider/version
  const resp = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model: options.model || 'claude-2.1', max_tokens: options.max_tokens || 1000 })
  })
  const json = await resp.json()
  return json
}

export default { callClaude }
