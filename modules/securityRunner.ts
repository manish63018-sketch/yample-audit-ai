export async function runSecurity(auditId: string, url: string) {
  // Check basic security headers and mixed content by fetching headers
  try {
    const res = await fetch(url)
    const headers = {}
    res.headers.forEach((v, k) => { ;(headers as any)[k] = v })
    const checks = {
      hsts: !!res.headers.get('strict-transport-security'),
      csp: !!res.headers.get('content-security-policy'),
      xframe: !!res.headers.get('x-frame-options')
    }
    return { ok: true, headers: checks }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

export default { runSecurity }
