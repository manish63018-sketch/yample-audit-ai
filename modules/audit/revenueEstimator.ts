import type { RevenueEstimate, AuditScores, BusinessAnalysisResult } from './types'

/**
 * Revenue Opportunity Estimator (Step 11 of Audit Workflow)
 * Calculates growth potential (+Leads, +Conversion, +Speed) based on real technical debt identified in the audit.
 * Always presented as an estimate, not a guarantee.
 */
export function estimateRevenueOpportunity(
  scores: AuditScores,
  business: BusinessAnalysisResult
): RevenueEstimate {
  // Performance impact: every 10 points below 90 adds ~5% bounce rate
  const perfDeficit = Math.max(0, 90 - scores.performance)
  const speedImprovementPercent = Math.round(perfDeficit * 0.8)

  // SEO impact: every 10 points below 90 misses ~6% organic traffic
  const seoDeficit = Math.max(0, 90 - scores.seo)
  const leadIncreasePercent = Math.round(seoDeficit * 0.7 + business.missingFeatures.length * 3)

  // Conversion impact: missing features + low UX/mobile score
  const bizDeficit = Math.max(0, 85 - scores.business)
  const conversionUpliftPercent = Math.round(bizDeficit * 0.5 + business.missingFeatures.length * 4)

  const estimatedMonthlyGainUsd = Math.round((leadIncreasePercent * 40 + conversionUpliftPercent * 60) * 1.5)

  return {
    leadIncreasePercent: Math.max(10, Math.min(45, leadIncreasePercent)),
    conversionUpliftPercent: Math.max(8, Math.min(35, conversionUpliftPercent)),
    speedImprovementPercent: Math.max(15, Math.min(60, speedImprovementPercent)),
    estimatedMonthlyGainUsd: Math.max(300, estimatedMonthlyGainUsd),
    disclaimer: 'Estimates are based on industry benchmarks and average uplift delivered across similar optimization projects. Results vary depending on traffic volume and market positioning.',
  }
}
