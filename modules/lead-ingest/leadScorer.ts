import type { NormalizedLead, LeadScoreBreakdown, LeadPriority } from './types'

/**
 * Lead Priority Scorer (0 - 100)
 * Evaluates business lead value, contact availability, and technical improvement opportunity.
 */
export class LeadScorer {
  static scoreLead(lead: NormalizedLead, auditScore?: number | null): LeadScoreBreakdown {
    let score = 30 // Baseline
    const reasons: string[] = []

    // 1. Audit Opportunity Score (Low score = High opportunity for agency)
    if (auditScore !== undefined && auditScore !== null) {
      if (auditScore < 60) {
        score += 30
        reasons.push('High Technical Opportunity: Low website health score (< 60/100)')
      } else if (auditScore < 80) {
        score += 15
        reasons.push('Moderate Technical Opportunity: Website score 60-80/100')
      }
    } else {
      score += 15 // Default opportunity credit
    }

    // 2. Contact Information Completeness
    if (lead.email && lead.phone) {
      score += 20
      reasons.push('Complete Contact Information: Both email and phone available')
    } else if (lead.email || lead.phone) {
      score += 10
      reasons.push('Partial Contact Information: Direct email or phone available')
    }

    // 3. High-Value Target Industry
    const highValueIndustries = ['e-commerce', 'legal', 'medical', 'dental', 'real estate', 'finance', 'agency', 'healthcare', 'saas']
    const leadInd = (lead.industry || '').toLowerCase()
    if (highValueIndustries.some((ind) => leadInd.includes(ind))) {
      score += 20
      reasons.push(`High-Value Industry Segment: ${lead.industry}`)
    }

    // 4. Website Presence
    if (lead.website) {
      score += 10
    }

    score = Math.min(score, 100)

    let priority: LeadPriority = 'low'
    if (score >= 70) {
      priority = 'high'
    } else if (score >= 45) {
      priority = 'medium'
    }

    return {
      score,
      priority,
      reasons,
    }
  }
}
