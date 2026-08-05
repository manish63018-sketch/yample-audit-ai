'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AIRecommendationPopup } from '@/components/journey/AIRecommendationPopup'
import { useCart } from '@/context/CartContext'

const MOCK_SCORES = {
  performance: 72,
  seo: 64,
  accessibility: 58,
  security: 81,
  business: 45,
}

const MOCK_ISSUES = [
  { severity: 'critical', category: 'Performance', title: 'Largest Contentful Paint (LCP) is 4.8s', desc: 'LCP should be under 2.5s for good user experience. This is causing a 34% bounce rate increase.', fix: 'Optimize hero image, implement lazy loading, enable CDN caching.' },
  { severity: 'critical', category: 'SEO', title: 'Missing meta descriptions on 8 pages', desc: 'Pages without meta descriptions get 30% fewer clicks in search results.', fix: 'Add unique, compelling 150-160 character meta descriptions to all pages.' },
  { severity: 'critical', category: 'Business', title: 'No clear Call-to-Action above the fold', desc: 'Users must scroll before finding a conversion point — estimated 40% drop-off.', fix: 'Add prominent CTA button in the hero section visible without scrolling.' },
  { severity: 'warning', category: 'Accessibility', title: 'Low color contrast on navigation (2.4:1 ratio)', desc: 'WCAG AA requires a minimum 4.5:1 contrast ratio for body text.', fix: 'Increase foreground color lightness or darken background color.' },
  { severity: 'warning', category: 'Security', title: 'Content Security Policy (CSP) header missing', desc: 'CSP prevents XSS attacks and data injection vulnerabilities.', fix: 'Configure CSP header in server response or Next.js config.' },
  { severity: 'warning', category: 'Performance', title: 'Render-blocking JavaScript detected', desc: '3 JavaScript files are blocking page render for 1.2 seconds.', fix: 'Add defer attribute to non-critical scripts, split code bundles.' },
  { severity: 'info', category: 'SEO', title: 'Image alt texts missing on 12 images', desc: 'Alt text improves both SEO and accessibility for visually impaired users.', fix: 'Add descriptive alt attributes to all <img> elements.' },
  { severity: 'info', category: 'Performance', title: 'No service worker / PWA capabilities', desc: 'PWA support enables offline mode and improves mobile user retention.', fix: 'Implement a service worker with next-pwa or Workbox.' },
]

const MOCK_TECHS = ['Next.js', 'React', 'Vercel', 'Cloudflare', 'Google Analytics', 'Unknown CMS']

const OVERALL = Math.round(Object.values(MOCK_SCORES).reduce((a, b) => a + b, 0) / 5)

type Tab = 'overview' | 'issues' | 'solutions' | 'business'

