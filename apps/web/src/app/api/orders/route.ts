import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 })
    }

    const adminClient = createAdminSupabaseClient()

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: order } = await (adminClient.from as any)('orders')
        .select('*')
        .eq('order_number', id)
        .single()

      if (order) {
        return NextResponse.json({
          success: true,
          data: {
            orderId: order.order_number,
            quoteId: order.quote_id,
            customerId: order.customer_id,
            rewardId: order.reward_id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            customerPhone: order.customer_phone,
            orderStatus: order.status,
            paymentStatus: order.payment_status,
            items: order.line_items || [],
            createdAt: order.created_at,
          },
        })
      }
    } catch {}

    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Order fetch error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
