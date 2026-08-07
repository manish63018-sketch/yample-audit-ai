import { NextRequest, NextResponse } from 'next/server'
import { buildEmailTemplate, type EmailTemplate, type EmailTemplateData } from '@/lib/email-templates'

/**
 * AuditAI Email Sender API
 * POST /api/emails/send
 *
 * Uses Resend.com for delivery.
 * Env: RESEND_API_KEY
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { template, data, to } = body as {
      template: EmailTemplate
      data: EmailTemplateData
      to?: string // Override recipient — defaults to data.customerEmail
    }

    if (!template || !data?.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: template, data.customerEmail' },
        { status: 400 }
      )
    }

    const { subject, html } = buildEmailTemplate(template, data)
    const recipientEmail = to || data.customerEmail
    const recipientName = data.customerName

    // ── Resend.com Delivery ──────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      // Dev mode: log email without sending
      console.log('[EmailService] RESEND_API_KEY not configured. Email NOT sent.')
      console.log(`  Template: ${template}`)
      console.log(`  To: ${recipientName} <${recipientEmail}>`)
      console.log(`  Subject: ${subject}`)

      return NextResponse.json({
        success: true,
        dev: true,
        message: 'Email logged (RESEND_API_KEY not set — dev mode)',
        template,
        to: recipientEmail,
        subject,
      })
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AuditAI by Yample Labs <noreply@yamplelabs.com>',
        to: [`${recipientName} <${recipientEmail}>`],
        subject,
        html,
      }),
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      console.error('[EmailService] Resend error:', resendData)
      return NextResponse.json(
        { success: false, error: resendData?.message || 'Resend delivery failed' },
        { status: 502 }
      )
    }

    // Log to Supabase email_logs (best-effort — never blocks email delivery)
    try {
      const { createAdminSupabaseClient } = await import('@auditai/db')
      const supabase = createAdminSupabaseClient()
      await supabase.from('email_logs').insert({
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        template,
        subject,
        status: 'sent',
        sent_at: new Date().toISOString(),
        order_id: data.orderId || null,
        user_id: null,
      })
    } catch (logErr) {
      // Non-critical — email was already delivered via Resend
      console.warn('[EmailService] Email log skipped:', (logErr as Error)?.message)
    }

    return NextResponse.json({
      success: true,
      messageId: resendData.id,
      to: recipientEmail,
      subject,
      template,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[EmailService] Unexpected error:', err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
