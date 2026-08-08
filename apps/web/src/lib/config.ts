/**
 * AuditAI — Centralized Production Site & Environment Configuration
 *
 * SINGLE SOURCE OF TRUTH for all domain references, API endpoints, and Supabase connections.
 * Every file in the codebase must import from here instead of hardcoding URLs.
 */

const PRODUCTION_DOMAIN = 'yampleauditai.vercel.app';
const PRODUCTION_URL = `https://${PRODUCTION_DOMAIN}`;

export const SITE_CONFIG = {
  /** Bare domain without protocol */
  domain: PRODUCTION_DOMAIN,
  /** Full production URL with protocol */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL,
  /** API base URL (same as site URL for Next.js API routes) */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || PRODUCTION_URL,
  /** Supabase project URL */
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ictghruuvjkppqxtxhdy.supabase.co',
  /** Application display name */
  appName: 'AuditAI by Yample Labs',
  /** Current environment */
  environment:
    process.env.VERCEL_ENV ||
    (process.env.NODE_ENV === 'production' ? 'Production' : 'Development'),
} as const;

/**
 * Build an absolute URL from a path segment.
 * @example getFullUrl('/audit') => 'https://yampleauditai.vercel.app/audit'
 */
export function getFullUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.siteUrl}${cleanPath}`;
}
