import { NextResponse } from 'next/server'
import { AuditOrchestrator } from '@modules/audit/auditOrchestrator'
import { AuditRepository, createAdminSupabaseClient } from '@auditai/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ID', message: 'Audit ID is required.' } },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const { url, businessCategory, country, businessGoal } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'URL is required.' } },
        { status: 400 }
      )
    }

    let formattedUrl = url.trim()
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`
    }

    const adminClient = createAdminSupabaseClient()
    const auditRepo = new AuditRepository(adminClient)

    // Helper to update status — silently fails if DB is unconfigured
    const updateStatus = async (status: string) => {
      try {
        await adminClient
          .from('audits')
          .update({ status } as never)
          .eq('id', id)
      } catch {
        // Silently continue in local dev
      }
    }

    // Mark as running
    await updateStatus('running')

    // Run the full audit orchestrator (it handles its own DB writes for reports)
    // We override the auditId so all sub-reports link to this pre-created record
    let result
    try {
      await updateStatus('crawling')

      result = await AuditOrchestrator.execute({
        url: formattedUrl,
        businessCategory: businessCategory || 'General Business',
        country: country || 'US',
        businessGoal: businessGoal || 'More Leads',
        // Pass the pre-created auditId so orchestrator uses it instead of creating new one
        _existingAuditId: id,
      } as never)

      // Store full result in a way the report page can access
      // We save it via the existing AI reports mechanism (orchestrator already saves sub-reports)
      // The result is also returned directly so the loading page can cache it in sessionStorage
    } catch (orchErr) {
      await updateStatus('failed')
      const message = orchErr instanceof Error ? orchErr.message : 'Audit execution failed.'
      return NextResponse.json(
        { success: false, error: { code: 'AUDIT_FAILED', message } },
        { status: 500 }
      )
    }

    // Ensure DB is marked as completed (orchestrator also does this, but double-check)
    try {
      await auditRepo.updateStatus(id, 'completed', result.scores?.overall ?? null, new Date().toISOString())
    } catch {
      // Continue cleanly
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        auditId: id, // Always use the pre-created ID
      },
    })
  } catch (error: unknown) {
    // Mark as failed in DB
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient
        .from('audits')
        .update({ status: 'failed' } as never)
        .eq('id', id)
    } catch {
      // Silently ignore
    }

    const message = error instanceof Error ? error.message : 'Audit processing failed.'
    return NextResponse.json(
      { success: false, error: { code: 'PROCESS_FAILED', message } },
      { status: 500 }
    )
  }
}
