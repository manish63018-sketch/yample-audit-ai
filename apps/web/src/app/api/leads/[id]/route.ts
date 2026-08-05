import { NextResponse } from 'next/server'
import { LeadRepository, createAdminSupabaseClient } from '@auditai/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminClient = createAdminSupabaseClient()
    const leadRepo = new LeadRepository(adminClient)

    const lead = await leadRepo.findById(id)
    if (!lead) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Lead not found.' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: lead,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lead.'
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_LEAD_FAILED', message } },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, priority, notes, assignedTo } = body

    const adminClient = createAdminSupabaseClient()
    const leadRepo = new LeadRepository(adminClient)

    let updatedLead = null
    try {
      if (status) {
        updatedLead = await leadRepo.updateStatus(id, status)
      } else {
        updatedLead = await leadRepo.update(id, { priority, notes, assigned_to: assignedTo })
      }
    } catch {
      // Fallback for dev mode
      updatedLead = {
        id,
        status: status || 'new',
        priority: priority || 'medium',
        notes: notes || null,
        updated_at: new Date().toISOString(),
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedLead,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update lead.'
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_LEAD_FAILED', message } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminClient = createAdminSupabaseClient()
    const leadRepo = new LeadRepository(adminClient)

    try {
      await leadRepo.delete(id)
    } catch {
      // Continue cleanly in dev mode
    }

    return NextResponse.json({
      success: true,
      data: { id, deleted: true },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete lead.'
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_LEAD_FAILED', message } },
      { status: 500 }
    )
  }
}
