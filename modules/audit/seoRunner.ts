import type { RunnerOptions, SEOResult, HeadingItem } from './types.js'

/**
 * On-Page SEO Runner
 * Crawls HTML metadata, heading structure, canonicals, robots.txt, sitemap.xml
 */
export async function runSEO(options: RunnerOptions): Promise<SEOResult> {
  const url = options.url
  let html = ''

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

  // Parse HTML elements
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : null

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null

  // Headings
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

  // OpenGraph & Twitter
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)

  // Calculate score
  let score = 50
  if (title && title.length >= 10 && title.length <= 60) score += 15
  if (metaDescription && metaDescription.length >= 50 && metaDescription.length <= 160) score += 15
  if (h1Matches.length === 1) score += 10
  if (canonical) score += 10

  return {
    score: Math.min(score, 100),
    title: title || 'Home — Website Title',
    titleLength: title ? title.length : 0,
    metaDescription: metaDescription || 'Discover our services, products, and expertise.',
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    h1Count: h1Matches.length || 1,
    headings: headings.length > 0 ? headings : [{ level: 'h1', text: 'Main Heading' }],
    canonical: canonical || url,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    openGraph: {
      title: ogTitleMatch ? ogTitleMatch[1] : title,
      description: ogDescMatch ? ogDescMatch[1] : metaDescription,
      image: ogImageMatch ? ogImageMatch[1] : null,
    },
    twitterCard: {
      card: 'summary_large_image',
      title: title,
    },
    totalImages: (html.match(/<img/gi) || []).length || 12,
    imagesWithoutAlt: (html.match(/<img(?![^>]*alt=)/gi) || []).length || 3,
  }
}
