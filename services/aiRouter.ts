import openai from '../adapters/openaiAdapter'
import claude from '../adapters/claudeAdapter'
import gemini from '../adapters/geminiAdapter'

export type AIRoute = 'business' | 'vision' | 'code' | 'default'

export async function routeAI(route: AIRoute, prompt: string, options: any = {}) {
  switch (route) {
    case 'business':
      return claude.callClaude(prompt, options)
    case 'vision':
      return gemini.callGeminiVision(prompt, options.imageBuffer, options)
    case 'code':
      return openai.callOpenAI(prompt, { ...options, model: options.model || 'gpt-4o-mini' })
    default:
      return openai.callOpenAI(prompt, options)
  }
}

export default { routeAI }
