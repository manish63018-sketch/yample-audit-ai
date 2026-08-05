export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'fallback'

export interface PromptContext {
  url: string
  overallScore: number
  performanceScore?: number | null
  seoScore?: number | null
  accessibilityScore?: number | null
  securityScore?: number | null
  topIssues?: string[]
  monthlyTraffic?: number
  averageOrderValue?: number
}

export interface AISummaryRecommendation {
  title: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  description: string
  estimatedRoi: string
  confidence: number // 0-100%
}

export interface AISummaryResult {
  summary: string
  executiveTakeaway: string
  recommendations: AISummaryRecommendation[]
  confidence: number
  providerUsed: AIProvider
}

export interface RevenueCalculationParams {
  monthlyTraffic: number
  conversionRatePercent: number
  averageOrderValueCents: number
  currentLcpSeconds: number
  targetLcpSeconds?: number
}

export interface RevenueOpportunityResult {
  currentAnnualRevenueCents: number
  projectedAnnualRevenueCents: number
  annualGainCents: number
  monthlyGainCents: number
  conversionUpliftPercent: number
  explanation: string
}

export interface ProposalOptions {
  clientName: string
  clientWebsite: string
  targetBudgetCents?: number
  customScope?: string[]
}

export interface ProposalScopeItem {
  feature: string
  description: string
  timelineDays: number
  priceCents: number
}

export interface ProposalResult {
  title: string
  overview: string
  scope: ProposalScopeItem[]
  totalPriceCents: number
  estimatedTimeline: string
  projectedRoi: string
  paymentTerms: string
  validityDays: number
}
