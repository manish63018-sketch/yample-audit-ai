import fetch from 'node-fetch'

export async function callOpenAI(prompt: string, options: any = {}) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY not set')
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: options.model || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: options.max_tokens || 1200 })
  })
  const json = await resp.json()
  return json
}

export default { callOpenAI }
