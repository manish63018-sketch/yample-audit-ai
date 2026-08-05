import type { TypedSupabaseClient } from '../client'
import type { Database } from '@auditai/shared'

export type WebsiteRow = Database['public']['Tables']['websites']['Row']
export type WebsiteInsert = Database['public']['Tables']['websites']['Insert']
export type WebsiteUpdate = Database['public']['Tables']['websites']['Update']

export class WebsiteRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findById(id: string): Promise<WebsiteRow | null> {
    const { data, error } = await this.client
      .from('websites')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async findByUrl(organizationId: string, url: string): Promise<WebsiteRow | null> {
    const { data, error } = await this.client
      .from('websites')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('url', url)
      .single()

    if (error) return null
    return data
  }

  async listByOrganization(organizationId: string): Promise<WebsiteRow[]> {
    const { data, error } = await this.client
      .from('websites')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data || []
  }

  async create(website: WebsiteInsert): Promise<WebsiteRow> {
    const { data, error } = await this.client
      .from('websites')
      .insert(website)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to create website: ${error.message}`)
    return data
  }

  async update(id: string, updates: WebsiteUpdate): Promise<WebsiteRow> {
    const { data, error } = await this.client
      .from('websites')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to update website: ${error.message}`)
    return data
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from('websites').delete().eq('id', id)
    return !error
  }
}
