import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'
import { calculateOrderSummary, SupportedCurrency, formatCurrencyPrice } from '@/lib/pricing'
import { sendWhatsAppEnquiry } from '@/lib/whatsapp'

function generateId(prefix: string) {
  const rand = String(Math.floor(Math.random() * 90000000) + 10000000)
  return `YPL-${prefix}-${rand}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      country,
      address,
      websiteUrl,
      business,
      requirements,
      timeline,
      budget,
      voiceNotes,
      referenceLinks,
      items,
      discount = 0,
      currency = 'USD',
      paymentMethod = 'proposal',
      paymentStatus = 'Unpaid',
      orderStatus = 'Quote Requested',
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Full Name and Email Address are required to generate order records.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const adminClient = createAdminSupabaseClient()

    // 1. Check or Reuse Existing Customer Account ID
    let customerId = generateId('CUST')
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingCustomer } = await (adminClient.from as any)('customers')
        .select('id')
        .eq('email', cleanEmail)
        .single()

      if (existingCustomer?.id) {
        customerId = existingCustomer.id
      }
    } catch {
      // New customer ID used
    }

    const quoteId = generateId('QT')
    const orderId = generateId('ORD')

    const isIndia = country === 'India' || country === 'IN' || currency === 'INR'
    const activeCurrency: SupportedCurrency = (currency as SupportedCurrency) || (isIndia ? 'INR' : 'USD')

    // Calculate authoritative pricing summary
    const calcSummary = calculateOrderSummary(items || [], activeCurrency, discount, isIndia)

    // Extract reward item if present
    const rewardItem = (items || []).find((i: any) => i.isReward)
    const rewardId = rewardItem?.rewardId || rewardItem?.id || null

    // 2. Save / Upsert Customer Profile in Supabase
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from as any)('customers').upsert(
        {
          id: customerId,
          email: cleanEmail,
          name,
          phone: phone || null,
          country: country || null,
          address: address || null,
          company_name: business || null,
          website_url: websiteUrl || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
    } catch (e) {
      console.warn('[Checkout Submit] Customer upsert warning:', e)
    }

    // 3. Update Reward Status in Supabase
    if (rewardId) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminClient.from as any)('rewards')
          .update({
            customer_id: customerId,
            status: 'Applied to Order',
          })
          .eq('id', rewardId)
      } catch (e) {
        console.warn('[Checkout Submit] Reward status update warning:', e)
      }
    }

    // 4. Persist Quote Record in Supabase
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from as any)('quotes').insert({
        quote_id: quoteId,
        customer_id: customerId,
        customer_email: cleanEmail,
        customer_name: name,
        business_name: business || null,
        website_url: websiteUrl || null,
        reward_id: rewardId,
        additional_notes: requirements || voiceNotes || null,
        required_features: (items || []).map((i: any) => i.name),
        budget_amount: calcSummary.finalTotalUSD,
        budget_currency: activeCurrency,
        status: 'submitted',
        created_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('[Checkout Submit] Quote insert warning:', e)
    }

    // 5. Persist Order Record in Supabase
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from as any)('orders').insert({
        order_number: orderId,
        quote_id: quoteId,
        customer_id: customerId,
        customer_email: cleanEmail,
        customer_name: name,
        customer_phone: phone || null,
        country: country || null,
        address: address || null,
        business_name: business || null,
        website_url: websiteUrl || null,
        reward_id: rewardId,
        requirements: requirements || null,
        voice_notes: voiceNotes || null,
        reference_links: referenceLinks || null,
        subtotal_usd: calcSummary.subtotalUSD,
        discount_usd: calcSummary.totalSavingsUSD,
        tax_usd: calcSummary.processingFeeUSD,
        total_usd: calcSummary.finalTotalUSD,
        currency: activeCurrency,
        status: orderStatus,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        line_items: items || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('[Checkout Submit] Order insert warning:', e)
    }

    // 6. Formulate & Dispatch WhatsApp Client Enquiry
    const rewardName = rewardItem ? rewardItem.name : 'N/A'
    const rewardOriginalVal = rewardItem ? formatCurrencyPrice(rewardItem.originalPrice || 199, activeCurrency) : 'N/A'

    const whatsappResult = await sendWhatsAppEnquiry({
      customerName: name,
      customerEmail: cleanEmail,
      customerPhone: phone,
      country: country || 'United States',
      businessName: business,
      websiteUrl,
      orderId,
      quoteId,
      customerId,
      rewardName: rewardItem ? `${rewardItem.name} (${rewardId || 'YPL-RWD'})` : undefined,
      rewardId: rewardId || undefined,
      rewardOriginalValue: rewardOriginalVal,
      rewardDiscount: rewardItem ? '100%' : undefined,
      selectedServices: (items || []).map((i: any) =>
        i.isReward
          ? `- 🎁 ${i.name} (Original: ${rewardOriginalVal} → 100% FREE)`
          : `- ${i.name} (${calcSummary.currencySymbol}${i.price})`
      ),
      requirements: requirements || voiceNotes || 'Standard Implementation',
      budget: budget || calcSummary.finalTotalFormatted,
      currency: activeCurrency,
      subtotal: calcSummary.subtotalFormatted,
      discount: calcSummary.totalSavingsFormatted,
      finalTotal: calcSummary.finalTotalFormatted,
      timeline: timeline || '7-10 Business Days',
      paymentStatus: paymentStatus || 'Unpaid',
      createdAt: new Date().toISOString(),
    })

    // 7. Trigger Email Notification
    let emailSent = false
    try {
      const emailRes = await fetch(new URL('/api/emails/send', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: cleanEmail,
          recipientName: name,
          template: 'proposal_confirmation',
          subject: `Yample Labs Order Confirmation: ${orderId} (Quote ${quoteId})`,
          data: {
            quoteId,
            orderId,
            customerId,
            rewardId,
            rewardName: rewardItem ? rewardItem.name : null,
            totalAmount: calcSummary.finalTotalFormatted,
            currency: activeCurrency,
            items: items || [],
            requirements,
            trackingUrl: `/orders/${orderId}`,
          },
        }),
      })
      emailSent = emailRes.ok
    } catch (e) {
      console.warn('[Checkout Email] Notification dispatch note:', e)
      emailSent = false
    }

    return NextResponse.json({
      success: true,
      data: {
        customerId,
        quoteId,
        orderId,
        rewardId,
        rewardItem: rewardItem || null,
        customerName: name,
        customerEmail: cleanEmail,
        customerPhone: phone,
        summary: calcSummary,
        emailSent,
        whatsappSentViaApi: whatsappResult.sentViaApi,
        whatsappUrl: whatsappResult.whatsappUrl,
        whatsappStatusLabel: whatsappResult.statusLabel,
        items: items || [],
        orderStatus,
        paymentStatus,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Submission error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
