import { createSupabaseClient, type TypedSupabaseClient } from '@auditai/db'

let client: TypedSupabaseClient | null = null

/**
 * Get or initialize the browser Supabase client.
 * Singleton instance for Client Components.
 */
export function getSupabaseBrowserClient(): TypedSupabaseClient {
  if (typeof window === 'undefined') {
    return createSupabaseClient()
  }

  if (!client) {
    client = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }

  return client
}
