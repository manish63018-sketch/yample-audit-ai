export async function runSeo(auditId: string, url: string) {
  // Lightweight SEO checks: fetch HTML and parse meta
  try {
    const res = await fetch(url)
    const html = await res.text()
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
    return { ok: true, meta: { title: titleMatch?.[1] || null, h1: h1Match?.[1] || null } }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

export default { runSeo }
