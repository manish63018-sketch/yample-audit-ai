import { createAdminSupabaseClient, type TypedSupabaseClient } from '@auditai/db'

/**
 * Get a Supabase Admin client using the Service Role Key.
 * MUST only be used in secure server contexts (background workers, admin actions).
 */
export function getSupabaseAdminClient(): TypedSupabaseClient {
  return createAdminSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