export default function ReportPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const url = searchParams.get('url') ?? 'yourwebsite.com'
  const [showPopup, setShowPopup] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [animatedScores, setAnimatedScores] = useState({ performance: 0, seo: 0, accessibility: 0, security: 0, business: 0 })
  const [animatedOverall, setAnimatedOverall] = useState(0)
  const { addItem, items } = useCart()

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200
      const start = performance.now()
      const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        setAnimatedScores({
          performance: Math.round(MOCK_SCORES.performance * ease),
          seo: Math.round(MOCK_SCORES.seo * ease),
          accessibility: Math.round(MOCK_SCORES.accessibility * ease),
          security: Math.round(MOCK_SCORES.security * ease),
          business: Math.round(MOCK_SCORES.business * ease),
        })
        setAnimatedOverall(Math.round(OVERALL * ease))
        if (t < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, 300)

    const popupTimer = setTimeout(() => setShowPopup(true), 3000)
    return () => { clearTimeout(timer); clearTimeout(popupTimer) }
  }, [])

  const getScoreColor = (score: number) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const getScoreLabel = (score: number) => score >= 80 ? 'Good' : score >= 60 ? 'Needs Work' : 'Poor'

  const criticalCount = MOCK_ISSUES.filter(i => i.severity === 'critical').length
  const warnCount = MOCK_ISSUES.filter(i => i.severity === 'warning').length

  const SOLUTIONS = [
    { id: 'website-upgrade', icon: '⚡', name: 'Website Upgrade', match: 95, price: 599, timeline: '7 days', benefits: ['50% faster LCP', 'All SEO fixes', 'Mobile-first redesign'], tag: '🏆 Recommended' },
    { id: 'ai-automation', icon: '🤖', name: 'AI Customer Assistant', match: 88, price: 500, timeline: '7 days', benefits: ['24/7 lead capture', 'Instant response', 'WhatsApp integration'], tag: null },
    { id: 'crm', icon: '📋', name: 'CRM System', match: 82, price: 400, timeline: '10 days', benefits: ['Lead pipeline', 'Auto follow-up', 'Conversion tracking'], tag: null },
    { id: 'seo-monthly', icon: '🔍', name: 'Monthly SEO Package', match: 79, price: 200, timeline: 'Monthly', benefits: ['Keyword growth', 'Content strategy', 'Rank tracking'], tag: null },
  ]

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <span>🔍</span> <span className="font-semibold">AuditAI</span>
        </Link>
        <div className="text-xs text-white/30 font-mono hidden md:block">
          Report for: <span className="text-violet-300">{url}</span>
        </div>
        <div className="flex gap-2">
          <Link href="/cart" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/20 hover:bg-violet-500/20 transition-all">
            🛒 View Cart ({items.length})
          </Link>
          <Link href={`/api/reports/download?id=${params.id}`} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium border border-white/10 hover:bg-white/10 transition-all">
            📄 Download PDF
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top summary bar */}
        <div className="rounded-2xl border border-white/5 bg-white/2 p-6 mb-6 flex flex-wrap items-center gap-6">
          {/* Overall score */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle
                cx="40" cy="40" r="32"
                stroke={getScoreColor(animatedOverall)}
                strokeWidth="8" fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - animatedOverall / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-lg font-bold tabular-nums" style={{ color: getScoreColor(animatedOverall) }}>{animatedOverall}</div>
              <div className="text-[9px] text-white/30">Overall</div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white mb-0.5">Website Audit Report</h1>
            <p className="text-sm text-white/40 truncate">{url}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                {criticalCount} Critical Issues
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                {warnCount} Warnings
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {MOCK_ISSUES.filter(i => i.severity === 'info').length} Info
              </span>
            </div>
          </div>

          {/* Category scores */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(animatedScores).map(([key, score]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="text-xl font-bold tabular-nums" style={{ color: getScoreColor(score) }}>{score}</div>
                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${score}%`, background: getScoreColor(score) }} />
                </div>
                <div className="text-[9px] text-white/30 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MOCK_TECHS.map(tech => (
            <span key={tech} className="text-xs px-2.5 py-1 rounded-full border border-white/5 bg-white/3 text-white/50">
              {tech}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/2 border border-white/5 rounded-xl p-1">
          {(['overview', 'issues', 'solutions', 'business'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-white/40 hover:text-white/60'}`}
            >
              {tab === 'overview' ? '📊 Overview' : tab === 'issues' ? '⚠️ Issues' : tab === 'solutions' ? '🚀 Solutions' : '📈 Business'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(animatedScores).map(([key, score]) => (
              <div key={key} className="p-5 rounded-2xl border border-white/5 bg-white/2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: getScoreColor(score) }}>{getScoreLabel(score)}</span>
                    <span className="text-xl font-bold tabular-nums" style={{ color: getScoreColor(score) }}>{score}</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: getScoreColor(score) }} />
                </div>
                <div className="mt-3 text-xs text-white/30">
                  {score < 60 ? '🔴 Immediate attention required' : score < 80 ? '🟡 Improvement recommended' : '🟢 Performing well'}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-3">
            {MOCK_ISSUES.map((issue, i) => (
              <div key={i} className={`p-4 rounded-xl border ${issue.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : issue.severity === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/5 bg-white/2'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : 'ℹ️'}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${issue.severity === 'critical' ? 'bg-red-500/15 text-red-300' : issue.severity === 'warning' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-blue-500/15 text-blue-300'}`}>{issue.category}</span>
                    </div>
                    <div className="font-medium text-sm text-white mb-1">{issue.title}</div>
                    <div className="text-xs text-white/40 mb-2">{issue.desc}</div>
                    <div className="text-xs text-green-400">✓ Fix: {issue.fix}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {SOLUTIONS.map(solution => {
              const isInCart = items.some(i => i.id === solution.id)
              return (
                <div key={solution.id} className="p-5 rounded-2xl border border-white/5 bg-white/2 hover:border-violet-500/20 transition-all">
                  {solution.tag && (
                    <div className="inline-block text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-3">
                      {solution.tag}
                    </div>
                  )}
                  <div className="text-2xl mb-2">{solution.icon}</div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-white">{solution.name}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-10 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${solution.match}%` }} />
                      </div>
                      <span className="text-xs text-white/40">{solution.match}%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {solution.benefits.map(b => (
                      <div key={b} className="text-xs text-white/50 flex items-center gap-1.5">
                        <span className="text-green-400">✓</span> {b}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-violet-300">${solution.price}</div>
                      <div className="text-xs text-white/30">{solution.timeline}</div>
                    </div>
                    <button
                      onClick={() => !isInCart && addItem({ id: solution.id, name: solution.name, price: solution.price, timeline: solution.timeline, benefits: solution.benefits, category: 'solution' })}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isInCart ? 'bg-green-500/15 text-green-300 border border-green-500/20' : 'bg-violet-600 text-white hover:opacity-90'}`}
                    >
                      {isInCart ? '✓ In Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'business' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-white mb-3">Business Growth Analysis</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { metric: 'Est. Bounce Rate', value: '68%', trend: '↑ high', color: '#ef4444' },
                  { metric: 'Conversion Rate', value: '1.2%', trend: '↓ below avg', color: '#ef4444' },
                  { metric: 'Revenue Opportunity', value: '+$3,200/mo', trend: 'if score → 85', color: '#10b981' },
                ].map(m => (
                  <div key={m.metric} className="text-center p-3 rounded-xl bg-white/3">
                    <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-xs text-white/40 mb-0.5">{m.metric}</div>
                    <div className="text-xs text-white/25">{m.trend}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/2">
              <h3 className="font-semibold text-white mb-3">Top Business Opportunities</h3>
              <div className="space-y-3">
                {['Add a clear hero CTA (estimated +12% conversion)', 'Implement live chat / AI assistant (estimated +18% lead capture)', 'Fix mobile UX issues — 60% of traffic is mobile', 'Add trust signals: reviews, certifications, case studies'].map((opp, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-yellow-400 shrink-0">★</span> {opp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Popup (3s delay) */}
      {showPopup && (
        <AIRecommendationPopup
          reportId={params.id}
          url={url}
          issueCount={MOCK_ISSUES.length}
          onDismiss={() => setShowPopup(false)}
        />
      )}
    </div>
  )
}
