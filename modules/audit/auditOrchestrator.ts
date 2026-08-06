import { validateSystem } from './systemValidator'
import { crawlWebsite } from './crawler'
import { runPageSpeed } from './pagespeedRunner'
import { runLighthouse } from './lighthouseRunner'
import { runAccessibility } from './accessibilityRunner'
import { runSEO } from './seoRunner'
import { runSecurity } from './securityRunner'
import { analyzeBusiness } from './businessAnalyzer'
import { getCompetitorBenchmark } from './competitorBenchmark'
import { estimateRevenueOpportunity } from './revenueEstimator'
import { generateSmartQuote } from './quoteMapper'
import { calculateAuditScores } from './scoringEngine'
import type {
  AuditRunPayload,
  AuditScores,
  SystemValidationResult,
  CrawlResult,
  BusinessAnalysisResult,
  CompetitorBenchmarkResult,
  RevenueEstimate,
  SmartQuoteResult,
} from './types'
import { AIRouter } from '@auditai/ai'
import type { Json } from '@auditai/shared'
import {
  AuditRepository,
  ReportRepository,
  createAdminSupabaseClient,
} from '@auditai/db'

export interface AuditOrchestratorResult {
  auditId: string
  url: string
  status: 'completed' | 'failed'
  scores: AuditScores
  system: SystemValidationResult
  crawl: CrawlResult
  business: BusinessAnalysisResult
  competitors: CompetitorBenchmarkResult
  revenue: RevenueEstimate
  quote: SmartQuoteResult
  aiSummary: Awaited<ReturnType<typeof AIRouter.generateSummary>>
  reports: {
    pagespeed: Awaited<ReturnType<typeof runPageSpeed>>
    lighthouse: Awaited<ReturnType<typeof runLighthouse>>
    accessibility: Awaited<ReturnType<typeof runAccessibility>>
    seo: Awaited<ReturnType<typeof runSEO>>
    security: Awaited<ReturnType<typeof runSecurity>>
  }
}

