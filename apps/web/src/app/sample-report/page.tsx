import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sample Report',
  description: 'See a real AuditAI report — full website audit with scores, issues, AI recommendations, and business growth analysis.',
}

const SCORES = [
  { label: 'Performance', score: 72, color: '#f59e0b', grade: 'Needs Work', icon: '⚡' },
  { label: 'SEO', score: 64, color: '#f59e0b', grade: 'Needs Work', icon: '🔍' },
  { label: 'Accessibility', score: 58, color: '#ef4444', grade: 'Poor', icon: '♿' },
  { label: 'Security', score: 81, color: '#10b981', grade: 'Good', icon: '🛡️' },
  { label: 'Business', score: 45, color: '#ef4444', grade: 'Poor', icon: '📈' },
]

const ISSUES = [
  { sev: 'critical', icon: '🔴', cat: 'Performance', title: 'Largest Contentful Paint is 4.8s (should be < 2.5s)', impact: 'HIGH: 34% higher bounce rate', fix: 'Optimize hero image, enable CDN caching, use next/image with priority.' },
  { sev: 'critical', icon: '🔴', cat: 'SEO', title: 'Missing meta descriptions on 8 pages', impact: 'HIGH: 30% fewer SERP clicks', fix: 'Add unique 150–160 character meta descriptions to every page.' },
  { sev: 'critical', icon: '🔴', cat: 'Business', title: 'No call-to-action visible above the fold', impact: 'HIGH: 40% visitor drop-off', fix: 'Add a prominent CTA button in hero section, visible without scrolling.' },
  { sev: 'critical', icon: '🔴', cat: 'Accessibility', title: 'No skip navigation link for keyboard users', impact: 'HIGH: WCAG 2.4.1 Fail', fix: 'Add <a href="#main-content"> skip link as first focusable element.' },
  { sev: 'warning', icon: '🟡', cat: 'Accessibility', title: 'Color contrast ratio 2.4:1 (WCAG requires 4.5:1)', impact: 'MED: WCAG 1.4.3 Fail', fix: 'Darken text color or lighten background on navigation elements.' },
  { sev: 'warning', icon: '🟡', cat: 'Security', title: 'Content-Security-Policy header missing', impact: 'MED: XSS attack surface', fix: 'Configure CSP header in Next.js middleware or server config.' },
  { sev: 'warning', icon: '🟡', cat: 'Performance', title: 'Render-blocking JavaScript (3 scripts, 1.2s delay)', impact: 'MED: TTFB penalty', fix: 'Add defer attribute to non-critical scripts, split bundles.' },
  { sev: 'info', icon: 'ℹ️', cat: 'SEO', title: 'Missing alt text on 12 images', impact: 'LOW: SEO & accessibility', fix: 'Add descriptive alt attributes to all <img> elements.' },
  { sev: 'info', icon: 'ℹ️', cat: 'Performance', title: 'No service worker / PWA capabilities', impact: 'LOW: Mobile UX gap', fix: 'Implement next-pwa or Workbox for offline support and install prompt.' },
]

const RECOMMENDATIONS = [
  { priority: 1, title: 'Website Upgrade Package', desc: 'Fix all Critical Core Web Vitals, SEO structure, accessibility violations, and security headers in one comprehensive sprint.', service: 'Website Upgrade', price: 599, timeline: '7 days', match: 95 },
  { priority: 2, title: 'AI Customer Assistant', desc: 'Deploy an AI chatbot trained on your business to capture leads 24/7, answer FAQs, and qualify prospects automatically.', service: 'AI Automation', price: 500, timeline: '7 days', match: 88 },
  { priority: 3, title: 'Monthly SEO Package', desc: 'Ongoing keyword tracking, competitor monitoring, monthly content strategy, and Google Search Console reporting.', service: 'Monthly SEO', price: 200, timeline: 'Monthly', match: 79 },
]

