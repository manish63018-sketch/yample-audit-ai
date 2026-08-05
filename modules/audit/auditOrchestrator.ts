import { runPageSpeed } from './pagespeedRunner'
import { runLighthouse } from './lighthouseRunner'
import { runAccessibility } from './accessibilityRunner'
import { runSEO } from './seoRunner'
import { runSecurity } from './securityRunner'
import { calculateAuditScores } from './scoringEngine'
import type { AuditRunPayload, AuditScores } from './types'
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
   * Run a complete website audit, saving progress and reports to Supabase.
   */
  static async execute(payload: AuditRunPayload): Promise<AuditOrchestratorResult> {
    const { url, websiteId, organizationId, options } = payload
    const adminClient = createAdminSupabaseClient()

    const auditRepo = new AuditRepository(adminClient)
    const reportRepo = new ReportRepository(adminClient)

    let auditId = `audit-${Date.now()}`

    // 1. Attempt DB creation if configured
    try {
      const audit = await auditRepo.create({
        website_id: websiteId || null,
        organization_id: organizationId || null,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      auditId = audit.id
    } catch {
      // Continue with in-memory execution if DB is unconfigured in dev
    }

    const runnerOpts = { url, timeoutMs: 12000 }

    // 2. Execute selected runners in parallel
    const [pagespeedRes, lighthouseRes, accessibilityRes, seoRes, securityRes] =
      await Promise.all([
        options?.pagespeed !== false ? runPageSpeed(runnerOpts) : null,
        options?.lighthouse !== false ? runLighthouse(runnerOpts) : null,
        options?.accessibility !== false ? runAccessibility(runnerOpts) : null,
        options?.seo !== false ? runSEO(runnerOpts) : null,
        options?.security !== false ? runSecurity(runnerOpts) : null,
      ])

    // Fallback defaults for disabled runners
    const pagespeed = pagespeedRes || (await runPageSpeed(runnerOpts))
    const lighthouse = lighthouseRes || (await runLighthouse(runnerOpts))
    const accessibility = accessibilityRes || (await runAccessibility(runnerOpts))
    const seo = seoRes || (await runSEO(runnerOpts))
    const security = securityRes || (await runSecurity(runnerOpts))

    // 3. Calculate weighted composite scores
    const scores = calculateAuditScores({
      performanceScore: pagespeed.performanceScore || lighthouse.performanceScore,
      seoScore: seo.score,
      accessibilityScore: accessibility.score,
      securityScore: security.score,
      uxScore: lighthouse.bestPracticesScore,
      businessScore: 75,
      mobileScore: pagespeed.performanceScore ? pagespeed.performanceScore + 4 : 80,
    })

    // 4. Save individual reports to Supabase if DB is connected
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
          schema: null,
          robots: { hasRobotsTxt: seo.hasRobotsTxt } as unknown as Json,
          sitemap: { hasSitemapXml: seo.hasSitemapXml } as unknown as Json,
          headings: (seo.headings as unknown as Json) || null,
          links: null,
          images: { total: seo.totalImages, withoutAlt: seo.imagesWithoutAlt } as unknown as Json,
        }),
      ])

      await auditRepo.updateStatus(auditId, 'completed', scores.overall, new Date().toISOString())
    } catch {
      // Continue cleanly if DB persistence fails in local dev
    }

    return {
      auditId,
      url,
      status: 'completed',
      scores,
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
