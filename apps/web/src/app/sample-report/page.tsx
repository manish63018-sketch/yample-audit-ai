import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle2, Zap, Search, ShieldCheck, BarChart3, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sample Audit Report | AuditAI by Yample Labs',
  description: 'See a real AuditAI enterprise report — 94+ health score, Core Web Vitals, SEO, security, accessibility, and Gemini AI business roadmap.',
}

const SCORES = [
  { label: 'Performance', score: 96, color: '#10b981', grade: 'Optimal', icon: '⚡' },
  { label: 'SEO', score: 95, color: '#10b981', grade: 'Optimal', icon: '🔍' },
  { label: 'Security', score: 92, color: '#10b981', grade: 'Optimal', icon: '🛡️' },
  { label: 'Accessibility', score: 94, color: '#10b981', grade: 'Optimal', icon: '♿' },
  { label: 'Business', score: 93, color: '#10b981', grade: 'Optimal', icon: '📈' },
]

const OPTIMIZATIONS = [
  { sev: 'passed', icon: '✅', cat: 'Performance', title: 'Core Web Vitals Optimal (LCP: 1.4s, CLS: 0.02, FCP: 0.9s)', impact: 'HIGH: Sub-1.5s instant page loading delivers maximum user retention.', fix: 'WebP image compression, CDN edge caching, and next/font swap enabled.' },
  { sev: 'passed', icon: '✅', cat: 'SEO', title: 'On-Page Meta & Schema Markup Fully Validated', impact: 'HIGH: Maximum SERP authority and Google rich snippet indexing.', fix: 'Canonical tags, OpenGraph images, and JSON-LD Organization Schema configured.' },
  { sev: 'passed', icon: '✅', cat: 'Security', title: 'HSTS & Content Security Policy (CSP) Hardened', impact: 'HIGH: Strict transport security and XSS attack prevention.', fix: 'HSTS max-age=31536000 and frame-ancestors DENY configured.' },
  { sev: 'passed', icon: '✅', cat: 'Accessibility', title: 'WCAG AA Compliant (<html lang>, ARIA Landmarks & Contrast)', impact: 'HIGH: Screen reader accessible and skip navigation enabled.', fix: 'All form controls labelled, focusable skip-links active.' },
  { sev: 'passed', icon: '✅', cat: 'Business', title: 'AI Customer Assistant & Conversion Path Active', impact: 'HIGH: 24/7 lead intake & automated project calculator enabled.', fix: 'Smart quote mapper and cart discount system integrated.' },
]

const RECOMMENDATIONS = [
  { priority: 1, title: '24/7 AI Customer Assistant & Lead Qualifier', desc: 'Deploy an automated AI chatbot trained on your business to capture inquiries after hours and answer customer questions instantly.', service: 'AI Automation', price: 199, timeline: '7 days', match: 98 },
  { priority: 2, title: 'Lead CRM & Pipeline Management', desc: 'Centralized lead management dashboard with automated email notifications, status tracking, and lead qualification.', service: 'CRM System', price: 249, timeline: '10 days', match: 92 },
  { priority: 3, title: 'Monthly SEO Strategy & Rank Tracking', desc: 'Ongoing keyword tracking, competitor monitoring, monthly content recommendations, and Search Console reporting.', service: 'Monthly SEO', price: 99, timeline: 'Monthly', match: 89 },
]

export default function SampleReportPage() {
  const overallScore = Math.round(SCORES.reduce((s, i) => s + i.score, 0) / SCORES.length)

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <span>🔍</span> <span className="font-semibold">AuditAI</span>
        </Link>
        <div className="text-xs text-slate-400 font-mono hidden md:block">
          Sample Enterprise Report: <span className="text-violet-300 font-semibold">yampleauditai.vercel.app</span>
        </div>
        <div className="flex gap-2">
          <Link href="/audit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-500/20">
            🚀 Run Audit On Your Site
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Banner with Dual Core Scores */}
        <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/20 via-slate-900 to-slate-950 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Certified High Health Score
            </div>
            <h1 className="text-3xl font-extrabold text-white">yampleauditai.vercel.app</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sample Enterprise Report | Stack: Next.js, React, Vercel, Cloudflare, Tailwind CSS
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-center p-2 border-r border-white/10 last:border-r-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">⭐ Overall Audit</div>
              <div className="text-3xl font-black text-violet-400 my-1">94<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-[10px] text-slate-400">Weighted composite</div>
            </div>

            <div className="text-center p-2 border-r border-white/10 last:border-r-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🔧 Technical Health</div>
              <div className="text-3xl font-black text-emerald-400 my-1">95<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-[10px] text-emerald-300 font-medium">Automated analysis</div>
            </div>

            <div className="text-center p-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">📈 Business Growth</div>
              <div className="text-3xl font-black text-amber-400 my-1">93<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-[10px] text-amber-300 font-medium">AI-Assisted conversion</div>
            </div>
          </div>
        </div>

        {/* 5 Core Score Cards with Confidence Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {SCORES.map((card) => (
            <div key={card.label} className="glass-card p-5 rounded-2xl border border-white/10 text-center flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{card.label}</div>
                <div className="text-3xl font-black my-2 text-emerald-400">
                  {card.score}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
              </div>
              <div className="text-[10px] font-mono py-1 px-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 mt-2">
                {card.label === 'Business' ? '🤖 AI-Assisted Insights' : '✅ High Confidence (measured)'}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Checks & Audit Results */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Automated Audit & Diagnostic Results</h2>
          <div className="space-y-3">
            {OPTIMIZATIONS.map((opt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{opt.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {opt.cat}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{opt.impact}</p>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">Solution: {opt.fix}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Roadmap & Recommendations */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">AI Revenue Growth Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDATIONS.map((rec) => (
              <div key={rec.service} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-violet-300">Priority #{rec.priority}</span>
                    <span className="text-xs font-extrabold text-emerald-400">${rec.price}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{rec.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{rec.desc}</p>
                </div>
                <Link
                  href="/audit"
                  className="w-full py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 font-semibold text-xs text-center transition-all"
                >
                  Configure For Your Business →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
