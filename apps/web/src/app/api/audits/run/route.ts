import { NextResponse } from 'next/server'
import { AuditOrchestrator } from '@modules/audit/auditOrchestrator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, businessCategory, country, businessGoal, websiteId, organizationId, options } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'A valid URL is required.' } },
        { status: 400 }
      )
    }

    // Ensure URL has protocol
    let formattedUrl = url.trim()
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`
    }

    // Execute audit orchestrator
    const result = await AuditOrchestrator.execute({
      url: formattedUrl,
      businessCategory,
      country,
      businessGoal,
      websiteId,
      organizationId,
      options,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: unknown) {
    console.error('Audit run error:', error)
    const message = error instanceof Error ? error.message : 'Audit execution failed.'
    return NextResponse.json(
      { success: false, error: { code: 'AUDIT_FAILED', message } },
      { status: 500 }
    )
  }
}
