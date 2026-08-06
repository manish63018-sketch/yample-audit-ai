'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGeo } from '@/context/GeoContext'

const SCAN_MESSAGES = [
  '🌐 Validating website SSL, reachability & tech stack...',
  '🕷️ Crawling pages, internal links & HTML structure...',
  '⚡ Running PageSpeed Insights & Core Web Vitals...',
  '📱 Testing mobile layout & viewport configurations...',
  '🔍 Analyzing On-Page SEO, meta titles & schema tags...',
  '🛡️ Scanning Security headers (CSP, HSTS, X-Frame)...',
  '♿ Checking WCAG AA Accessibility & ARIA landmarks...',
  '📊 Analyzing industry conversion pathways & missing features...',
  '🤖 Triggering Gemini AI reasoning for recommendations...',
  '📄 Generating Smart Quotation & Revenue growth roadmap...',
]

const CATEGORIES = [
  { id: 'performance', label: 'Performance', icon: '⚡', color: '#10b981' },
  { id: 'seo', label: 'SEO', icon: '🔍', color: '#6366f1' },
  { id: 'security', label: 'Security', icon: '🛡️', color: '#f59e0b' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿', color: '#3b82f6' },
  { id: 'business', label: 'Business', icon: '📈', color: '#ec4899' },
]

const BUSINESS_CATEGORIES = [
  'General Business',
  'Restaurant / Cafe',
  'Clinic / Healthcare',
  'Gym / Fitness',
  'E-Commerce / Shop',
  'SaaS / Tech',
  'Agency / Services',
  'Portfolio / Personal',
]

const GOALS = ['More Leads', 'Increase Sales', 'Brand Authority', 'Portfolio Showcase']

function AuditFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialUrlParam = searchParams.get('url') || ''

  const { geo } = useGeo()
  const isIndia = geo.isIndia

  const [url, setUrl] = useState(initialUrlParam)
  const [businessCategory, setBusinessCategory] = useState('General Business')
  const [country, setCountry] = useState(isIndia ? 'IN' : 'US')
  const [businessGoal, setBusinessGoal] = useState('More Leads')

  const [phase, setPhase] = useState<'input' | 'scanning' | 'done'>('input')
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)
  const [activeCat, setActiveCat] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    setCountry(isIndia ? 'IN' : 'US')
  }, [isIndia])

  useEffect(() => {
    if (initialUrlParam && !url) {
      setUrl(initialUrlParam)
    }
  }, [initialUrlParam, url])

  const isValidUrl = (u: string) => {
    try {
      new URL(u.startsWith('http') ? u : `https://${u}`)
      return true
    } catch {
      return false
    }
  }

  const startAudit = async () => {
    const cleanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
    if (!isValidUrl(cleanUrl)) {
      setError('Please enter a valid website URL (e.g. yoursite.com)')
      return
    }
    setError('')
    setPhase('scanning')
    setProgress(5)
    setMessageIdx(0)
    setActiveCat(0)

    try {
      // Animate progress smoothly while waiting for API
      const progInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 92) return 92
          return p + (p < 50 ? 2.5 : p < 80 ? 1.2 : 0.4)
        })
      }, 150)

      const msgInterval = setInterval(() => {
        setMessageIdx((m) => Math.min(m + 1, SCAN_MESSAGES.length - 1))
      }, 1400)

      const catInterval = setInterval(() => {
        setActiveCat((c) => (c + 1) % CATEGORIES.length)
      }, 1000)

      // Trigger real API execution
      const res = await fetch('/api/audits/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cleanUrl,
          businessCategory,
          country,
          businessGoal,
        }),
      })

      const data = await res.json()

      clearInterval(progInterval)
      clearInterval(msgInterval)
      clearInterval(catInterval)

      if (data.success && data.data) {
        setProgress(100)
        const resultData = data.data
        const auditId = resultData.auditId || `audit-${Date.now()}`

        // Store full audit result in sessionStorage for instant report viewing
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`audit_data_${auditId}`, JSON.stringify(resultData))
        }

        setTimeout(() => {
          setPhase('done')
          setTimeout(() => {
            router.push(`/report/${auditId}?url=${encodeURIComponent(cleanUrl)}`)
          }, 800)
        }, 500)
      } else {
        setError(data.error?.message || 'Audit failed to complete. Please try again.')
        setPhase('input')
      }
    } catch (err) {
      console.error('Audit execution error:', err)
      setError('Failed to complete website audit. Please check your URL and network connection.')
      setPhase('input')
    }
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <span>🔍</span>
          <span className="font-semibold text-sm">AuditAI</span>
        </Link>
        <Link href="/sample-report" className="text-xs text-white/30 hover:text-white/60 transition-colors">
          View Sample Report
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {phase === 'input' && (
          <div className="w-full max-w-2xl text-center">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Enterprise AI Website Audit & Business Intelligence — Free
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Turn Your Website Into A
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Revenue Machine
                </span>
              </h1>
              <p className="text-white/50 mb-8 text-base max-w-lg mx-auto">
                Real technical audit (Lighthouse, SEO, Security, WCAG) + Gemini AI business intelligence & growth roadmap.
              </p>

              {/* Main Form */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-left space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      setError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && startAudit()}
                    placeholder="e.g. yourbusiness.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    id="audit-url-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Business Category
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                    >
                      {BUSINESS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="IN">🇮🇳 India (₹ INR)</option>
                      <option value="US">🇺🇸 United States ($ USD)</option>
                      <option value="GB">🇬🇧 United Kingdom ($ USD)</option>
                      <option value="AE">🇦🇪 UAE / International ($ USD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Primary Goal
                    </label>
                    <select
                      value={businessGoal}
                      onChange={(e) => setBusinessGoal(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                    >
                      {GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={startAudit}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                  🚀 Launch Enterprise Audit →
                </button>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((cat) => (
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
            {/* Spinning category indicators */}
            <div className="flex justify-center gap-3 mb-10">
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center gap-2 transition-all duration-500"
                  style={{
                    opacity: i === activeCat ? 1 : 0.25,
                    transform: i === activeCat ? 'scale(1.2)' : 'scale(0.9)',
                  }}
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

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60 font-mono text-xs text-left max-w-[80%] truncate">
                  {SCAN_MESSAGES[messageIdx]}
                </span>
                <span className="text-violet-400 font-bold font-mono">{Math.floor(progress)}%</span>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                    boxShadow: `0 0 12px rgba(99,102,241,0.5)`,
                  }}
                />
              </div>
            </div>

            <div className="text-white/30 text-xs">
              Analyzing <span className="text-violet-300 font-mono">{url}</span> ({businessCategory})
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Audit & AI Analysis Complete!</h2>
            <p className="text-white/40 text-sm">Opening your custom report...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08080f] text-white p-8">Loading audit engine...</div>}>
      <AuditFormContent />
    </Suspense>
  )
}
