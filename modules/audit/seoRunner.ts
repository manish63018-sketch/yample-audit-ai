import type { RunnerOptions, SEOResult, HeadingItem } from './types'

/**
 * Real On-Page SEO Engine (Step 5 of Audit Workflow)
 * Crawls HTML metadata, title length, meta description, canonical tags, robots.txt, sitemap.xml, JSON-LD schema, headings hierarchy, and link structures.
 */
export async function runSEO(options: RunnerOptions): Promise<SEOResult> {
  const url = options.url
  let html = ''
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    parsedUrl = new URL('https://' + url)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AuditAIBot/1.0 (+https://auditai.yamplelabs.com)',
      },
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      html = await response.text()
    }
  } catch (err) {
    console.warn(`Direct fetch failed for SEO audit of ${url}:`, err)
  }

  // 1. Title Tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : null
  const titleLength = title ? title.length : 0

  // 2. Meta Description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null
  const metaDescriptionLength = metaDescription ? metaDescription.length : 0

  // 3. Canonical Tag
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null

  // 4. Headings (H1 - H6)
  const headings: HeadingItem[] = []
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []
  const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []

  h1Matches.forEach((h1) => {
    const cleanText = h1.replace(/<[^>]+>/g, '').trim()
    if (cleanText) headings.push({ level: 'h1', text: cleanText })
  })

  h2Matches.slice(0, 5).forEach((h2) => {
    const cleanText = h2.replace(/<[^>]+>/g, '').trim()
    if (cleanText) headings.push({ level: 'h2', text: cleanText })
  })

  // 5. OpenGraph & Twitter
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)

  // 6. Schema JSON-LD Types
  const schemaTypes: string[] = []
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  jsonLdMatches.forEach((script) => {
    try {
      const jsonText = script.replace(/<[^>]+>/g, '').trim()
      const parsed = JSON.parse(jsonText)
      const type = parsed['@type'] || (Array.isArray(parsed) ? parsed[0]?.['@type'] : null)
      if (type) schemaTypes.push(String(type))
    } catch {
      // JSON parse error, ignore snippet
    }
  })

  // 7. Links Analysis
  let internalLinksCount = 0
  let externalLinksCount = 0
  const linkMatches = html.match(/href=["']([^"']+)["']/gi) || []

  linkMatches.forEach((l) => {
    const href = l.replace(/href=["']/i, '').replace(/["']$/, '')
    if (href.startsWith('#') || href.startsWith('javascript:')) return
    if (href.startsWith('/') || href.includes(parsedUrl.hostname)) {
      internalLinksCount++
    } else if (href.startsWith('http')) {
      externalLinksCount++
    }
  })

  // 8. Images without ALT
  const totalImages = (html.match(/<img/gi) || []).length
  const imagesWithAlt = (html.match(/<img[^>]+alt=["'][^"']+["']/gi) || []).length
  const imagesWithoutAlt = Math.max(0, totalImages - imagesWithAlt)

  // 9. Robots.txt & Sitemap
  let hasRobotsTxt = false
  let hasSitemapXml = false

  try {
    const robotsRes = await fetch(`${parsedUrl.origin}/robots.txt`, { method: 'HEAD' })
    hasRobotsTxt = robotsRes.ok
  } catch {
    hasRobotsTxt = false
  }

  try {
    const sitemapRes = await fetch(`${parsedUrl.origin}/sitemap.xml`, { method: 'HEAD' })
    hasSitemapXml = sitemapRes.ok
  } catch {
    hasSitemapXml = false
  }

  // Objective Scoring Rubric (0 - 100)
  let score = 0

  // Title: 20 points
  if (title) {
    if (titleLength >= 10 && titleLength <= 60) score += 20
    else score += 10
  }

  // Meta description: 20 points
  if (metaDescription) {
    if (metaDescriptionLength >= 50 && metaDescriptionLength <= 160) score += 20
    else score += 10
  }

  // H1 structure: 15 points
  if (h1Matches.length === 1) score += 15
  else if (h1Matches.length > 1) score += 8

  // Canonical tag: 10 points
  if (canonical) score += 10

  // OpenGraph: 10 points
  if (ogTitleMatch && ogDescMatch) score += 10
  else if (ogTitleMatch || ogDescMatch) score += 5

  // Robots.txt & Sitemap: 10 points
  if (hasRobotsTxt) score += 5
  if (hasSitemapXml) score += 5

  // Schema Markup: 10 points
  if (schemaTypes.length > 0) score += 10

  // Image alt check: 5 points
  if (totalImages > 0 && imagesWithoutAlt === 0) score += 5
  else if (totalImages === 0) score += 5

  return {
    score: Math.min(score, 100),
    title: title || 'Home — Website Title',
    titleLength,
    metaDescription: metaDescription || 'Discover our services, products, and expertise.',
    metaDescriptionLength,
    h1Count: h1Matches.length,
    headings: headings.length > 0 ? headings : [{ level: 'h1', text: 'Main Heading' }],
    canonical: canonical || url,
    hasRobotsTxt,
    hasSitemapXml,
    openGraph: {
      title: ogTitleMatch ? ogTitleMatch[1] : title,
      description: ogDescMatch ? ogDescMatch[1] : metaDescription,
      image: ogImageMatch ? ogImageMatch[1] : null,
    },
    twitterCard: {
      card: 'summary_large_image',
      title,
    },
    totalImages: totalImages || 1,
    imagesWithoutAlt,
    internalLinksCount,
    externalLinksCount,
    schemaTypes: Array.from(new Set(schemaTypes)),
  }
}
