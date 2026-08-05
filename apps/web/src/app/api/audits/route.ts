import { NextResponse } from 'next/server'
import { AuditRepository, createAdminSupabaseClient } from '@auditai/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const websiteId = searchParams.get('websiteId')

    const adminClient = createAdminSupabaseClient()
    const auditRepo = new AuditRepository(adminClient)

    let audits: unknown[] = []

    if (websiteId) {
      audits = await auditRepo.listByWebsite(websiteId)
    } else if (organizationId) {
      audits = await auditRepo.listByOrganization(organizationId)
    } else {
      // Default to empty array if no org or website specified
      audits = []
    }

    return NextResponse.json({
      success: true,
      data: audits,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to list audits.'
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message } },
      { status: 500 }
    )
  }
}
