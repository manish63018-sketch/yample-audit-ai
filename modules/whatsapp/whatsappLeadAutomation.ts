export interface WhatsAppLeadContext {
  leadId?: string
  businessName: string
  website: string
  phone?: string
  auditScore?: number
}

export class WhatsAppLeadAutomation {
  /**
   * Generate direct WhatsApp deep-link prepopulated with lead context
   */
  static generateDeepLink(phoneNumber: string, ctx: WhatsAppLeadContext): string {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
    const message = encodeURIComponent(
      `Hello Yample Labs! I would like to discuss upgrading ${ctx.website} (Audit Score: ${ctx.auditScore || 'N/A'}/100). Please share proposal details.`
    )
    return `https://wa.me/${cleanPhone}?text=${message}`
  }

  /**
   * Qualify lead and format webhook payload for WhatsApp Business API
   */
  static formatWebhookPayload(ctx: WhatsAppLeadContext) {
    return {
      messaging_product: 'whatsapp',
      to: ctx.phone || '',
      type: 'template',
      template: {
        name: 'audit_proposal_followup',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: ctx.businessName },
              { type: 'text', text: ctx.website },
              { type: 'text', text: String(ctx.auditScore || 70) },
            ],
          },
        ],
      },
    }
  }
}
