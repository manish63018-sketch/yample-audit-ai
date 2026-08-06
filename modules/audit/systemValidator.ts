import type { SystemValidationResult } from './types'

/**
 * System Validation Engine (Step 2 of Audit Workflow)
 * Performs pre-flight checks: reachability, SSL, redirects, robots.txt, sitemap.xml, CMS & tech detection.
 */
export async function validateSystem(url: string): Promise<SystemValidationResult> {
  const redirectChain: string[] = []
  let reachable = false
  let httpStatus = 0
  let sslAvailable = false
  let hasRobotsTxt = false
  let hasSitemapXml = false
  let detectedCms: string | null = null
  const detectedTechnologies: string[] = []
  let detectedFramework: string | null = null
  let serverHeader: string | null = null

  const parsed = new URL(url)
  const origin = parsed.origin

  // 1. Check reachability & redirects
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'AuditAIBot/1.0 (+https://auditai.yamplelabs.com)',
      },
    })
    clearTimeout(timeout)

    reachable = res.ok || (res.status >= 200 && res.status < 400)
    httpStatus = res.status
    sslAvailable = res.url.startsWith('https://')
    if (res.url !== url) {
      redirectChain.push(url, res.url)
    }

    serverHeader = res.headers.get('server')
    if (serverHeader) detectedTechnologies.push(`Server: ${serverHeader}`)

    const poweredBy = res.headers.get('x-powered-by')
    if (poweredBy) detectedTechnologies.push(`Powered-By: ${poweredBy}`)

    const html = await res.text()

    // CMS & Framework Detection
    if (/wp-content|wp-includes|wordpress/i.test(html)) {
      detectedCms = 'WordPress'
      detectedTechnologies.push('WordPress')
    } else if (/Shopify\.theme|cdn\.shopify\.com/i.test(html)) {
      detectedCms = 'Shopify'
      detectedTechnologies.push('Shopify')
    } else if (/wix\.com|wix-code/i.test(html)) {
      detectedCms = 'Wix'
      detectedTechnologies.push('Wix')
    } else if (/squarespace\.com/i.test(html)) {
      detectedCms = 'Squarespace'
      detectedTechnologies.push('Squarespace')
    } else if (/webflow/i.test(html)) {
      detectedCms = 'Webflow'
      detectedTechnologies.push('Webflow')
    }

    if (/__NEXT_DATA__|next\/static/i.test(html)) {
      detectedFramework = 'Next.js'
      detectedTechnologies.push('Next.js', 'React')
    } else if (/react|react-dom/i.test(html)) {
      detectedFramework = 'React'
      detectedTechnologies.push('React')
    } else if (/vue|__vue__/i.test(html)) {
      detectedFramework = 'Vue.js'
      detectedTechnologies.push('Vue.js')
    } else if (/ng-version|angular/i.test(html)) {
      detectedFramework = 'Angular'
      detectedTechnologies.push('Angular')
    }

    if (/google-analytics|gtag|ga\(/i.test(html)) {
      detectedTechnologies.push('Google Analytics')
    }
    if (/googletagmanager/i.test(html)) {
      detectedTechnologies.push('Google Tag Manager')
    }
    if (/tailwindcss/i.test(html)) {
      detectedTechnologies.push('Tailwind CSS')
    }
    if (/bootstrap/i.test(html)) {
      detectedTechnologies.push('Bootstrap')
    }
  } catch (err) {
    console.warn(`System validation reachability check failed for ${url}:`, err)
  }

  // 2. Check robots.txt
  try {
    const robotsRes = await fetch(`${origin}/robots.txt`, { method: 'HEAD' })
    hasRobotsTxt = robotsRes.ok
  } catch {
    hasRobotsTxt = false
  }

  // 3. Check sitemap.xml
  try {
    const sitemapRes = await fetch(`${origin}/sitemap.xml`, { method: 'HEAD' })
    hasSitemapXml = sitemapRes.ok
  } catch {
    hasSitemapXml = false
  }

  return {
    reachable,
    httpStatus,
    sslAvailable,
    redirectChain,
    hasRobotsTxt,
    hasSitemapXml,
    detectedCms,
    detectedTechnologies: Array.from(new Set(detectedTechnologies)),
    detectedFramework,
    serverHeader,
  }
}
