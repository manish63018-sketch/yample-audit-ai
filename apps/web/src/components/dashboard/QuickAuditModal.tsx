'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuickAuditModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickAuditModal({ isOpen, onClose }: QuickAuditModalProps) {
  const [url, setUrl] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [stage, setStage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!isOpen) return null

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsRunning(true)
    setError(null)

    // Staged progress indicators
    setStage('Connecting to target server...')
    setTimeout(() => setStage('Fetching PageSpeed & Core Web Vitals...'), 800)
    setTimeout(() => setStage('Crawling On-Page SEO & Meta hierarchy...'), 1600)
    setTimeout(() => setStage('Evaluating WCAG AA Accessibility compliance...'), 2400)
    setTimeout(() => setStage('Scanning Security Headers & SSL policy...'), 3200)

    try {
      let formattedUrl = url.trim()
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`
      }

      const res = await fetch('/api/audits/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Audit execution failed.')
      }

      setIsRunning(false)
      onClose()
      router.push(`/audits/${data.data.auditId}?url=${encodeURIComponent(formattedUrl)}`)
    } catch (err: unknown) {
      setIsRunning(false)
      setError(err instanceof Error ? err.message : 'Audit failed.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-lg font-bold text-text-primary">Run Instant Website Audit</h3>
          </div>
          {!isRunning && (
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl">
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRunAudit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Website URL</label>
            <input
              type="text"
              required
              disabled={isRunning}
              placeholder="e.g. example.com or https://stripe.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-brand focus:outline-none"
            />
          </div>

          {isRunning && (
            <div className="p-4 rounded-lg bg-surface/60 border border-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs text-text-primary">
                <span className="font-semibold">{stage}</span>
                <span className="text-brand font-mono">Running...</span>
              </div>
              <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                <div className="bg-brand h-full w-3/4 animate-pulse" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            {!isRunning && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isRunning || !url}
              className="px-5 py-2.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover disabled:opacity-50 transition-all shadow-md shadow-brand/20"
            >
              {isRunning ? 'Auditing Target...' : 'Start Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