export default function SampleReportPage() {
  const overallScore = Math.round(SCORES.reduce((s, i) => s + i.score, 0) / SCORES.length)

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <span>🔍</span>
          <span className="font-semibold text-sm">AuditAI by Yample Labs</span>
        </Link>
        <div className="flex gap-3">
          <a
            href="/sample-report.pdf"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all"
          >
            ⬇️ Download PDF
          </a>
          <Link href="/audit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Audit My Site →
          </Link>
        </div>
      </div>

      {/* Report body */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Cover / Summary ── */}
        <div className="rounded-2xl border border-white/8 bg-[#0d0d14] overflow-hidden mb-6 shadow-xl">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500" />
          <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
            {/* Overall score ring */}
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                <circle
                  cx="48" cy="48" r="38"
                  stroke="#f59e0b"
                  strokeWidth="10" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - overallScore / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400">{overallScore}</span>
                <span className="text-[9px] text-white/30">Overall</span>
              </div>
            </div>
            {/* Title */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">Website Audit Report</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">Sample</span>
              </div>
              <div className="text-sm text-white/40 mb-3">example-website.com • Audited August 2025 • by Yample Labs</div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/15">🔴 4 Critical Issues</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-300 border border-yellow-500/15">🟡 3 Warnings</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/15">ℹ️ 2 Info Items</span>
              </div>
            </div>
            {/* Category scores */}
            <div className="grid grid-cols-5 gap-3 shrink-0">
              {SCORES.map(s => (
                <div key={s.label} className="flex flex-col items-center gap-1.5">
                  <span className="text-base">{s.icon}</span>
                  <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.score}</div>
                  <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
                  </div>
                  <div className="text-[8px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Executive Summary ── */}
        <div className="rounded-2xl border border-white/5 bg-white/2 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-3">📋 Executive Summary</h2>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            This website has an overall health score of <span className="text-yellow-400 font-semibold">{overallScore}/100</span>, placing it in the <span className="text-yellow-400 font-semibold">Needs Improvement</span> category. Critical issues in Performance and Business Growth are directly impacting visitor experience and conversion rates.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { metric: 'Est. Bounce Rate', value: '68%', note: 'Industry avg: 45%', color: '#ef4444' },
              { metric: 'Conv. Rate Est.', value: '1.2%', note: 'Industry avg: 3-4%', color: '#ef4444' },
              { metric: 'Revenue Opportunity', value: '+$3,200/mo', note: 'If score reaches 85', color: '#10b981' },
            ].map(m => (
              <div key={m.metric} className="p-3 rounded-xl bg-white/3 border border-white/5 text-center">
                <div className="text-2xl font-bold mb-0.5" style={{ color: m.color }}>{m.value}</div>
                <div className="text-xs text-white/50 mb-0.5">{m.metric}</div>
                <div className="text-[10px] text-white/25">{m.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Issues Found ── */}
        <div className="rounded-2xl border border-white/5 bg-white/2 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">⚠️ Issues Found</h2>
          <div className="space-y-3">
            {ISSUES.map((issue, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  issue.sev === 'critical' ? 'border-red-500/15 bg-red-500/5'
                  : issue.sev === 'warning' ? 'border-yellow-500/15 bg-yellow-500/5'
                  : 'border-white/5 bg-white/2'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0">{issue.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        issue.sev === 'critical' ? 'bg-red-500/15 text-red-300'
                        : issue.sev === 'warning' ? 'bg-yellow-500/15 text-yellow-300'
                        : 'bg-blue-500/15 text-blue-300'
                      }`}>{issue.cat}</span>
                      <span className="text-[10px] text-white/25">{issue.impact}</span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{issue.title}</div>
                    <div className="text-xs text-green-400">✓ Fix: {issue.fix}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Recommendations ── */}
        <div className="rounded-2xl border border-violet-500/10 bg-violet-500/5 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">🤖 AI Recommendations</h2>
          <div className="space-y-4">
            {RECOMMENDATIONS.map(rec => (
              <div key={rec.priority} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center text-sm font-bold shrink-0">
                  {rec.priority}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white text-sm">{rec.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">{rec.match}% match</span>
                  </div>
                  <p className="text-xs text-white/50 mb-2 leading-relaxed">{rec.desc}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-violet-300">${rec.price}{rec.timeline === 'Monthly' ? '/mo' : ''}</span>
                    <span className="text-xs text-white/30">·</span>
                    <span className="text-xs text-white/30">Timeline: {rec.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="rounded-2xl border border-white/5 bg-white/2 p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Ready to fix your website?</h2>
          <p className="text-white/40 text-sm mb-6">Run a free audit on your actual website and get a personalized report like this one — in 60 seconds.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/audit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20">
              🚀 Audit My Website — It&apos;s Free
            </Link>
            <Link href="/calculator" className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all">
              🧮 Calculate Project Cost
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-4 text-xs text-white/30">
            <span>📧 yamplelabs@gmail.com</span>
            <span>📸 @yamplelabs</span>
            <span>💬 @mannish_2323</span>
          </div>
        </div>
      </div>
    </div>
  )
}
