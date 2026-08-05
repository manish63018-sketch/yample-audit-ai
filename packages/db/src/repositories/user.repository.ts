import type { TypedSupabaseClient } from '../client'
import type { Database } from '@auditai/shared'

export type UserRow = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export class UserRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findById(id: string): Promise<UserRow | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) return null
    return data
  }

  async create(user: UserInsert): Promise<UserRow> {
    const { data, error } = await this.client
      .from('users')
      .insert(user)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)
    return data
  }

  async update(id: string, updates: UserUpdate): Promise<UserRow> {
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Failed to update user: ${error.message}`)
    return data
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from('users').delete().eq('id', id)
    return !error
  }
}
