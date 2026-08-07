/**
 * AuditAI Email Templates — Yample Labs
 * Branded HTML email templates for all notification types.
 * Zero-emoji executive design standard.
 */

export type EmailTemplate =
  | 'account_created'
  | 'audit_completed'
  | 'quote_generated'
  | 'payment_confirmation'
  | 'project_started'
  | 'project_updated'
  | 'project_completed'
  | 'invoice'

export interface EmailTemplateData {
  customerName: string
  customerEmail: string
  companyName?: string
  dashboardUrl?: string
  auditUrl?: string
  quoteId?: string
  quoteUrl?: string
  totalAmount?: string
  orderId?: string
  projectName?: string
  services?: string[]
  milestoneTitle?: string
  milestoneNotes?: string
  progressPercent?: number
  invoiceId?: string
  invoiceUrl?: string
  invoiceAmount?: string
  currency?: string
  paymentProvider?: string
  paymentDate?: string
  estimatedDelivery?: string
  deliveryDate?: string
}

function baseLayout(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AuditAI by Yample Labs</title>
</head>
<body style="margin:0;padding:0;background-color:#08080f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080f;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0533 0%,#0d0d1a 100%);border-radius:16px 16px 0 0;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;height:36px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:10px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:16px;font-weight:900;line-height:36px;">A</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="color:#fff;font-size:18px;font-weight:800;">Audit<span style="color:#a78bfa;">AI</span></span>
                          <span style="color:#64748b;font-size:11px;margin-left:8px;">by Yample Labs</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#0f0f1a;padding:32px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0a0a15;border-radius:0 0 16px 16px;padding:24px 32px;border:1px solid rgba(255,255,255,0.05);border-top:none;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#4a5568;font-size:11px;line-height:1.7;">
                    <p style="margin:0 0 8px 0;">© ${new Date().getFullYear()} Yample Labs. All rights reserved. AuditAI™ is a registered business platform of Yample Labs.</p>
                    <p style="margin:0;">Registered in India. GST & legal compliance applicable.</p>
                    <p style="margin:8px 0 0 0;">
                      <a href="https://auditai.yamplelabs.com/privacy" style="color:#7c3aed;text-decoration:none;">Privacy Policy</a>
                      &nbsp;•&nbsp;
                      <a href="https://auditai.yamplelabs.com/terms" style="color:#7c3aed;text-decoration:none;">Terms</a>
                      &nbsp;•&nbsp;
                      <a href="https://auditai.yamplelabs.com/dashboard" style="color:#7c3aed;text-decoration:none;">Dashboard</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function headingSection(title: string, subtitle: string) {
  return `
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px 0;">${title}</h1>
    <p style="color:#94a3b8;font-size:14px;margin:0 0 24px 0;">${subtitle}</p>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px 0;" />
  `
}

function ctaButton(text: string, url: string) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:10px;padding:0;">
          <a href="${url}" style="display:inline-block;padding:14px 28px;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;">
            ${text} →
          </a>
        </td>
      </tr>
    </table>
  `
}

function infoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#64748b;font-size:12px;width:40%;">${label}</td>
            <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

export function buildEmailTemplate(template: EmailTemplate, data: EmailTemplateData): { subject: string; html: string } {
  switch (template) {
    case 'account_created': {
      const subject = `Welcome to AuditAI, ${data.customerName}`
      const html = baseLayout(
        `
        ${headingSection('Welcome to AuditAI', 'Your account has been successfully created.')}
        <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          Hi <strong style="color:#fff;">${data.customerName}</strong>, welcome aboard.<br/>
          You now have full access to the AuditAI platform — AI website audits, custom project management, and automated quotations.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:10px;padding:16px;margin:0 0 20px 0;">
          <tr><td>
            <p style="color:#a78bfa;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 12px 0;text-transform:uppercase;">ACCOUNT DETAILS</p>
            <table width="100%">${infoRow('Name', data.customerName)}${infoRow('Email', data.customerEmail)}${data.companyName ? infoRow('Company', data.companyName) : ''}</table>
          </td></tr>
        </table>
        ${ctaButton('Go to Dashboard', data.dashboardUrl || 'https://auditai.yamplelabs.com/dashboard')}
        `,
        `Your AuditAI account is ready. Access your dashboard now.`
      )
      return { subject, html }
    }

    case 'audit_completed': {
      const subject = `Website Audit Report Ready — AuditAI`
      const html = baseLayout(
        `
        ${headingSection('Your Audit Report is Ready', 'AI analysis complete — insights are available in your dashboard.')}
        <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          Hi <strong style="color:#fff;">${data.customerName}</strong>, your website audit has completed.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:16px;margin:0 0 20px 0;">
          <tr><td>
            <p style="color:#34d399;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 8px 0;text-transform:uppercase;">AUDIT COMPLETE</p>
            <p style="color:#94a3b8;font-size:12px;margin:0;">Includes Performance Score, Technical SEO Analysis, Security Audit, Core Web Vitals, and AI Recommendations.</p>
          </td></tr>
        </table>
        ${ctaButton('View Full Report', data.auditUrl || 'https://auditai.yamplelabs.com/dashboard')}
        `,
        `Your AI website audit report is ready. View technical scores now.`
      )
      return { subject, html }
    }

    case 'quote_generated': {
      const subject = `Custom Quotation #${data.quoteId} — AuditAI`
      const html = baseLayout(
        `
        ${headingSection(`Quotation #${data.quoteId} Issued`, 'Your project quotation is ready.')}
        <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          Hi <strong style="color:#fff;">${data.customerName}</strong>, we have generated a detailed quotation based on your project requirements.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:10px;padding:16px;margin:0 0 20px 0;">
          <tr><td>
            <p style="color:#a78bfa;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 12px 0;text-transform:uppercase;">QUOTE SUMMARY</p>
            <table width="100%">
              ${infoRow('Quote Ref', data.quoteId || 'N/A')}
              ${data.totalAmount ? infoRow('Total Amount', data.totalAmount) : ''}
              ${data.estimatedDelivery ? infoRow('Est. Delivery', data.estimatedDelivery) : ''}
            </table>
          </td></tr>
        </table>
        ${ctaButton('View & Confirm Quote', data.quoteUrl || 'https://auditai.yamplelabs.com/quote')}
        `,
        `Your quotation #${data.quoteId} from Yample Labs is ready.`
      )
      return { subject, html }
    }

    case 'payment_confirmation': {
      const subject = `Payment Confirmed — Order #${data.orderId} | AuditAI`
      const html = baseLayout(
        `
        ${headingSection('Payment Confirmed', 'Your project order is confirmed and in our queue.')}
        <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0 0 20px 0;">
          Hi <strong style="color:#fff;">${data.customerName}</strong>, we have received your payment. Our engineering team is preparing your project kickoff.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:16px;margin:0 0 20px 0;">
          <tr><td>
            <p style="color:#34d399;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 12px 0;text-transform:uppercase;">PAYMENT RECEIPT</p>
            <table width="100%">
              ${infoRow('Order ID', data.orderId || 'N/A')}
              ${data.totalAmount ? infoRow('Amount Paid', data.totalAmount) : ''}
              ${data.currency ? infoRow('Currency', data.currency) : ''}
              ${data.paymentProvider ? infoRow('Payment Via', data.paymentProvider) : ''}
            </table>
          </td></tr>
        </table>
        ${ctaButton('Track Order Progress', `https://auditai.yamplelabs.com/orders/${data.orderId}`)}
        `,
        `Payment confirmed for Order #${data.orderId}. Track progress in dashboard.`
      )
      return { subject, html }
    }

    default:
      return {
        subject: `Notification — ${data.projectName || 'AuditAI'}`,
        html: baseLayout(
          `
          ${headingSection('Project Notification', 'Update regarding your account or order.')}
          <p style="color:#cbd5e1;font-size:14px;line-height:1.8;">
            Hi <strong style="color:#fff;">${data.customerName}</strong>, please log in to your dashboard to view the latest updates.
          </p>
          ${ctaButton('Open Dashboard', 'https://auditai.yamplelabs.com/dashboard')}
          `
        ),
      }
  }
}
