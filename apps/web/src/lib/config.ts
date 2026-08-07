/**
 * AuditAI Centralized Production Site & Environment Configuration
 * Single source of truth for domain, API endpoints, and Supabase connections.
 */

export const SITE_CONFIG = {
  domain: 'yampleauditai.vercel.app',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://yampleauditai.vercel.app',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://yampleauditai.vercel.app',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ictghruuvjkppqxtxhdy.supabase.co',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwcmNka2JnanJ2ZXRxbWNndnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTc3MTgsImV4cCI6MjEwMTQ5MzcxOH0.mE9T0rlB1NBv0R3PcFoekM4o9o95dfgQgumADEKCzDg',
  appName: 'AuditAI by Yample Labs',
  commitHash: 'cd6ca3f',
  environment: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
} as const

export function getFullUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_CONFIG.siteUrl}${cleanPath}`
}
