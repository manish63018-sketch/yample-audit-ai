import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const adminClient = createAdminSupabaseClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient.from as any)('quotes')
      .select('*')
      .or(`id.eq.${id},quote_id.eq.${id}`)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'QUOTE_NOT_FOUND', message: 'Quote not found.' } },
      { status: 404 }
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
    const { status } = body

    const adminClient = createAdminSupabaseClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient.from as any)('quotes')
      .update({ status })
      .or(`id.eq.${id},quote_id.eq.${id}`)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update quote.'
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_QUOTE_FAILED', message } },
      { status: 500 }
    )
  }
}
