import { NextResponse } from 'next/server'
import { AIRouter } from '@auditai/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, overallScore, performanceScore, seoScore, accessibilityScore, securityScore, topIssues } = body

    if (!url || typeof overallScore !== 'number') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'URL and overallScore are required.' } },
        { status: 400 }
      )
    }

    const summary = await AIRouter.generateSummary({
      url,
      overallScore,
      performanceScore,
      seoScore,
      accessibilityScore,
      securityScore,
      topIssues,
    })

    return NextResponse.json({
      success: true,
      data: summary,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate AI summary.'
    return NextResponse.json(
      { success: false, error: { code: 'AI_SUMMARY_FAILED', message } },
      { status: 500 }
    )
  }
}
