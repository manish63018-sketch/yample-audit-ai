import { NextResponse } from 'next/server'
import { AuditRepository, createAdminSupabaseClient } from '@auditai/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, businessCategory, country, businessGoal } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'A valid URL is required.' } },
        { status: 400 }
      )
    }

    // Normalize & Extract clean target domain
    let formattedUrl = url.trim()
    try {
      const full = /^https?:\/\//i.test(formattedUrl) ? formattedUrl : `https://${formattedUrl}`
      const parsed = new URL(full)
      const nested = parsed.searchParams.get('url')
      if (nested) {
        formattedUrl = /^https?:\/\//i.test(nested) ? nested : `https://${nested}`
      } else {
        formattedUrl = `${parsed.protocol}//${parsed.hostname}`
      }
    } catch {
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`
      }
    }

    // Validate URL format
    try {
      new URL(formattedUrl)
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'Please enter a valid website URL (e.g. yoursite.com).' } },
        { status: 400 }
      )
    }

    let auditId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    // Try to create a DB record immediately
    try {
      const adminClient = createAdminSupabaseClient()
      const auditRepo = new AuditRepository(adminClient)
      const audit = await auditRepo.create({
        website_id: null,
        organization_id: null,
        status: 'queued',
        started_at: new Date().toISOString(),
      })
      auditId = audit.id
    } catch {
      // Continue cleanly in local dev / when DB is unconfigured
    }

    return NextResponse.json({
      success: true,
      auditId,
      url: formattedUrl,
      meta: {
        businessCategory: businessCategory || 'General Business',
        country: country || 'US',
        businessGoal: businessGoal || 'More Leads',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to start audit.'
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message } },
      { status: 500 }
    )
  }
}
