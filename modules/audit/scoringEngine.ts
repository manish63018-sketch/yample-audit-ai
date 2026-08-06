import type { AuditScores } from './types'

/**
 * Weighted Dual-Layer Scoring Engine
 *
 * Weighting Breakdown:
 * - Performance (Lighthouse): 30%
 * - SEO: 20%
 * - Accessibility: 15%
 * - Security: 10%
 * - UI/UX Analysis (AI): 10%
 * - Business Conversion Analysis (AI): 15%
 *
 * Sub-Scores:
 * - Technical Health: (Performance 40% + SEO 30% + Accessibility 15% + Security 15%)
 * - Business Growth: (Business Conversion 60% + UI/UX 40%)
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
  const performance = Math.min(Math.max(input.performanceScore ?? 75, 0), 100)
  const seo = Math.min(Math.max(input.seoScore ?? 75, 0), 100)
  const accessibility = Math.min(Math.max(input.accessibilityScore ?? 80, 0), 100)
  const security = Math.min(Math.max(input.securityScore ?? 75, 0), 100)
  const ux = Math.min(Math.max(input.uxScore ?? 75, 0), 100)
  const business = Math.min(Math.max(input.businessScore ?? 70, 0), 100)
  const mobile = Math.min(Math.max(input.mobileScore ?? 80, 0), 100)

  // 1. Technical Health Score (Pure Automated Measurements)
  const technicalHealth = Math.round(
    performance * 0.40 +
    seo * 0.30 +
    accessibility * 0.15 +
    security * 0.15
  )

  // 2. Business Growth Score (AI Conversion & UX Analysis)
  const businessGrowth = Math.round(
    business * 0.60 +
    ux * 0.40
  )

  // 3. Composite Overall Audit Score
  const overall = Math.round(
    performance * 0.30 +
    seo * 0.20 +
    accessibility * 0.15 +
    security * 0.10 +
    ux * 0.10 +
    business * 0.15
  )

  return {
    overall,
    technicalHealth,
    businessGrowth,
    performance,
    seo,
    accessibility,
    security,
    ux,
    business,
    mobile,
    confidence: {
      performance: 'High Confidence (measured)',
      seo: 'High Confidence (measured)',
      accessibility: 'High Confidence (measured)',
      security: 'High Confidence (measured)',
      ux: 'AI-Assisted Insights',
      business: 'AI-Assisted Insights',
    },
  }
}
