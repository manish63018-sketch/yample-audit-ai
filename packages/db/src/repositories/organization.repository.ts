import type { TypedSupabaseClient } from '../client'
import type { Database } from '@auditai/shared'

export type OrgRow = Database['public']['Tables']['organizations']['Row']
export type OrgInsert = Database['public']['Tables']['organizations']['Insert']
export type OrgUpdate = Database['public']['Tables']['organizations']['Update']
export type TeamMemberRow = Database['public']['Tables']['team_members']['Row']

export class OrganizationRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findById(id: string): Promise<OrgRow | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async findBySlug(slug: string): Promise<OrgRow | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) return null
    return data
  }

  async create(org: OrgInsert): Promise<OrgRow> {
    const { data, error } = await this.client
      .from('organizations')
      .insert(org)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to create organization: ${error.message}`)
    return data
  }

  async update(id: string, updates: OrgUpdate): Promise<OrgRow> {
    const { data, error } = await this.client
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to update organization: ${error.message}`)
    return data
  }

  async getMembers(organizationId: string): Promise<TeamMemberRow[]> {
    const { data, error } = await this.client
      .from('team_members')
      .select('*')
      .eq('organization_id', organizationId)

    if (error) return []
    return data || []
  }

  async addMember(
    organizationId: string,
    userId: string,
    role: string = 'developer'
  ): Promise<TeamMemberRow> {
    const { data, error } = await this.client
      .from('team_members')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role,
      })
      .select('*')
      .single()

    if (error) throw new Error(`Failed to add team member: ${error.message}`)
    return data
  }
}
