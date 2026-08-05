import fetch from 'node-fetch'

export async function callGeminiVision(prompt: string, imageBuffer: Buffer, options: any = {}) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')
  // Placeholder: actual Gemini Vision API usage will differ; this is a stub
  return { ok: false, error: 'Gemini Vision adapter not implemented' }
}

export default { callGeminiVision }
