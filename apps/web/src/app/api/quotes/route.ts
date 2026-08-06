import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'

function generateQuoteId() {
  const now = new Date()
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const rand = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `QT-${yyyymm}-${rand}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('email')
    const status = searchParams.get('status')
    const limit = Number(searchParams.get('limit')) || 20

    const adminClient = createAdminSupabaseClient()
    // Cast from method to any for custom Supabase extension tables
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (adminClient.from as any)('quotes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (customerEmail) query = query.eq('customer_email', customerEmail)
    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data: data || [] })
  } catch {
    // Dev fallback
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerEmail,
      customerId,
      projectName,
      businessName,
      industry,
      timeline,
      existingWebsite,
      additionalNotes,
      requiredFeatures,
      budgetAmount,
      budgetCurrency,
      voiceOriginalText,
      voiceDetectedLanguage,
      voiceTranslatedText,
      aiSummary,
      aiEstimatedCostUsd,
      aiBudgetFit,
      aiRecommendation,
      customerCountry,
      customerCountryCode,
      customerCurrency,
      offerApplied,
      offerDiscountAmount,
      offerDiscountCurrency,
    } = body

    const quoteId = generateQuoteId()

    const quoteData = {
      quote_id: quoteId,
      customer_id: customerId || null,
      customer_email: customerEmail || null,
      project_name: projectName || null,
      business_name: businessName || null,
      industry: industry || null,
      timeline: timeline || null,
      existing_website: existingWebsite || null,
      additional_notes: additionalNotes || null,
      required_features: requiredFeatures || [],
      budget_amount: budgetAmount ? Number(budgetAmount) : null,
      budget_currency: budgetCurrency || 'USD',
      voice_original_text: voiceOriginalText || null,
      voice_detected_language: voiceDetectedLanguage || null,
      voice_translated_text: voiceTranslatedText || null,
      ai_summary: aiSummary || [],
      ai_estimated_cost_usd: aiEstimatedCostUsd || null,
      ai_budget_fit: aiBudgetFit || null,
      ai_recommendation: aiRecommendation || null,
      customer_country: customerCountry || null,
      customer_country_code: customerCountryCode || null,
      customer_currency: customerCurrency || 'USD',
      offer_applied: offerApplied || false,
      offer_discount_amount: offerDiscountAmount || 0,
      offer_discount_currency: offerDiscountCurrency || null,
      status: 'submitted',
    }

    let savedQuote: Record<string, unknown> = { ...quoteData, id: `local-${Date.now()}`, created_at: new Date().toISOString() }

    try {
      const adminClient = createAdminSupabaseClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (adminClient.from as any)('quotes')
        .insert(quoteData)
        .select()
        .single()

      if (error) throw error
      savedQuote = data
    } catch (dbErr) {
      console.warn('Supabase insert failed (dev mode fallback):', dbErr)
    }

    // Admin notification
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient.from('notifications').insert({
        user_id: customerId || '00000000-0000-0000-0000-000000000000',
        title: `New Quote: ${quoteId}`,
        message: `Customer: ${customerEmail || 'Anonymous'} | Country: ${customerCountry || 'Unknown'} | Currency: ${customerCurrency || 'USD'} | Budget: ${budgetCurrency}${budgetAmount} | AI Estimate: $${aiEstimatedCostUsd || 'N/A'} | Voice: ${voiceOriginalText ? 'Yes' : 'No'}`,
        meta: { quoteId, customerEmail, customerCountry, budgetAmount, budgetCurrency, aiEstimatedCostUsd, offerApplied },
        read: false,
      })
    } catch {}

    return NextResponse.json({
      success: true,
      data: savedQuote,
      quoteId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create quote.'
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_QUOTE_FAILED', message } },
      { status: 500 }
    )
  }
}
