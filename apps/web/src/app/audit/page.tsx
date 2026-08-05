'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SCAN_MESSAGES = [
  '🌐 Connecting to your website...',
  '⚡ Checking Core Web Vitals (LCP, CLS, INP)...',
  '📱 Testing mobile responsiveness...',
  '🔍 Analyzing on-page SEO signals...',
  '🖼️ Evaluating image optimization...',
  '🛡️ Scanning security headers (CSP, HSTS, X-Frame)...',
  '♿ Running WCAG AA accessibility checks...',
  '📊 Analyzing business conversion paths...',
  '🤖 Generating AI recommendations...',
  '📄 Preparing your growth roadmap...',
]

const CATEGORIES = [
  { id: 'performance', label: 'Performance', icon: '⚡', color: '#10b981' },
  { id: 'seo', label: 'SEO', icon: '🔍', color: '#6366f1' },
  { id: 'security', label: 'Security', icon: '🛡️', color: '#f59e0b' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿', color: '#3b82f6' },
  { id: 'business', label: 'Business', icon: '📈', color: '#ec4899' },
]

export default function AuditPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'input' | 'scanning' | 'done'>('input')
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)
  const [activeCat, setActiveCat] = useState(0)
  const [error, setError] = useState('')

  const isValidUrl = (u: string) => {
    try { new URL(u.startsWith('http') ? u : `https://${u}`); return true } catch { return false }
  }

  const startAudit = () => {
    const cleanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
    if (!isValidUrl(cleanUrl)) { setError('Please enter a valid website URL (e.g. yoursite.com)'); return }
    setError('')
    setPhase('scanning')
    setProgress(0)
    setMessageIdx(0)
    setActiveCat(0)
  }

  useEffect(() => {
    if (phase !== 'scanning') return

    const progInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progInterval); return 100 }
        return p + (p < 70 ? 1.2 : p < 90 ? 0.6 : 0.3)
      })
    }, 60)

    const msgInterval = setInterval(() => {
      setMessageIdx(m => Math.min(m + 1, SCAN_MESSAGES.length - 1))
    }, 1800)

    const catInterval = setInterval(() => {
      setActiveCat(c => (c + 1) % CATEGORIES.length)
    }, 1200)

    return () => { clearInterval(progInterval); clearInterval(msgInterval); clearInterval(catInterval) }
  }, [phase])

  useEffect(() => {
    if (progress >= 100 && phase === 'scanning') {
      setTimeout(() => {
        setPhase('done')
        setTimeout(() => {
          // Redirect to a mock report ID
          const mockId = 'demo-' + Date.now()
          router.push(`/report/${mockId}?url=${encodeURIComponent(url)}`)
        }, 1500)
      }, 500)
    }
  }, [progress, phase, router, url])

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <span>🔍</span>
          <span className="font-semibold text-sm">AuditAI</span>
        </Link>
        <Link href="/sample-report" className="text-xs text-white/30 hover:text-white/60 transition-colors">View Sample Report</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {phase === 'input' && (
          <div className="w-full max-w-xl text-center">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Free AI Website Audit — No signup required
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Audit Your Website
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">in 60 Seconds</span>
              </h1>
              <p className="text-white/40 mb-10 text-lg">
                AI analyzes Performance, SEO, Accessibility, Security & Business Growth — instantly.
              </p>

              <div className="flex gap-3 mb-4">
                <input
                  type="url"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && startAudit()}
                  placeholder="Enter your website URL (e.g. yoursite.com)"
                  className="flex-1 px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
                  id="audit-url-input"
                />
                <button
                  onClick={startAudit}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 whitespace-nowrap"
                >
                  Analyze →
                </button>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-white/5 bg-white/3">
                    <span>{cat.icon}</span>
                    <span className="text-white/50">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'scanning' && (
          <div className="w-full max-w-lg text-center">
            {/* AI Animation — spinning category indicators */}
            <div className="flex justify-center gap-3 mb-10">
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center gap-2 transition-all duration-500"
                  style={{ opacity: i === activeCat ? 1 : 0.25, transform: i === activeCat ? 'scale(1.2)' : 'scale(0.9)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border transition-all duration-500"
                    style={{
                      background: i === activeCat ? `${cat.color}22` : 'rgba(255,255,255,0.03)',
                      borderColor: i === activeCat ? `${cat.color}55` : 'rgba(255,255,255,0.05)',
                      boxShadow: i === activeCat ? `0 0 20px ${cat.color}33` : 'none',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-[10px] text-white/40">{cat.label}</span>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/50 font-mono text-xs">{SCAN_MESSAGES[messageIdx]}</span>
                <span className="text-violet-400 font-bold font-mono">{Math.floor(progress)}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                    boxShadow: `0 0 10px rgba(99,102,241,0.5)`,
                  }}
                />
              </div>
            </div>

            <div className="text-white/30 text-sm">
              Analyzing <span className="text-violet-300">{url}</span>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete!</h2>
            <p className="text-white/40 text-sm">Preparing your report...</p>
          </div>
        )}
      </div>
    </div>
  )
}
