import fetch from 'node-fetch'
import { insertPagespeedReport } from '../repositories/auditRepository'

export async function runPageSpeed(auditId: string, url: string) {
  const key = process.env.GOOGLE_PAGESPEED_API_KEY
  if (!key) return { ok: false, error: 'No API key' }
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${key}`
  const res = await fetch(endpoint)
  const json = await res.json()
  const lcp = json.lighthouseResult?.audits['largest-contentful-paint']?.numericValue || null
  const cls = json.lighthouseResult?.audits['cumulative-layout-shift']?.numericValue || null
  const fcp = json.lighthouseResult?.audits['first-contentful-paint']?.numericValue || null
  const ttfb = json.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile || null

  // store
  await insertPagespeedReport(auditId, json, { lcp, cls, fcp, ttfb })
  return { ok: true, json }
}

export default { runPageSpeed }
