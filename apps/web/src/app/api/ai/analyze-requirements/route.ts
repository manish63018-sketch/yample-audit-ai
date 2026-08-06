import { NextResponse } from 'next/server'

interface AnalyzeRequest {
  text: string
  language?: string
  budget?: number
  currency?: string
  services?: string[]
}

// Common non-English patterns → detected language hints
function detectLanguageHint(text: string): string {
  // Hindi/Devanagari
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'
  // Japanese
  if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return 'ja'
  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'
  // German keywords
  if (/\b(ich|sie|und|das|ist|ein|für|mit|auf|bei)\b/i.test(text)) return 'de'
  // French keywords
  if (/\b(je|vous|nous|les|des|est|pas|une|pour|avec|sur)\b/i.test(text)) return 'fr'
  // Spanish keywords
  if (/\b(yo|usted|nosotros|los|del|está|no|una|para|con|en)\b/i.test(text)) return 'es'
  return 'en'
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    }
  )

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequest = await request.json()
    const { text, language, budget = 0, currency = 'USD', services = [] } = body

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Text is too short.' } },
        { status: 400 }
      )
    }

    const detectedLang = language || detectLanguageHint(text)
    const isNonEnglish = !detectedLang.startsWith('en')

    // Build Gemini prompt
    const systemPrompt = `You are an expert web development project analyst for AuditAI by Yample Labs.
    
Analyze the following client requirement text and return a JSON response with this exact structure:
{
  "summary": ["item1", "item2", "item3"],
  "estimatedCostUSD": 1200,
  "budgetFit": "under" | "over" | "match",
  "recommendation": "Based on your requirements...",
  "translatedText": "English translation if non-English, else same as input",
  "detectedLanguage": "${detectedLang}"
}

Rules:
- summary: Extract 4-7 bullet points of what the client needs (website pages, features, integrations)
- estimatedCostUSD: Realistic USD estimate based on market rates ($599 base website, +$300 admin, +$500 AI chat, +$350 booking, etc.)
- budgetFit: "under" if client budget < estimate by >10%, "over" if client budget > estimate, "match" if within 10%
- recommendation: 1-2 sentences. If budget is too low, suggest phased approach. Be helpful, not discouraging.
- translatedText: If input is non-English, provide English translation. Otherwise return same text.
- ONLY return valid JSON, no markdown, no extra text.

Client Budget: ${currency === 'INR' ? `₹${budget}` : `$${budget} ${currency}`}
Pre-selected services: ${services.length > 0 ? services.join(', ') : 'None specified'}
Input language hint: ${detectedLang}

Client requirement text:
"${text}"`

    let analysisResult = {
      summary: ['Website development', 'Custom design', 'Mobile responsive'],
      estimatedCostUSD: 899,
      budgetFit: 'match' as 'under' | 'over' | 'match',
      recommendation: 'Based on your requirements, our standard Business Website package is a great fit.',
      translatedText: text,
      detectedLanguage: detectedLang,
    }

    try {
      const rawResponse = await callGemini(systemPrompt)
      // Clean response — remove markdown code blocks if present
      const cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleaned)

      // Validate and merge
      if (Array.isArray(parsed.summary) && parsed.summary.length > 0) {
        analysisResult = {
          summary: parsed.summary.slice(0, 8),
          estimatedCostUSD: Number(parsed.estimatedCostUSD) || 899,
          budgetFit: ['under', 'over', 'match'].includes(parsed.budgetFit)
            ? parsed.budgetFit
            : 'match',
          recommendation: parsed.recommendation || analysisResult.recommendation,
          translatedText: parsed.translatedText || text,
          detectedLanguage: parsed.detectedLanguage || detectedLang,
        }
      }
    } catch (aiErr) {
      console.error('Gemini AI analysis failed, using fallback:', aiErr)
      // Fallback: basic keyword extraction
      const keywords = text.toLowerCase()
      const summaryItems: string[] = []
      if (keywords.includes('website') || keywords.includes('site') || keywords.includes('साइट') || keywords.includes('وبسایت')) summaryItems.push('Professional website')
      if (keywords.includes('admin') || keywords.includes('dashboard') || keywords.includes('panel')) summaryItems.push('Admin dashboard')
      if (keywords.includes('chat') || keywords.includes('bot') || keywords.includes('ai')) summaryItems.push('AI chatbot integration')
      if (keywords.includes('book') || keywords.includes('appointment') || keywords.includes('schedule')) summaryItems.push('Booking system')
      if (keywords.includes('payment') || keywords.includes('pay') || keywords.includes('shop') || keywords.includes('store')) summaryItems.push('Payment gateway')
      if (keywords.includes('app') || keywords.includes('mobile') || keywords.includes('ios') || keywords.includes('android')) summaryItems.push('Mobile application')
      if (keywords.includes('seo') || keywords.includes('google') || keywords.includes('rank')) summaryItems.push('SEO optimization')
      if (summaryItems.length === 0) summaryItems.push('Custom web development', 'Professional design', 'Mobile responsive')
      analysisResult.summary = summaryItems
    }

    // Calculate budget fit
    const budgetInUSD = currency === 'INR' ? budget / 84 : budget
    const diff = budgetInUSD - analysisResult.estimatedCostUSD
    const pct = Math.abs(diff) / analysisResult.estimatedCostUSD
    if (pct <= 0.1) analysisResult.budgetFit = 'match'
    else if (diff < 0) analysisResult.budgetFit = 'under'
    else analysisResult.budgetFit = 'over'

    return NextResponse.json({
      success: true,
      data: {
        summary: analysisResult.summary,
        estimatedCost: analysisResult.estimatedCostUSD,
        budgetFit: analysisResult.budgetFit,
        recommendation: analysisResult.recommendation,
        translatedText: isNonEnglish ? analysisResult.translatedText : undefined,
        detectedLanguage: detectedLang,
        originalText: isNonEnglish ? text : undefined,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze requirements.'
    return NextResponse.json(
      { success: false, error: { code: 'ANALYSIS_FAILED', message } },
      { status: 500 }
    )
  }
}
