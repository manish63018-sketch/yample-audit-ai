import type { CrawlResult, CrawlPageData } from './types'

/**
 * Multi-Page Website Crawler Engine (Step 3 of Audit Workflow)
 * Crawls up to 10 key pages of a site, collecting HTML metadata, headings, images, internal/external links, and schema tags.
 */
export async function crawlWebsite(baseUrl: string, maxPages = 8): Promise<CrawlResult> {
  const visited = new Set<string>()
  const discovered = new Set<string>()
  const crawledPages: CrawlPageData[] = []

  let origin = ''
  try {
    origin = new URL(baseUrl).origin
  } catch {
    return { crawledPages: [], totalPagesCrawled: 0, discoveredUrls: [] }
  }

  // Queue starts with the base URL
  const queue: string[] = [baseUrl]

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift()!
    if (visited.has(currentUrl)) continue
    visited.add(currentUrl)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 6000)

      const res = await fetch(currentUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'AuditAIBot/1.0 (+https://auditai.yamplelabs.com)',
        },
      })
      clearTimeout(timeout)

      if (!res.ok) continue
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('text/html')) continue

      const html = await res.text()

      // Title
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : null

      // H1
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
      const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null

      // Meta Description
      const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
      const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null

      // Image count
      const imageMatches = html.match(/<img[^>]+/gi) || []
      const imageCount = imageMatches.length

      // Schema check
      const hasSchema = /application\/ld\+json/i.test(html)

      // Links extraction
      const internalLinks: string[] = []
      const externalLinks: string[] = []
      const linkRegex = /href=["']([^"']+)["']/gi
      let match: RegExpExecArray | null

      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1].trim()
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue

        try {
          const absUrl = new URL(href, currentUrl).href
          if (absUrl.startsWith(origin)) {
            internalLinks.push(absUrl)
            discovered.add(absUrl)
            if (!visited.has(absUrl) && !queue.includes(absUrl) && queue.length < maxPages * 2) {
              // Priority routes
              if (/\/(about|services|contact|pricing|blog|products|portfolio)/i.test(absUrl)) {
                queue.unshift(absUrl)
              } else {
                queue.push(absUrl)
              }
            }
          } else {
            externalLinks.push(absUrl)
          }
        } catch {
          // Invalid URL pattern, skip
        }
      }

      crawledPages.push({
        url: currentUrl,
        title,
        h1,
        metaDescription,
        imageCount,
        internalLinks: Array.from(new Set(internalLinks)).slice(0, 20),
        externalLinks: Array.from(new Set(externalLinks)).slice(0, 10),
        hasSchema,
      })
    } catch {
      // Individual page crawl timeout or failure
    }
  }

  return {
    crawledPages,
    totalPagesCrawled: crawledPages.length,
    discoveredUrls: Array.from(discovered).slice(0, 50),
  }
}
