/**
 * AuditAI — Server-side WhatsApp Integration & Fallback Engine
 *
 * Yample Labs Official WhatsApp: +91 6305630468
 * 
 * Securely triggers WhatsApp Cloud API when environment credentials exist,
 * or formulates a pre-formatted wa.me deep link as a fallback.
 */

export const YAMPLE_LABS_WHATSAPP_NUMBER = '916305630468'

export interface WhatsAppEnquiryPayload {
  customerName: string
  customerEmail: string
  customerPhone?: string
  country?: string
  businessName?: string
  websiteUrl?: string
  orderId: string
  quoteId: string
  customerId?: string
  rewardName?: string
  rewardId?: string
  rewardOriginalValue?: string
  rewardDiscount?: string
  selectedServices: string[]
  requirements?: string
  budget?: string
  currency: string
  subtotal: string
  discount: string
  finalTotal: string
  timeline?: string
  paymentStatus: string
  createdAt?: string
}

/**
 * Format structured Yample Labs WhatsApp client enquiry text with Real Reward & Order Details
 */
export function formatWhatsAppMessage(data: WhatsAppEnquiryPayload): string {
  const servicesList = (data.selectedServices && data.selectedServices.length > 0)
    ? data.selectedServices.join('\n')
    : '- Standard Performance & SEO Overhaul'

  const rewardBlock = data.rewardName ? `
PROMOTIONAL REWARD
Reward: ${data.rewardName}
Original Value: ${data.rewardOriginalValue || 'N/A'}
Discount: ${data.rewardDiscount || '100%'}
Reward Value: $0 / ₹0
Reward ID: ${data.rewardId || 'N/A'}
` : `
PROMOTIONAL REWARD: None Applied
`

  return `NEW YAMPLE LABS CLIENT

Customer ID: ${data.customerId || 'YPL-CUST-GUEST'}
Quote ID: ${data.quoteId}
Order ID: ${data.orderId}

CUSTOMER DETAILS
Full Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone || 'N/A'}
Country: ${data.country || 'N/A'}

BUSINESS
Business Name: ${data.businessName || 'N/A'}
Website: ${data.websiteUrl || 'N/A'}

PROJECT REQUIREMENTS
${data.requirements || 'Standard Package Implementation'}

SELECTED SERVICES
${servicesList}
${rewardBlock}
PRICING
Subtotal: ${data.subtotal}
Discounts & Savings: ${data.discount}
Final Total: ${data.finalTotal}
Currency: ${data.currency}

TIMELINE: ${data.timeline || '7-10 Business Days'}
BUDGET: ${data.budget || data.finalTotal}

PAYMENT STATUS: ${data.paymentStatus}
`
}

export interface WhatsAppDispatchResult {
  sentViaApi: boolean
  method: 'cloud_api' | 'wa_me_fallback'
  whatsappUrl: string
  messageText: string
  statusLabel: string
}

/**
 * Server-side helper to attempt Cloud API dispatch or provide wa.me fallback
 */
export async function sendWhatsAppEnquiry(data: WhatsAppEnquiryPayload): Promise<WhatsAppDispatchResult> {
  const messageText = formatWhatsAppMessage(data)
  const encodedText = encodeURIComponent(messageText)
  const whatsappUrl = `https://wa.me/${YAMPLE_LABS_WHATSAPP_NUMBER}?text=${encodedText}`

  const apiToken = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER || YAMPLE_LABS_WHATSAPP_NUMBER

  if (apiToken && phoneNumberId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientNumber,
          type: 'text',
          text: { body: messageText },
        }),
      })

      if (res.ok) {
        return {
          sentViaApi: true,
          method: 'cloud_api',
          whatsappUrl,
          messageText,
          statusLabel: 'WhatsApp notification sent',
        }
      }
    } catch (e) {
      console.warn('[WhatsApp Dispatch] Cloud API failed, using wa.me fallback:', e)
    }
  }

  return {
    sentViaApi: false,
    method: 'wa_me_fallback',
    whatsappUrl,
    messageText,
    statusLabel: 'WhatsApp message ready to send',
  }
}
