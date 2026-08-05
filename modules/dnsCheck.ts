export async function runDnsCheck(hostname: string) {
  try {
    // Use built-in DNS resolver via Node 'dns' when available
    const dns = await import('dns')
    const promises = dns.promises
    const records = await promises.resolveAny(hostname).catch(() => null)
    return { ok: !!records, records }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

export default { runDnsCheck }
