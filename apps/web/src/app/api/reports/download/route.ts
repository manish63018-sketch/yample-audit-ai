import { NextResponse } from 'next/server'
import { ReportPDFGenerator } from '@pdf/reportPdfGenerator'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url') || 'https://example.com'
    const score = Number(searchParams.get('score')) || 74

    const html = ReportPDFGenerator.generateHTML({
      auditId: `report-${Date.now()}`,
      url,
      overallScore: score,
      performanceScore: score,
      seoScore: score + 1,
      accessibilityScore: score - 2,
      securityScore: score - 14,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    })

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'inline; filename="AuditAI-Sample-Report.html"',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate report.'
    return NextResponse.json({ success: false, error: { message } }, { status: 500 })
  }
}
