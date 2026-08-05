import { createSupabaseClient, type TypedSupabaseClient } from '@auditai/db'

/**
 * Get a Supabase client for Next.js Server Components and Route Handlers.
 */
export function getSupabaseServerClient(): TypedSupabaseClient {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
