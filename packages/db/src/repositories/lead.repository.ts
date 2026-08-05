import type { TypedSupabaseClient } from '../client'
import type { Database } from '@auditai/shared'

export type LeadRow = Database['public']['Tables']['crm_leads']['Row']
export type LeadInsert = Database['public']['Tables']['crm_leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['crm_leads']['Update']

export class LeadRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findById(id: string): Promise<LeadRow | null> {
    const { data, error } = await this.client
      .from('crm_leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async create(lead: LeadInsert): Promise<LeadRow> {
    const { data, error } = await this.client
      .from('crm_leads')
      .insert(lead)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to create CRM lead: ${error.message}`)
    return data
  }

  async update(id: string, updates: LeadUpdate): Promise<LeadRow> {
    const { data, error } = await this.client
      .from('crm_leads')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to update CRM lead: ${error.message}`)
    return data
  }

  async listByOrganization(
    organizationId: string,
    options?: { status?: string; limit?: number; offset?: number }
  ): Promise<{ data: LeadRow[]; count: number }> {
    let query = this.client
      .from('crm_leads')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    }

    if (options?.limit) {
      const from = options.offset || 0
      query = query.range(from, from + options.limit - 1)
    }

    const { data, error, count } = await query

    if (error) return { data: [], count: 0 }
    return { data: data || [], count: count || 0 }
  }

  async updateStatus(id: string, status: string): Promise<LeadRow> {
    return this.update(id, { status })
  }

  async assignLead(id: string, userId: string): Promise<LeadRow> {
    return this.update(id, { assigned_to: userId })
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from('crm_leads').delete().eq('id', id)
    return !error
  }
}
