import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@auditai/db';
import type { SupportedCurrency } from '@/lib/pricing';
import { calculateOrderSummary } from '@/lib/pricing';
import { sendWhatsAppEnquiry } from '@/lib/whatsapp';

function generateId(prefix: string) {
  const now = new Date();
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${yyyymm}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Full Name and Email Address are required to generate order records.',
        },
        { status: 400 }
      );
    }

    const customerId = generateId('CUST');
    const quoteId = generateId('QT');
    const orderId = generateId('ORD');

    const isIndia = country === 'India' || country === 'IN' || currency === 'INR';
    const activeCurrency: SupportedCurrency =
      (currency as SupportedCurrency) || (isIndia ? 'INR' : 'USD');

    // Calculate authoritative totals
    const calcSummary = calculateOrderSummary(items || [], activeCurrency, discount, isIndia);

    const adminClient = createAdminSupabaseClient();

    // 1. Save / Upsert Customer Profile in Supabase
    let savedCustomerId = customerId;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: customer } = await (adminClient.from as any)('customers')
        .upsert(
          {
            email: email.toLowerCase().trim(),
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
        .select('id')
        .single();

      if (customer?.id) savedCustomerId = customer.id;
    } catch (e) {
      console.warn('[Checkout DB] Customer upsert warning:', e);
    }

    // 2. Persist Quote Record in Supabase
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from as any)('quotes').insert({
        quote_id: quoteId,
        customer_id: savedCustomerId,
        customer_email: email,
        customer_name: name,
        business_name: business || null,
        website_url: websiteUrl || null,
        additional_notes: requirements || voiceNotes || null,
        required_features: (items || []).map((i: any) => i.name),
        budget_amount: calcSummary.finalTotalUSD,
        budget_currency: activeCurrency,
        status: 'submitted',
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[Checkout DB] Quote insert warning:', e);
    }

    // 3. Persist Order Record in Supabase
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from as any)('orders').insert({
        order_number: orderId,
        quote_id: quoteId,
        customer_id: savedCustomerId,
        customer_email: email,
        customer_name: name,
        customer_phone: phone || null,
        country: country || null,
        address: address || null,
        business_name: business || null,
        website_url: websiteUrl || null,
        requirements: requirements || null,
        voice_notes: voiceNotes || null,
        reference_links: referenceLinks || null,
        subtotal_usd: calcSummary.subtotalUSD,
        discount_usd: calcSummary.totalSavingsUSD || calcSummary.bundleDiscountUSD + discount,
        tax_usd: calcSummary.processingFeeUSD,
        total_usd: calcSummary.finalTotalUSD,
        currency: activeCurrency,
        status: orderStatus,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        line_items: items || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[Checkout DB] Order insert warning:', e);
    }

    // 4. Server-Side WhatsApp Dispatch or Fallback
    const whatsappResult = await sendWhatsAppEnquiry({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      country: country || 'United States',
      businessName: business,
      websiteUrl,
      orderId,
      quoteId,
      customerId: savedCustomerId,
      selectedServices: (items || []).map(
        (i: any) => `${i.name} (${calcSummary.currencySymbol}${i.price})`
      ),
      requirements: requirements || voiceNotes || 'Standard Implementation',
      budget: budget || calcSummary.finalTotalFormatted,
      currency: activeCurrency,
      subtotal: calcSummary.subtotalFormatted,
      discount: calcSummary.bundleDiscountFormatted,
      finalTotal: calcSummary.finalTotalFormatted,
      timeline: timeline || '7-10 Business Days',
      paymentStatus: paymentStatus || 'Unpaid',
      createdAt: new Date().toISOString(),
    });

    // 5. Trigger Confirmation Email
    let emailSent = false;
    try {
      const emailRes = await fetch(new URL('/api/emails/send', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          recipientName: name,
          template: 'proposal_confirmation',
          subject: `Yample Labs Order Confirmation: ${orderId} (Quote ${quoteId})`,
          data: {
            quoteId,
            orderId,
            customerId: savedCustomerId,
            totalAmount: calcSummary.finalTotalFormatted,
            currency: activeCurrency,
            items: items || [],
            requirements,
            trackingUrl: `/orders/${orderId}`,
          },
        }),
      });
      emailSent = emailRes.ok;
    } catch (e) {
      console.warn('[Checkout Email] Notification dispatch note:', e);
      emailSent = false;
    }

    return NextResponse.json({
      success: true,
      data: {
        customerId: savedCustomerId,
        quoteId,
        orderId,
        customerName: name,
        customerEmail: email,
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
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Submission error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
