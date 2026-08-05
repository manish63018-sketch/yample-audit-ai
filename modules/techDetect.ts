import fetch from 'node-fetch'

export async function detectTech(url: string) {
  try {
    // Very lightweight detection via headers and simple HTML checks
    const res = await fetch(url)
    const server = res.headers.get('server')
    const body = await res.text()
    const tech: string[] = []
    if (server?.toLowerCase().includes('nginx')) tech.push('nginx')
    if (/wp-content|wp-includes/.test(body)) tech.push('wordpress')
    if (/next-js|__next/.test(body.toLowerCase())) tech.push('next.js')
    if (/wp-content/.test(body)) tech.push('php')
    // detect common analytics
    if (/googletagmanager|gtag\(|ga\(|analytics.js/.test(body)) tech.push('google-analytics')

    return { ok: true, tech }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

export default { detectTech }
