import { NextResponse } from 'next/server'
import { LeadOrchestrator } from '@lead-ingest/leadOrchestrator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { organizationId, csvText, leadsList } = body

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'organizationId is required.' } },
        { status: 400 }
      )
    }

    if (!csvText && (!leadsList || !Array.isArray(leadsList))) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'csvText or leadsList array is required.' } },
        { status: 400 }
      )
    }

    const result = await LeadOrchestrator.importLeads({
      organizationId,
      csvText,
      leadsList,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lead import failed.'
    return NextResponse.json(
      { success: false, error: { code: 'IMPORT_FAILED', message } },
      { status: 500 }
    )
  }
}
