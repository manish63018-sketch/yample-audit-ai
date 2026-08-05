import tls from 'tls'

export async function runSslCheck(hostname: string) {
  return new Promise((resolve) => {
    try {
      const socket = tls.connect(443, hostname, { servername: hostname }, () => {
        const cert = socket.getPeerCertificate()
        const valid = !!cert && !!cert.valid_to
        socket.end()
        resolve({ ok: valid, cert })
      })
      socket.on('error', (err) => resolve({ ok: false, error: (err as Error).message }))
    } catch (err: any) {
      resolve({ ok: false, error: err.message })
    }
  })
}

export default { runSslCheck }
