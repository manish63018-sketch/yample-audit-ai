export type UrlValidationResult = {
  ok: boolean
  url: string
  finalUrl?: string
  redirects?: string[]
  robots?: boolean
  sitemap?: boolean
  error?: string
}

export async function runUrlValidation(url: string): Promise<UrlValidationResult> {
  try {
    // Basic reachability and protocol check
    const u = new URL(url)
    if (u.protocol !== 'https:') {
      return { ok: false, url, error: 'Non-HTTPS URL' }
    }

    const res = await fetch(url, { method: 'HEAD' })
    const finalUrl = res.url
    const redirects: string[] = []
    if (finalUrl !== url) redirects.push(finalUrl)

    // Check robots.txt and sitemap existence
    const robotsResp = await fetch(new URL('/robots.txt', finalUrl).toString()).catch(() => null)
    const sitemapResp = await fetch(new URL('/sitemap.xml', finalUrl).toString()).catch(() => null)

    return {
      ok: res.ok,
      url,
      finalUrl,
      redirects,
      robots: !!robotsResp && robotsResp.status === 200,
      sitemap: !!sitemapResp && sitemapResp.status === 200
    }
  } catch (err: any) {
    return { ok: false, url, error: err.message }
  }
}

export default { runUrlValidation }
