/**
 * Audit Engine Core Types & Interfaces
 */

export interface RunnerOptions {
  url: string
  pagespeedApiKey?: string
  timeoutMs?: number
}

export interface PageSpeedResult {
  lcp: number | null
  cls: number | null
  inp: number | null
  ttfb: number | null
  fcp: number | null
  speedIndex: number | null
  performanceScore: number | null
  rawPayload?: Record<string, unknown>
}

export interface LighthouseOpportunity {
  id: string
  title: string
  description: string
  score: number | null
  savingsMs?: number
  savingsBytes?: number
}

export interface LighthouseResult {
  performanceScore: number | null
  accessibilityScore: number | null
  bestPracticesScore: number | null
  seoScore: number | null
  opportunities: LighthouseOpportunity[]
  diagnostics: Record<string, unknown>
  rawPayload?: Record<string, unknown>
}

export interface AccessibilityIssue {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  description: string
  helpUrl: string
  nodes: string[]
}

export interface AccessibilityResult {
  score: number | null
  passedCount: number
  issues: AccessibilityIssue[]
  warnings: AccessibilityIssue[]
}

export interface HeadingItem {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
}

export interface SEOResult {
  score: number | null
  title: string | null
  titleLength: number
  metaDescription: string | null
  metaDescriptionLength: number
  h1Count: number
  headings: HeadingItem[]
  canonical: string | null
  hasRobotsTxt: boolean
  hasSitemapXml: boolean
  openGraph: {
    title?: string | null
    description?: string | null
    image?: string | null
  }
  twitterCard: {
    card?: string | null
    title?: string | null
  }
  totalImages: number
  imagesWithoutAlt: number
  brokenLinks?: string[]
  internalLinksCount?: number
  externalLinksCount?: number
  schemaTypes?: string[]
}

export interface SecurityHeaderStatus {
  header: string
  present: boolean
  value: string | null
  recommended: string
}

export interface SecurityResult {
  score: number | null
  isHttps: boolean
  sslValid: boolean
  headers: SecurityHeaderStatus[]
  hasCsp: boolean
  hasHsts: boolean
  hasXFrameOptions: boolean
  hasXContentTypeOptions: boolean
  hasReferrerPolicy: boolean
  mixedContentCount?: number
  exposedFiles?: string[]
  cookieSecurity?: {
    hasSecure: boolean
    hasHttpOnly: boolean
    hasSameSite: boolean
  }
}

export interface SystemValidationResult {
  reachable: boolean
  httpStatus: number
  sslAvailable: boolean
  redirectChain: string[]
  hasRobotsTxt: boolean
  hasSitemapXml: boolean
  detectedCms: string | null
  detectedTechnologies: string[]
  detectedFramework: string | null
  serverHeader: string | null
}

export interface CrawlPageData {
  url: string
  title: string | null
  h1: string | null
  metaDescription: string | null
  imageCount: number
  internalLinks: string[]
  externalLinks: string[]
  hasSchema: boolean
}

export interface CrawlResult {
  crawledPages: CrawlPageData[]
  totalPagesCrawled: number
  discoveredUrls: string[]
}

export interface MissingFeature {
  feature: string
  importance: 'critical' | 'recommended' | 'optional'
  reason: string
}

export interface BusinessAnalysisResult {
  businessScore: number
  detectedCategory: string
  detectedFeatures: string[]
  missingFeatures: MissingFeature[]
  aiInsights: string
}

export interface BenchmarkComparison {
  category: string
  userScore: number
  industryAverage: number
  diff: number
}

export interface CompetitorBenchmarkResult {
  industry: string
  comparisons: BenchmarkComparison[]
}

export interface RevenueEstimate {
  leadIncreasePercent: number
  conversionUpliftPercent: number
  speedImprovementPercent: number
  estimatedMonthlyGainUsd: number
  disclaimer: string
}

export interface QuoteItem {
  serviceId: string
  title: string
  reason: string
  price: number
}

export interface SmartQuoteResult {
  recommendedServices: QuoteItem[]
  subtotal: number
  bundleDiscountPercent: number
  totalAmount: number
  currency: 'USD' | 'INR'
}

export interface AuditScores {
  overall: number
  technicalHealth: number
  businessGrowth: number
  performance: number
  seo: number
  accessibility: number
  security: number
  ux: number
  business: number
  mobile: number
  confidence?: {
    performance: string
    seo: string
    accessibility: string
    security: string
    ux: string
    business: string
  }
}

export interface AuditRunPayload {
  url: string
  businessCategory?: string
  country?: string
  businessGoal?: string
  websiteId?: string
  organizationId?: string
  /** Pre-created audit ID from /api/audits/start — avoids creating a duplicate DB record */
  _existingAuditId?: string
  options?: {
    pagespeed?: boolean
    lighthouse?: boolean
    accessibility?: boolean
    seo?: boolean
    security?: boolean
    ai?: boolean
  }
}

