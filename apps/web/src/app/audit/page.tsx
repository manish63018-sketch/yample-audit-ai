'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGeo } from '@/context/GeoContext'

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
  const { geo } = useGeo()
  const isIndia = geo.isIndia

  // Helper to extract clean target domain from any pasted or query string URL
  const extractCleanDomain = (inputUrl: string): string => {
    let raw = inputUrl.trim()
    if (!raw) return ''

    try {
      const full = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
      const parsed = new URL(full)

      // If a nested report URL was pasted (e.g. /report/demo-...?url=https://target.com)
      const nested = parsed.searchParams.get('url')
      if (nested) {
        return extractCleanDomain(nested)
      }

      // Return clean origin or hostname
      return parsed.hostname ? `https://${parsed.hostname}` : full
    } catch {
      return raw
    }
  }

  const rawSearchUrl = searchParams ? searchParams.get('url') || '' : ''
  const initialUrl = extractCleanDomain(rawSearchUrl)

  const [url, setUrl] = useState(initialUrl)
  const [businessCategory, setBusinessCategory] = useState('General Business')
  const [country, setCountry] = useState(isIndia ? 'IN' : 'US')
  const [businessGoal, setBusinessGoal] = useState('More Leads')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const raw = url.trim()
    if (!raw) {
      setError('Please enter a website URL.')
      return
    }

    const cleanUrl = extractCleanDomain(raw)

    try {
      new URL(cleanUrl)
    } catch {
      setError('Please enter a valid URL (e.g. yoursite.com)')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/audits/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl, businessCategory, country, businessGoal }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error?.message || 'Failed to start audit. Please try again.')
        setIsSubmitting(false)
        return
      }

      const auditId = data.auditId

      // Save audit metadata to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`audit_meta_${auditId}`, JSON.stringify({
          url: data.url || cleanUrl,
          businessCategory,
          country,
          businessGoal,
        }))
      }

      // Redirect to the loading screen
      router.push(`/audit/${auditId}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setIsSubmitting(false)
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
        <div className="w-full max-w-2xl text-center">
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Enterprise AI Website Audit &amp; Business Intelligence — Free
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Turn Your Website Into A
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Revenue Machine
              </span>
            </h1>
            <p className="text-white/50 mb-8 text-base max-w-lg mx-auto">
              Real technical audit (Lighthouse, SEO, Security, WCAG) + Gemini AI business intelligence &amp; growth roadmap.
            </p>

            {/* Form */}
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
                  onKeyDown={(e) => e.key === 'Enter' && !isSubmitting && handleSubmit()}
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
                      <option key={c} value={c}>{c}</option>
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
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                id="audit-launch-button"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting Audit...
                  </>
                ) : (
                  'Launch Enterprise Audit →'
                )}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4" id="audit-error">{error}</p>}

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Performance' },
                { label: 'SEO' },
                { label: 'Security' },
                { label: 'Accessibility' },
                { label: 'Business' },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-white/5 bg-white/3">
                  <span className="text-white/70 font-semibold">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
