import type { AuditScores } from './types.js'

/**
 * Weighted Scoring Engine
 * Weights per docs/04-Audit-Engine.md:
 * - Performance: 25%
 * - SEO: 20%
 * - Accessibility: 15%
 * - Security: 10%
 * - UX: 10%
 * - Business: 10%
 * - Mobile: 10%
 */

export interface RawScoresInput {
  performanceScore?: number | null
  seoScore?: number | null
  accessibilityScore?: number | null
  securityScore?: number | null
  uxScore?: number | null
  businessScore?: number | null
  mobileScore?: number | null
}

export function calculateAuditScores(input: RawScoresInput): AuditScores {
  const performance = Math.min(Math.max(input.performanceScore ?? 70, 0), 100)
  const seo = Math.min(Math.max(input.seoScore ?? 75, 0), 100)
  const accessibility = Math.min(Math.max(input.accessibilityScore ?? 80, 0), 100)
  const security = Math.min(Math.max(input.securityScore ?? 65, 0), 100)
  const ux = Math.min(Math.max(input.uxScore ?? 72, 0), 100)
  const business = Math.min(Math.max(input.businessScore ?? 68, 0), 100)
  const mobile = Math.min(Math.max(input.mobileScore ?? 78, 0), 100)

  const overall = Math.round(
    performance * 0.25 +
      seo * 0.20 +
      accessibility * 0.15 +
      security * 0.10 +
      ux * 0.10 +
      business * 0.10 +
      mobile * 0.10
  )

  return {
    overall,
    performance,
    seo,
    accessibility,
    security,
    ux,
    business,
    mobile,
  }
}
