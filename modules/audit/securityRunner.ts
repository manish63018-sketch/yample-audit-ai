import type { RunnerOptions, SecurityResult, SecurityHeaderStatus } from './types.js'

/**
 * Security Audit Runner
 * Checks HTTPS, SSL, and Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
 */
export async function runSecurity(options: RunnerOptions): Promise<SecurityResult> {
  const url = options.url
  const isHttps = url.startsWith('https://')
  const headersList: SecurityHeaderStatus[] = []

  let responseHeaders: Headers | null = null

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 8000)

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    responseHeaders = response.headers
  } catch (err) {
    console.warn(`HEAD request failed for security check of ${url}:`, err)
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

  let score = 20 // Base score
  if (isHttps) score += 30
  if (hasHsts) score += 15
  if (hasCsp) score += 15
  if (hasXFrameOptions) score += 10
  if (hasXContentTypeOptions) score += 10

  return {
    score: Math.min(score, 100),
    isHttps,
    sslValid: isHttps,
    headers: headersList,
    hasCsp,
    hasHsts,
    hasXFrameOptions,
    hasXContentTypeOptions,
    hasReferrerPolicy,
  }
}
