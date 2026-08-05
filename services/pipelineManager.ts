import auditRepository from '../repositories/auditRepository'
import { runUrlValidation } from '../modules/urlValidation'
import { runDnsCheck } from '../modules/dnsCheck'
import { runSslCheck } from '../modules/sslCheck'
import { takeScreenshot } from '../modules/screenshot'
import { detectTech } from '../modules/techDetect'
import pagespeedRunner from '../modules/pagespeedRunner'
import lighthouseRunner from '../modules/lighthouseRunner'
import accessibilityRunner from '../modules/accessibilityRunner'
import seoRunner from '../modules/seoRunner'
import securityRunner from '../modules/securityRunner'
import businessAnalysis from '../modules/businessAnalysis'
import competitorAnalysis from '../modules/competitorAnalysis'
import aiAnalysis from '../modules/aiAnalysis'
import promptEngine from './promptEngine'
import aiBestPractices from './aiBestPractices'
import scoring from '../modules/scoring'

export async function processAudit(auditId: string, url: string) {
  await auditRepository.updateAuditStatus(auditId, 'running', { started_at: new Date().toISOString() })
  const results: any = {}

  // URL validation
  results.url = await runUrlValidation(url)

  // DNS
  try { results.dns = await runDnsCheck(new URL(url).hostname) } catch (e) { results.dns = { ok: false } }

  // SSL
  try { results.ssl = await runSslCheck(new URL(url).hostname) } catch (e) { results.ssl = { ok: false } }

  // Screenshot
  try { const screenshot = await takeScreenshot(url); results.screenshot = true; await auditRepository.insertReport('screenshots', auditId, { filename: `screenshots/${auditId}.jpg`, blob: null }) } catch (e) { results.screenshot = false }

  // Tech detect
  results.tech = await detectTech(url)

  // PageSpeed
  results.pagespeed = await pagespeedRunner.runPageSpeed(auditId, url)

  // Lighthouse
  results.lighthouse = await lighthouseRunner.runLighthouse(auditId, url)

  // Accessibility
  results.accessibility = await accessibilityRunner.runAccessibility(auditId, url)

  // SEO
  results.seo = await seoRunner.runSeo(auditId, url)

  // Security
  results.security = await securityRunner.runSecurity(auditId, url)

  // Business analysis
  results.business = await businessAnalysis.runBusinessAnalysis(auditId, url, results)

  // Competitors (optional)
  results.competitors = await competitorAnalysis.runCompetitorAnalysis(auditId, url)

  // AI analysis — use Best Practices wrapper, fallback to legacy AI analysis
  try {
    const prompt = promptEngine.buildPrompt('audit_prompt', { data: results })
    const bp = await aiBestPractices.runWithBestPractices('audit_prompt', prompt, { measuredData: results })
    if (bp && bp.ok) {
      results.ai = bp.parsed || bp.raw || bp
      results.ai_markdown = bp.md || null
    } else {
      // fallback
      results.ai = await aiAnalysis.runAIAnalysis(auditId, results)
    }
  } catch (e) {
    results.ai = await aiAnalysis.runAIAnalysis(auditId, results)
  }

  // Scoring
  results.score = scoring.computeScores({ performance: results.pagespeed?.json?.lighthouseResult?.categories?.performance, accessibility: results.accessibility, seo: results.seo, security: results.security, ux: null, business: results.business, mobile: null })

  // Persist aggregated report
  await auditRepository.insertReport('audits', auditId, results)

  await auditRepository.updateAuditStatus(auditId, 'completed', { finished_at: new Date().toISOString(), overall_score: results.score.overall || null })
  return results
}

export default { processAudit }
