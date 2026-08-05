// Placeholder: Lighthouse should run in isolated Chrome environment (Docker)
export async function runLighthouse(auditId: string, url: string) {
  // For production run Lighthouse inside a container and POST results back
  return { ok: false, error: 'Lighthouse runner not implemented in this environment' }
}

export default { runLighthouse }
