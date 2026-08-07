import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'

function generateOrderId() {
  const now = new Date()
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return `ORD-${yyyymm}-${rand}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const customerEmail = searchParams.get('email')
    const limit = Number(searchParams.get('limit')) || 20

    const adminClient = createAdminSupabaseClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (adminClient.from as any)('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (orderId) query = query.eq('order_number', orderId)
    if (customerEmail) query = query.eq('customer_email', customerEmail)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data: data || [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch orders'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      quoteId,
      customerEmail,
      customerName,
      customerPhone,
      businessName,
      items,
      subtotal,
      discountAmount,
      transferFee,
      totalAmount,
      currency,
      paymentMethod,
    } = body

    const orderNumber = generateOrderId()
    const adminClient = createAdminSupabaseClient()

    // 1. Create or lookup customer
    let customerId = null
    if (customerEmail) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: customerData } = await (adminClient.from as any)('customers')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (customerData?.id) {
        customerId = customerData.id
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newCustomer } = await (adminClient.from as any)('customers')
          .insert({
            name: customerName || 'Valued Client',
            email: customerEmail,
            phone: customerPhone || null,
            company_name: businessName || null,
          })
          .select('id')
          .single()
        customerId = newCustomer?.id || null
      }
    }

    // 2. Insert order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: orderData, error: orderErr } = await (adminClient.from as any)('orders')
      .insert({
        order_number: orderNumber,
        quote_id: quoteId || null,
        customer_id: customerId,
        customer_email: customerEmail || null,
        customer_name: customerName || 'Valued Client',
        subtotal_usd: subtotal || 0,
        discount_usd: discountAmount || 0,
        tax_usd: transferFee || 0,
        total_usd: totalAmount || 0,
        currency: currency || 'USD',
        status: paymentMethod === 'stripe' || paymentMethod === 'razorpay' ? 'paid' : 'submitted',
        payment_method: paymentMethod || 'proposal',
        line_items: items || [],
      })
      .select('*')
      .single()

    if (orderErr) {
      console.warn('[Orders API] Database insert notice:', orderErr)
    }

    // 3. Log activity in activity_timeline_logs
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from as any)('activity_timeline_logs').insert({
        entity_type: 'order',
        entity_id: orderNumber,
        title: `New Order Created (${orderNumber})`,
        description: `Order submitted for ${customerName || customerEmail} - Total: $${totalAmount}`,
        actor_name: customerName || 'System',
      })
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        orderId: orderNumber,
        quoteId: quoteId || null,
        status: orderData?.status || 'submitted',
        totalAmount,
        currency,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Order processing error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
