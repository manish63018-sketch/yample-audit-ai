import type { TypedSupabaseClient } from '../client'
import type { Database } from '@auditai/shared'

export type PagespeedRow = Database['public']['Tables']['pagespeed_reports']['Row']
export type LighthouseRow = Database['public']['Tables']['lighthouse_reports']['Row']
export type AccessibilityRow = Database['public']['Tables']['accessibility_reports']['Row']
export type SeoRow = Database['public']['Tables']['seo_reports']['Row']
export type AiRow = Database['public']['Tables']['ai_reports']['Row']
export type GenericReportRow = Database['public']['Tables']['reports']['Row']

export class ReportRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  // Pagespeed
  async savePagespeedReport(
    report: Database['public']['Tables']['pagespeed_reports']['Insert']
  ): Promise<PagespeedRow> {
    const { data, error } = await this.client
      .from('pagespeed_reports')
      .insert(report)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to save pagespeed report: ${error.message}`)
    return data
  }

  async getPagespeedReport(auditId: string): Promise<PagespeedRow | null> {
    const { data, error } = await this.client
      .from('pagespeed_reports')
      .select('*')
      .eq('audit_id', auditId)
      .single()

    if (error) return null
    return data
  }

  // Lighthouse
  async saveLighthouseReport(
    report: Database['public']['Tables']['lighthouse_reports']['Insert']
  ): Promise<LighthouseRow> {
    const { data, error } = await this.client
      .from('lighthouse_reports')
      .insert(report)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to save lighthouse report: ${error.message}`)
    return data
  }

  async getLighthouseReport(auditId: string): Promise<LighthouseRow | null> {
    const { data, error } = await this.client
      .from('lighthouse_reports')
      .select('*')
      .eq('audit_id', auditId)
      .single()

    if (error) return null
    return data
  }

  // Accessibility
  async saveAccessibilityReport(
    report: Database['public']['Tables']['accessibility_reports']['Insert']
  ): Promise<AccessibilityRow> {
    const { data, error } = await this.client
      .from('accessibility_reports')
      .insert(report)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to save accessibility report: ${error.message}`)
    return data
  }

  async getAccessibilityReport(auditId: string): Promise<AccessibilityRow | null> {
    const { data, error } = await this.client
      .from('accessibility_reports')
      .select('*')
      .eq('audit_id', auditId)
      .single()

    if (error) return null
    return data
  }

  // SEO
  async saveSeoReport(
    report: Database['public']['Tables']['seo_reports']['Insert']
  ): Promise<SeoRow> {
    const { data, error } = await this.client
      .from('seo_reports')
      .insert(report)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to save SEO report: ${error.message}`)
    return data
  }

  async getSeoReport(auditId: string): Promise<SeoRow | null> {
    const { data, error } = await this.client
      .from('seo_reports')
      .select('*')
      .eq('audit_id', auditId)
      .single()

    if (error) return null
    return data
  }

  // AI Report
  async saveAiReport(
    report: Database['public']['Tables']['ai_reports']['Insert']
  ): Promise<AiRow> {
    const { data, error } = await this.client
      .from('ai_reports')
      .insert(report)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to save AI report: ${error.message}`)
    return data
  }

  async getAiReport(auditId: string): Promise<AiRow | null> {
    const { data, error } = await this.client
      .from('ai_reports')
      .select('*')
      .eq('audit_id', auditId)
      .single()

    if (error) return null
    return data
  }

  // Generic Report (for full audit object backup)
  async saveGenericReport(auditId: string, type: string, payload: any): Promise<GenericReportRow | null> {
    const { data, error } = await this.client
      .from('reports')
      .insert({ audit_id: auditId, type, payload })
      .select('*')
      .single()

    if (error) return null
    return data
  }

  async getGenericReport(auditId: string, type: string): Promise<GenericReportRow | null> {
    const { data, error } = await this.client
      .from('reports')
      .select('*')
      .eq('audit_id', auditId)
      .eq('type', type)
      .single()

    if (error) return null
    return data
  }

  // Consolidated Full Report
  async getFullAuditReport(auditId: string) {
    const [pagespeed, lighthouse, accessibility, seo, ai, genericFull] = await Promise.all([
      this.getPagespeedReport(auditId),
      this.getLighthouseReport(auditId),
      this.getAccessibilityReport(auditId),
      this.getSeoReport(auditId),
      this.getAiReport(auditId),
      this.getGenericReport(auditId, 'full_audit'),
    ])

    return {
      pagespeed,
      lighthouse,
      accessibility,
      seo,
      ai,
      fullResult: genericFull?.payload || null,
    }
  }
}
