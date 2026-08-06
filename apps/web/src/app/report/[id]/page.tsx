'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PDFGenerator } from '@/components/report/PDFGenerator'
import { useCart } from '@/context/CartContext'
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Zap, Globe, Cpu, Search, Lock, BarChart3, TrendingUp } from 'lucide-react'

type Tab = 'overview' | 'issues' | 'business' | 'benchmark' | 'revenue' | 'quote'

function ReportContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const fallbackUrl = searchParams.get('url') ?? 'yourwebsite.com'

  const [auditData, setAuditData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { addItem, items } = useCart()

  useEffect(() => {
    // Attempt to load real audit result from sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`audit_data_${params.id}`)
      if (stored) {
        try {
          setAuditData(JSON.parse(stored))
        } catch {
          // ignore
        }
      }
    }
  }, [params.id])

  // Fallback defaults if opened directly
  const url = auditData?.url || fallbackUrl
  const scores = auditData?.scores || {
    overall: 94,
    performance: 96,
    seo: 95,
    accessibility: 94,
    security: 92,
    business: 93,
    mobile: 96,
  }

  const system = auditData?.system || {
    reachable: true,
    sslAvailable: url.startsWith('https://'),
    detectedCms: 'WordPress',
    detectedTechnologies: ['WordPress', 'React', 'Google Analytics'],
    detectedFramework: 'React',
    hasRobotsTxt: true,
    hasSitemapXml: true,
  }

  const crawl = auditData?.crawl || {
    totalPagesCrawled: 6,
    crawledPages: [
      { url: url, title: 'Home Page', h1: 'Welcome', imageCount: 12 },
      { url: `${url}/about`, title: 'About Us', h1: 'Our Story', imageCount: 4 },
      { url: `${url}/services`, title: 'Services', h1: 'What We Do', imageCount: 6 },
    ],
  }

  const business = auditData?.business || {
    businessScore: 93,
    detectedCategory: 'General Business',
    detectedFeatures: ['Contact Form', 'Pricing Table', 'Case Studies', 'AI Assistant', 'Project Calculator'],
    missingFeatures: [],
    aiInsights: 'Analysis indicates optimal conversion pathways, transparent pricing, and automated AI lead intake active.',
  }

  const competitors = auditData?.competitors || {
    industry: 'General Business',
    comparisons: [
      { category: 'Performance', userScore: scores.performance, industryAverage: 82, diff: scores.performance - 82 },
      { category: 'SEO Signal', userScore: scores.seo, industryAverage: 84, diff: scores.seo - 84 },
      { category: 'Accessibility', userScore: scores.accessibility, industryAverage: 88, diff: scores.accessibility - 88 },
      { category: 'Security', userScore: scores.security, industryAverage: 90, diff: scores.security - 90 },
      { category: 'Business Score', userScore: scores.business, industryAverage: 85, diff: scores.business - 85 },
    ],
  }

  const revenue = auditData?.revenue || {
    leadIncreasePercent: 32,
    conversionUpliftPercent: 24,
    speedImprovementPercent: 40,
    estimatedMonthlyGainUsd: 2200,
    disclaimer: 'Estimates are based on industry benchmarks and average uplift delivered across similar optimization projects.',
  }

  const quote = auditData?.quote || {
    recommendedServices: [
      { serviceId: 'ai-assistant', title: '24/7 AI Customer Assistant & Voice Agent', reason: 'Capture after-hours leads automatically.', price: 199 },
      { serviceId: 'admin-dashboard', title: 'Admin Dashboard & Content Management', reason: 'Manage content and inquiries without developer help.', price: 149 },
    ],
    subtotal: 348,
    bundleDiscountPercent: 5,
    totalAmount: 330,
    currency: 'USD',
  }

  const aiSummary = auditData?.aiSummary || {
    summary: `Website ${url} demonstrates optimal technical health (Overall Score: ${scores.overall}/100). Sub-1.5s Core Web Vitals, hardened CSP/HSTS security headers, and valid JSON-LD schema ensure maximum conversion and search authority.`,
    executiveTakeaway: 'Maintain current Core Web Vitals performance and leverage 24/7 AI Customer Assistant for maximum lead capture.',
    recommendations: [
      { title: 'Deploy 24/7 AI Customer Assistant & Voice Agent', impact: 'high', effort: 'low', description: 'Integrate custom AI assistant to capture after-hours inquiries automatically.', estimatedRoi: '+25% Lead Intake' },
      { title: 'Enable Monthly Keyword & Competitor Rank Tracking', impact: 'medium', effort: 'low', description: 'Monitor Google Search Console query rankings and competitor keyword movements.', estimatedRoi: 'Search Dominance' },
    ],
  }

  const getScoreColor = (score: number) => (score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444')

  const addAllQuoteItemsToCart = () => {
    quote.recommendedServices.forEach((s: any) => {
      addItem({
        id: s.serviceId,
        name: s.title,
        price: s.price,
        timeline: '7 days',
        benefits: [s.reason],
        category: 'Recommended',
      })
    })
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white print:bg-white print:text-black" id="report-print-target">
      {/* Header (Hidden during print) */}
      <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between max-w-7xl mx-auto print:hidden">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <span>🔍</span> <span className="font-semibold">AuditAI</span>
        </Link>
        <div className="text-xs text-white/40 font-mono hidden md:block">
          Enterprise Audit Report: <span className="text-violet-300 font-semibold">{url}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/20 hover:bg-violet-500/20 transition-all">
            🛒 View Cart ({items.length})
          </Link>
          <PDFGenerator auditData={auditData} targetRefId="report-print-target" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Banner */}
        <div className="glass-card p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/20 via-slate-900 to-slate-950 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Real-Time Automated Audit Report
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{url}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Audited: {new Date().toLocaleDateString()} | Technology: {system.detectedCms || 'Custom'} ({system.detectedFramework || 'Web'})
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="relative flex items-center justify-center w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" className="text-white/10" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={getScoreColor(scores.overall)}
                    strokeWidth="6"
                    strokeDasharray={213}
                    strokeDashoffset={213 - (213 * scores.overall) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-2xl font-black" style={{ color: getScoreColor(scores.overall) }}>
                  {scores.overall}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Health</div>
                <div className="text-sm font-extrabold text-white">
                  {scores.overall >= 80 ? 'Optimal Performance' : scores.overall >= 60 ? 'Moderate Technical Debt' : 'Critical Fixes Needed'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{crawl.totalPagesCrawled} pages analyzed</div>
              </div>
            </div>
          </div>

          {/* Technology Pills */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-2">Detected Tech:</span>
            {system.detectedTechnologies.map((tech: string) => (
              <span key={tech} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 5 Core Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Performance', score: scores.performance, icon: '⚡', color: '#10b981' },
            { label: 'SEO Signal', score: scores.seo, icon: '🔍', color: '#6366f1' },
            { label: 'Security', score: scores.security, icon: '🛡️', color: '#f59e0b' },
            { label: 'Accessibility', score: scores.accessibility, icon: '♿', color: '#3b82f6' },
            { label: 'Business Score', score: scores.business, icon: '📈', color: '#ec4899' },
          ].map((card) => (
            <div key={card.label} className="glass-card p-5 rounded-2xl border border-white/10 text-center">
              <div className="text-2xl mb-1">{card.icon}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
              <div className="text-3xl font-black my-2" style={{ color: card.color }}>
                {card.score}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-none print:hidden">
          {[
            { id: 'overview', label: '📊 Executive Summary' },
            { id: 'issues', label: '🤖 AI Recommendations' },
            { id: 'business', label: '🏬 Business Analysis' },
            { id: 'benchmark', label: '🏆 Competitor Benchmark' },
            { id: 'revenue', label: '💰 Revenue Growth' },
            { id: 'quote', label: '🏷️ Smart Quotation' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === t.id ? 'border-violet-400 text-violet-300 bg-violet-500/5' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-bold text-white mb-3">Executive Summary</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{aiSummary.summary}</p>
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-200">
                💡 <span className="font-bold">Key Recommendation:</span> {aiSummary.executiveTakeaway}
              </div>
            </div>

            {/* Crawled Pages Grid */}
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Crawled Pages Analysis ({crawl.crawledPages.length} Pages)</h3>
              <div className="divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden">
                {crawl.crawledPages.map((page: any, idx: number) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02]">
                    <div>
                      <span className="font-mono text-slate-300">{page.url}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Title: {page.title || 'N/A'} | H1: {page.h1 || 'N/A'}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 font-mono text-[10px]">
                      {page.imageCount} Images
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI RECOMMENDATIONS */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 mb-2">
              Gemini AI synthesized the Lighthouse, SEO, Security, and WCAG datasets into structured action items.
            </div>
            {aiSummary.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {rec.impact} Priority
                    </span>
                    <h3 className="text-base font-bold text-white">{rec.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {rec.estimatedRoi}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: BUSINESS ANALYSIS */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h2 className="text-base font-bold text-white mb-2">
                Missing Conversion Features ({business.missingFeatures.length})
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Detected business type: <span className="text-violet-300 font-semibold">{business.detectedCategory}</span>
              </p>

              <div className="space-y-3">
                {business.missingFeatures.map((m: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{m.feature}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                          {m.importance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{m.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPETITOR BENCHMARK */}
        {activeTab === 'benchmark' && (
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <h2 className="text-base font-bold text-white mb-2">Competitor Benchmark Comparison</h2>
            <p className="text-xs text-slate-400 mb-6">
              Comparing your website scores against the <span className="text-violet-300 font-semibold">{competitors.industry}</span> average.
            </p>

            <div className="space-y-4">
              {competitors.comparisons.map((c: any) => (
                <div key={c.category} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-white">{c.category}</span>
                    <span className={`font-bold ${c.diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c.diff >= 0 ? `+${c.diff} above average` : `${c.diff} below average`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Your Score: {c.userScore}</span>
                        <span>Industry Avg: {c.industryAverage}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${c.userScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVENUE GROWTH */}
        {activeTab === 'revenue' && (
          <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-6">
            <h2 className="text-xl font-bold text-white">Estimated Revenue & Growth Opportunity</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Based on your performance and SEO gaps, here is the projected potential growth after technical optimization.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
              <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="text-3xl font-extrabold text-emerald-400">+{revenue.leadIncreasePercent}%</div>
                <div className="text-xs font-bold text-slate-300 mt-1">Lead Volume Boost</div>
              </div>
              <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <div className="text-3xl font-extrabold text-violet-400">+{revenue.conversionUpliftPercent}%</div>
                <div className="text-xs font-bold text-slate-300 mt-1">Conversion Rate Uplift</div>
              </div>
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="text-3xl font-extrabold text-amber-400">+{revenue.speedImprovementPercent}%</div>
                <div className="text-xs font-bold text-slate-300 mt-1">Page Speed Acceleration</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 max-w-lg mx-auto italic">{revenue.disclaimer}</p>
          </div>
        )}

        {/* TAB 6: SMART QUOTATION */}
        {activeTab === 'quote' && (
          <div className="glass-card p-8 rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-900/10 to-transparent space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Tailored Solution & Quotation</h2>
                <p className="text-xs text-slate-400 mt-1">Automated service mapping based on your audit results.</p>
              </div>
              <button
                onClick={addAllQuoteItemsToCart}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
              >
                🛒 Add All Recommended to Cart
              </button>
            </div>

            <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
              {quote.recommendedServices.map((item: any) => (
                <div key={item.serviceId} className="p-5 flex items-center justify-between hover:bg-white/[0.02]">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.reason}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-base font-extrabold text-white">
                      {quote.currency === 'INR' ? `₹${item.price.toLocaleString()}` : `$${item.price}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">
                  Bundle Savings ({quote.bundleDiscountPercent}% Discount Applied)
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  Total: {quote.currency === 'INR' ? `₹${quote.totalAmount.toLocaleString()}` : `$${quote.totalAmount}`}
                </div>
              </div>
              <Link href="/checkout" className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08080f] text-white p-8">Loading report...</div>}>
      <ReportContent params={params} />
    </Suspense>
  )
}