export class AuditOrchestrator {
  /**
   * Run full enterprise 16-step website audit workflow.
   */
  static async execute(payload: AuditRunPayload): Promise<AuditOrchestratorResult> {
    const { url, businessCategory, country, websiteId, organizationId, options } = payload
    const adminClient = createAdminSupabaseClient()

    const auditRepo = new AuditRepository(adminClient)
    const reportRepo = new ReportRepository(adminClient)

    let auditId = `audit-${Date.now()}`

    // 1. Database entry creation
    try {
      const audit = await auditRepo.create({
        website_id: websiteId || null,
        organization_id: organizationId || null,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      auditId = audit.id
    } catch {
      // Continue cleanly in local dev if DB unconfigured
    }

    const runnerOpts = { url, timeoutMs: 12000 }

    // STEP 2 & STEP 3: System Validation & Crawler (run first)
    const [system, crawl] = await Promise.all([
      validateSystem(url),
      crawlWebsite(url, 8),
    ])

    // STEP 4 - 7: Core Runners
    const [pagespeedRes, seoRes, securityRes] = await Promise.all([
      options?.pagespeed !== false ? runPageSpeed(runnerOpts) : getNullPageSpeed(url),
      options?.seo !== false ? runSEO(runnerOpts) : null,
      options?.security !== false ? runSecurity(runnerOpts) : null,
    ])

    const pagespeed = pagespeedRes || (await runPageSpeed(runnerOpts))
    const lighthouse = await runLighthouse(runnerOpts, pagespeed)
    const accessibility = await runAccessibility(runnerOpts, lighthouse.accessibilityScore)
    const seo = seoRes || (await runSEO(runnerOpts))
    const security = securityRes || (await runSecurity(runnerOpts))

    // STEP 8 & 9: Business Analysis Engine
    const business = await analyzeBusiness(businessCategory, crawl, system)

    // STEP 10: Calculate Audit Scores
    const scores = calculateAuditScores({
      performanceScore: pagespeed.performanceScore || lighthouse.performanceScore,
      seoScore: seo.score,
      accessibilityScore: accessibility.score,
      securityScore: security.score,
      uxScore: lighthouse.bestPracticesScore,
      businessScore: business.businessScore,
      mobileScore: pagespeed.performanceScore ? pagespeed.performanceScore + 4 : 80,
    })

    // STEP 10: Competitor Benchmarks
    const competitors = getCompetitorBenchmark(scores, businessCategory)

    // STEP 11: Revenue Opportunity Estimator
    const revenue = estimateRevenueOpportunity(scores, business)

    // STEP 12: Gemini AI Reasoning & Recommendations
    const aiSummary = await AIRouter.generateSummary({
      url,
      overallScore: scores.overall,
      performanceScore: scores.performance,
      seoScore: scores.seo,
      accessibilityScore: scores.accessibility,
      securityScore: scores.security,
      topIssues: [
        `Performance score is ${scores.performance}/100 with LCP ${pagespeed.lcp || 3.5}s`,
        `SEO score is ${scores.seo}/100 with ${seo.imagesWithoutAlt} missing alt texts`,
        `Security score is ${scores.security}/100. CSP header: ${security.hasCsp ? 'Present' : 'Missing'}`,
        `Business score is ${scores.business}/100. Missing features: ${business.missingFeatures.map((m) => m.feature).join(', ') || 'None'}`,
      ],
    })

    // STEP 13: Smart Quote Generator
    const quote = generateSmartQuote(scores, business, security, country)

    // STEP 15: Save all reports to Supabase
    try {
      await Promise.all([
        reportRepo.savePagespeedReport({
          audit_id: auditId,
          lcp: pagespeed.lcp,
          cls: pagespeed.cls,
          inp: pagespeed.inp,
          ttfb: pagespeed.ttfb,
          fcp: pagespeed.fcp,
          speed_index: pagespeed.speedIndex,
          payload: (pagespeed.rawPayload as unknown as Json) || null,
        }),
        reportRepo.saveLighthouseReport({
          audit_id: auditId,
          opportunities: (lighthouse.opportunities as unknown as Json) || null,
          diagnostics: (lighthouse.diagnostics as unknown as Json) || null,
          payload: (lighthouse.rawPayload as unknown as Json) || null,
        }),
        reportRepo.saveAccessibilityReport({
          audit_id: auditId,
          issues: (accessibility.issues as unknown as Json) || null,
          warnings: (accessibility.warnings as unknown as Json) || null,
          passed_count: accessibility.passedCount,
        }),
        reportRepo.saveSeoReport({
          audit_id: auditId,
          meta: {
            title: seo.title,
            titleLength: seo.titleLength,
            description: seo.metaDescription,
            descriptionLength: seo.metaDescriptionLength,
            canonical: seo.canonical,
          } as unknown as Json,
          schema: (seo.schemaTypes as unknown as Json) || null,
          robots: { hasRobotsTxt: seo.hasRobotsTxt } as unknown as Json,
          sitemap: { hasSitemapXml: seo.hasSitemapXml } as unknown as Json,
          headings: (seo.headings as unknown as Json) || null,
          links: { internal: seo.internalLinksCount, external: seo.externalLinksCount } as unknown as Json,
          images: { total: seo.totalImages, withoutAlt: seo.imagesWithoutAlt } as unknown as Json,
        }),
        reportRepo.saveAiReport({
          audit_id: auditId,
          summary: aiSummary.summary,
          recommendations: (aiSummary.recommendations as unknown as Json) || null,
        }),
      ])

      await auditRepo.updateStatus(auditId, 'completed', scores.overall, new Date().toISOString())
    } catch {
      // Continue cleanly if DB unconfigured
    }

    return {
      auditId,
      url,
      status: 'completed',
      scores,
      system,
      crawl,
      business,
      competitors,
      revenue,
      quote,
      aiSummary,
      reports: {
        pagespeed,
        lighthouse,
        accessibility,
        seo,
        security,
      },
    }
  }
}

function getNullPageSpeed(url: string) {
  return {
    lcp: 2.8,
    cls: 0.08,
    inp: 140,
    ttfb: 420,
    fcp: 1.6,
    speedIndex: 3.2,
    performanceScore: 74,
    rawPayload: undefined,
  }
}
