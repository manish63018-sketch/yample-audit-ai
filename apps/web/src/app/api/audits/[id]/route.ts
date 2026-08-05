import { NextResponse } from 'next/server'
import { AuditRepository, ReportRepository, createAdminSupabaseClient } from '@auditai/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_ID', message: 'Audit ID is required.' } },
        { status: 400 }
      )
    }

    const adminClient = createAdminSupabaseClient()
    const auditRepo = new AuditRepository(adminClient)
    const reportRepo = new ReportRepository(adminClient)

    const audit = await auditRepo.findById(id)
    if (!audit) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Audit not found.' } },
        { status: 404 }
      )
    }

    const fullReports = await reportRepo.getFullAuditReport(id)

    return NextResponse.json({
      success: true,
      data: {
        audit,
        reports: fullReports,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch audit.'
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message } },
      { status: 500 }
    )
  }
}
