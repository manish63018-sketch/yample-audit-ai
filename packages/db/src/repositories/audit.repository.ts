import type { TypedSupabaseClient } from '../client'
import type { Database } from '@auditai/shared'

export type AuditRow = Database['public']['Tables']['audits']['Row']
export type AuditInsert = Database['public']['Tables']['audits']['Insert']
export type AuditUpdate = Database['public']['Tables']['audits']['Update']

export class AuditRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findById(id: string): Promise<AuditRow | null> {
    const { data, error } = await this.client
      .from('audits')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async create(audit: AuditInsert): Promise<AuditRow> {
    const { data, error } = await this.client
      .from('audits')
      .insert(audit)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to create audit: ${error.message}`)
    return data
  }

  async updateStatus(
    id: string,
    status: AuditRow['status'],
    score?: number | null,
    finishedAt?: string
  ): Promise<AuditRow> {
    const updates: AuditUpdate = { status }
    if (score !== undefined) updates.score = score
    if (finishedAt) updates.finished_at = finishedAt

    const { data, error } = await this.client
      .from('audits')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to update audit status: ${error.message}`)
    return data
  }

  async listByWebsite(websiteId: string, limit: number = 20): Promise<AuditRow[]> {
    const { data, error } = await this.client
      .from('audits')
      .select('*')
      .eq('website_id', websiteId)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) return []
    return data || []
  }

  async listByOrganization(organizationId: string, limit: number = 50): Promise<AuditRow[]> {
    const { data, error } = await this.client
      .from('audits')
      .select('*')
      .eq('organization_id', organizationId)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) return []
    return data || []
  }

  async getLatestForWebsite(websiteId: string): Promise<AuditRow | null> {
    const { data, error } = await this.client
      .from('audits')
      .select('*')
      .eq('website_id', websiteId)
      .order('started_at', { ascending: false })
      .limit(1)
      .single()

    if (error) return null
    return data
  }
}
