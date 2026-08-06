import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@auditai/shared'

export type { SupabaseClient }
export type TypedSupabaseClient = SupabaseClient<Database>

/**
 * Create a standard Supabase client for client-side or general server queries.
 */
export function createSupabaseClient(
  url: string = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ictghruuvjkppqxtxhdy.supabase.co',
  anonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
): TypedSupabaseClient {
  return createClient<Database>(
    url || 'https://ictghruuvjkppqxtxhdy.supabase.co',
    anonKey || 'placeholder-anon-key'
  )
}

/**
 * Create a Supabase Admin client using the Service Role Key.
 * MUST only be used in secure server contexts (API route handlers, background tasks).
 */
export function createAdminSupabaseClient(
  url: string = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ictghruuvjkppqxtxhdy.supabase.co',
  serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
): TypedSupabaseClient {
  return createClient<Database>(
    url || 'https://ictghruuvjkppqxtxhdy.supabase.co',
    serviceRoleKey || 'placeholder-service-key',
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
