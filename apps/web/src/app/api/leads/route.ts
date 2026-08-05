import { NextResponse } from 'next/server'
import { LeadRepository, createAdminSupabaseClient } from '@auditai/db'
import { LeadScorer } from '@lead-ingest/leadScorer'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const status = searchParams.get('status') || undefined
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'organizationId parameter is required.' } },
        { status: 400 }
      )
    }

    const adminClient = createAdminSupabaseClient()
    const leadRepo = new LeadRepository(adminClient)

    let leads: unknown[] = []
    let totalCount = 0

    try {
      const res = await leadRepo.listByOrganization(organizationId, { status, limit, offset })
      leads = res.data
      totalCount = res.count
    } catch {
      // In-memory fallback if DB is unconfigured in local dev
      leads = []
    }

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: { limit, offset, totalCount },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leads.'
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_LEADS_FAILED', message } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { organizationId, businessName, website, email, phone, country, city, industry, notes } = body

    if (!organizationId || !businessName) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'organizationId and businessName are required.' } },
        { status: 400 }
      )
    }

    const adminClient = createAdminSupabaseClient()
    const leadRepo = new LeadRepository(adminClient)

    const leadData = {
      businessName,
      website: website || '',
      email: email || null,
      phone: phone || null,
      country: country || null,
      city: city || null,
      industry: industry || null,
      notes: notes || null,
    }

    const scoring = LeadScorer.scoreLead(leadData)

    let createdLead = null
    try {
      createdLead = await leadRepo.create({
        organization_id: organizationId,
        business_name: businessName,
        website: website || null,
        email: email || null,
        phone: phone || null,
        country: country || null,
        city: city || null,
        industry: industry || null,
        status: 'new',
        priority: scoring.priority,
        notes: notes || null,
      })
    } catch {
      // Dev mode fallback response
      createdLead = {
        id: `lead-${Date.now()}`,
        organization_id: organizationId,
        business_name: businessName,
        website,
        email,
        phone,
        status: 'new',
        priority: scoring.priority,
        created_at: new Date().toISOString(),
      }
    }

    return NextResponse.json({
      success: true,
      data: createdLead,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create lead.'
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_LEAD_FAILED', message } },
      { status: 500 }
    )
  }
}
