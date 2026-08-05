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
}

export interface AuditScores {
  overall: number
  performance: number
  seo: number
  accessibility: number
  security: number
  ux: number
  business: number
  mobile: number
}

export interface AuditRunPayload {
  url: string
  websiteId?: string
  organizationId?: string
  options?: {
    pagespeed?: boolean
    lighthouse?: boolean
    accessibility?: boolean
    seo?: boolean
    security?: boolean
    ai?: boolean
  }
}
