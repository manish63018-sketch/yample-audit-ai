import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@auditai/shared'

export type { SupabaseClient }
export type TypedSupabaseClient = SupabaseClient<Database>

/**
 * Create a standard Supabase client for client-side or general server queries using anon key.
 */
export function createSupabaseClient(
  url: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
): TypedSupabaseClient {
  if (!url || !anonKey) {
    // Return dummy client if env is not configured yet during dev/build
    return createClient<Database>(
      url || 'https://placeholder.supabase.co',
      anonKey || 'placeholder'
    )
  }
  return createClient<Database>(url, anonKey)
}

/**
 * Create a Supabase Admin client using the Service Role Key.
 * MUST only be used in secure server contexts (API route handlers, workers).
 */
export function createAdminSupabaseClient(
  url: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
): TypedSupabaseClient {
  if (!url || !serviceRoleKey) {
    return createClient<Database>(
      url || 'https://placeholder.supabase.co',
      serviceRoleKey || 'placeholder',
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
