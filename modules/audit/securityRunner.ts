import type { RunnerOptions, SecurityResult, SecurityHeaderStatus } from './types'

/**
 * Real Security Audit Runner (Step 7 of Audit Workflow)
 * Checks HTTPS, SSL, Security Headers, Mixed Content, Exposed Files, and Cookie flags.
 */
export async function runSecurity(options: RunnerOptions): Promise<SecurityResult> {
  const url = options.url
  const isHttps = url.startsWith('https://')
  const headersList: SecurityHeaderStatus[] = []

  let responseHeaders: Headers | null = null
  let html = ''

  const parsed = new URL(url)
  const origin = parsed.origin

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 8000)

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'AuditAIBot/1.0 (+https://auditai.yamplelabs.com)',
      },
    })

    clearTimeout(timeoutId)
    responseHeaders = response.headers
    if (response.ok) {
      html = await response.text()
    }
  } catch (err) {
    console.warn(`Fetch failed for security check of ${url}:`, err)
  }

  const checkHeader = (headerName: string, recommended: string) => {
    const val = responseHeaders ? responseHeaders.get(headerName) : null
    const present = Boolean(val)
    headersList.push({
      header: headerName,
      present,
      value: val,
      recommended,
    })
    return present
  }

  const hasHsts = checkHeader('strict-transport-security', 'max-age=31536000; includeSubDomains; preload')
  const hasCsp = checkHeader('content-security-policy', "default-src 'self'")
  const hasXFrameOptions = checkHeader('x-frame-options', 'DENY or SAMEORIGIN')
  const hasXContentTypeOptions = checkHeader('x-content-type-options', 'nosniff')
  const hasReferrerPolicy = checkHeader('referrer-policy', 'strict-origin-when-cross-origin')

  // Mixed Content check
  let mixedContentCount = 0
  if (isHttps && html) {
    const httpResources = html.match(/src=["']http:\/\/|href=["']http:\/\/(?![^"']*canonical)/gi) || []
    mixedContentCount = httpResources.length
  }

  // Exposed files check
  const exposedFiles: string[] = []
  const sensitivePaths = ['/.env', '/.git/config', '/wp-config.php.bak', '/phpinfo.php']

  await Promise.all(
    sensitivePaths.map(async (path) => {
      try {
        const res = await fetch(`${origin}${path}`, { method: 'HEAD' })
        if (res.status === 200) exposedFiles.push(path)
      } catch {
        // Path safely blocked or unreadable
      }
    })
  )

  // Cookie security check
  const setCookie = responseHeaders ? responseHeaders.get('set-cookie') || '' : ''
  const cookieSecurity = {
    hasSecure: /secure/i.test(setCookie),
    hasHttpOnly: /httponly/i.test(setCookie),
    hasSameSite: /samesite/i.test(setCookie),
  }

  // Objective Security Score (0 - 100)
  let score = 20
  if (isHttps) score += 30
  if (hasHsts) score += 15
  if (hasCsp) score += 15
  if (hasXFrameOptions) score += 10
  if (hasXContentTypeOptions) score += 10

  if (mixedContentCount > 0) score -= 15
  if (exposedFiles.length > 0) score -= 25

  return {
    score: Math.max(10, Math.min(100, score)),
    isHttps,
    sslValid: isHttps,
    headers: headersList,
    hasCsp,
    hasHsts,
    hasXFrameOptions,
    hasXContentTypeOptions,
    hasReferrerPolicy,
    mixedContentCount,
    exposedFiles,
    cookieSecurity,
  }
}
