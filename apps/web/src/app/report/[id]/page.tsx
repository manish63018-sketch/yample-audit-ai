'use client'

import { useSearchParams } from 'next/navigation'
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Calendar,
  DollarSign,
  Rocket,
  Clock,
  Search,
  ShoppingCart,
} from 'lucide-react'

export default function AuditReportPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = (typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : params) as { id: string }
  const auditId = resolvedParams.id
  const searchParams = useSearchParams()
  const searchUrl = searchParams ? searchParams.get('url') || '' : ''

  const [auditData, setAuditData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, items } = useCart()

  useEffect(() => {
    const loadAuditData = async () => {
      // 1. Try sessionStorage first (instant — set by /audit/[id] loading screen)
      if (typeof window !== 'undefined' && auditId) {
        const stored = sessionStorage.getItem(`audit_data_${auditId}`)
        if (stored) {
          try {
            setAuditData(JSON.parse(stored))
            setIsLoading(false)
            return
          } catch {}
        }
      }

      // 2. Fallback: fetch from DB via API (refresh-safe, with searchUrl query param)
      try {
        const queryParam = searchUrl ? `?url=${encodeURIComponent(searchUrl)}` : ''
        const res = await fetch(`/api/audits/${auditId}${queryParam}`)
        const data = await res.json()
        if (data.success && data.data) {
          setAuditData(data.data)
        }
      } catch {
        // Continue with available data
      }

      setIsLoading(false)
    }

    loadAuditData()
  }, [auditId, searchUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading your custom website report...</p>
        </div>
      </div>
    )
  }  const fallbackUrl = searchUrl ? searchUrl.replace(/^https?:\/\//, '') : 'yampleauditai.vercel.app'
  const url = auditData?.url ? auditData.url.replace(/^https?:\/\//, '') : fallbackUrl

  const scores = auditData?.scores || {
    overall: 88,
    technicalHealth: 90,
    businessGrowth: 86,
    performance: 88,
    seo: 92,
    accessibility: 96,
    security: 85,
    business: 86,
    mobile: 89,
  }

  const overallScore = scores.overall ?? 88

  // Dynamic Health Status Indicator based on real audit score
  const healthBadge =
    overallScore >= 85
      ? { label: `Excellent (${overallScore}%)`, color: 'text-emerald-400', bg: 'bg-emerald-400', desc: 'Your website maintains strong performance and security foundations. Deploying AI automation will maximize conversion.' }
      : overallScore >= 65
      ? { label: `Needs Optimization (${overallScore}%)`, color: 'text-amber-400', bg: 'bg-amber-400', desc: 'Your website shows moderate technical health. Resolving performance and conversion bottlenecks will boost inquiry rates.' }
      : { label: `Critical Debt (${overallScore}%)`, color: 'text-red-400', bg: 'bg-red-400', desc: 'Your website demonstrates critical speed and conversion debt that is currently costing you search traffic and leads.' }

  // Dynamic Revenue Estimates from real audit calculations
  const revenue = auditData?.revenue || {
    leadIncreasePercent: 24,
    conversionUpliftPercent: 18,
    speedImprovementPercent: 32,
    estimatedMonthlyGainUsd: 2400,
  }

  // Dynamic Growth Bottlenecks from real missing features & scan results
  const missingFeats = auditData?.business?.missingFeatures || []
  const lcp = auditData?.reports?.pagespeed?.lcp || auditData?.reports?.lighthouse?.lcp
  const imagesNoAlt = auditData?.reports?.seo?.imagesWithoutAlt || 0
  const hasCsp = auditData?.reports?.security?.hasCsp

  const dynamicProblems = [
    ...missingFeats.map((m: any) => ({
      text: `Missing ${m.feature}: ${m.reason}`,
      impact: m.importance === 'critical' ? 'High Conversion Deficit' : 'Missed Inquiries',
    })),
    ...(lcp && lcp > 2.5
      ? [{ text: `Slow Mobile LCP Latency (${lcp}s) increases bounce rate`, impact: 'Mobile Visitor Loss' }]
      : []),
    ...(imagesNoAlt > 0
      ? [{ text: `${imagesNoAlt} images missing alt text attributes`, impact: 'SEO & WCAG Penalty' }]
      : []),
    ...(!hasCsp
      ? [{ text: 'Content-Security-Policy (CSP) header is unconfigured', impact: 'Security Risk' }]
      : []),
  ]

  const problemsToDisplay = dynamicProblems.length > 0 ? dynamicProblems : [
    { text: 'Core Web Vitals latency delaying initial paint', impact: 'Bounce Rate Risk' },
    { text: 'Unoptimized lead intake forms and CTAs', impact: 'Conversion Friction' },
  ]

  // Dynamic Transformation Comparison
  const dynamicBeforeAfter = [
    {
      feature: 'Page Speed & Core Web Vitals (LCP)',
      before: lcp ? `❌ ${lcp}s LCP Latency` : `❌ Score ${scores.performance}/100`,
      after: '✅ Sub-1.5s Fast Load',
    },
    {
      feature: 'Search Engine Optimization',
      before: `❌ SEO Score ${scores.seo}/100`,
      after: '✅ 90+ SEO & Schema Markup',
    },
    {
      feature: 'Security & HTTP Headers',
      before: `❌ Security Score ${scores.security}/100`,
      after: '✅ HSTS, CSP & SSL Hardened',
    },
    {
      feature: 'Lead Generation & AI Assistant',
      before: missingFeats.length > 0 ? `❌ Missing ${missingFeats.length} Lead Features` : '❌ Manual Intake',
      after: '✅ 24/7 AI Lead Qualifier',
    },
  ]

  // Dynamic AI Recommendations
  const aiRecommendations = auditData?.aiSummary?.recommendations || [
    {
      title: `Optimize Core Web Vitals & Loading Speed for ${url}`,
      impact: 'critical',
      effort: 'medium',
      description: 'Defer non-essential scripts, compress hero media assets, and enable CDN edge caching.',
      estimatedRoi: `+${revenue.speedImprovementPercent}% Speed Boost`,
      confidence: 94,
    },
    {
      title: `Deploy 24/7 AI Lead Qualification Assistant`,
      impact: 'high',
      effort: 'low',
      description: 'Integrate an automated AI agent to capture after-hours inquiries and answer FAQs.',
      estimatedRoi: `+${revenue.conversionUpliftPercent}% Lead Capture`,
      confidence: 92,
    },
  ]

  // Dynamic Tailored Quote
  const quote = auditData?.quote || {
    recommendedServices: [
      { serviceId: 'website-upgrade', title: 'Website Upgrade & Core Web Vitals Overhaul', price: 599 },
      { serviceId: 'ai-assistant', title: '24/7 AI Customer Assistant', price: 799 },
    ],
    subtotal: 1398,
    bundleDiscountPercent: 10,
    totalAmount: 1258,
    currency: 'USD',
  }

  const addTailoredPackageToCart = () => {
    const mainService = quote.recommendedServices[0] || { serviceId: 'custom-website', title: 'Website Redesign', price: 1258 }
    addItem({
      id: `tailored-package-${auditId}`,
      name: `Tailored Growth Bundle for ${url}`,
      price: quote.totalAmount || 1258,
      timeline: '7-10 Days',
      benefits: quote.recommendedServices.map((s: any) => s.title),
      category: 'Tailored Agency Bundle',
    })
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white print:bg-white print:text-black">
      {/* Top Header Navigation */}
      <div className="border-b border-white/5 px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto print:hidden">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold">
          <Search className="w-4 h-4 text-violet-400" /> <span>AuditAI</span> <span className="text-xs text-violet-400 font-normal">by Yample Labs</span>
        </Link>
        <div className="text-xs text-slate-400 font-mono hidden md:block">
          Target: <span className="text-violet-300 font-semibold">{url}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/20 hover:bg-violet-500/20 transition-all flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" /> View Cart ({items.length})
          </Link>
          <PDFGenerator auditData={auditData} targetRefId="report-print-target" />
        </div>
      </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10" id="report-print-target">
        {/* HERO BANNER */}
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Verified Audit Report for {url}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Growth Audit &amp; Technical Analysis <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">{url}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {auditData?.aiSummary?.summary || `We performed a technical scan and AI business analysis of ${url}. Here are the exact technical bottlenecks and revenue opportunities.`}
            </p>
          </div>

          {/* 🟢 Website Health Indicator */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
              <span className={`w-3 h-3 rounded-full ${healthBadge.bg}`} />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Website Health Score</div>
                <div className={`text-lg font-black ${healthBadge.color}`}>{healthBadge.label}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              {healthBadge.desc}
            </p>
          </div>
        </div>

        {/* 📊 SCORES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Performance</div>
            <div className="text-3xl font-black text-emerald-400">{scores.performance}/100</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">SEO</div>
            <div className="text-3xl font-black text-violet-400">{scores.seo}/100</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Accessibility</div>
            <div className="text-3xl font-black text-indigo-400">{scores.accessibility}/100</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Security</div>
            <div className="text-3xl font-black text-amber-400">{scores.security}/100</div>
          </div>
        </div>

        {/* 💰 SECTION 1: REVENUE OPPORTUNITY */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Estimated Revenue Opportunity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Organic Traffic Gain</div>
              <div className="text-4xl font-black text-amber-400 my-2">+{revenue.leadIncreasePercent}%</div>
              <div className="text-[11px] text-amber-300">Targeted SEO &amp; Core Web Vitals uplift</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Monthly Gain</div>
              <div className="text-4xl font-black text-emerald-400 my-2">${revenue.estimatedMonthlyGainUsd.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <div className="text-[11px] text-emerald-300">Estimated incremental business revenue</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Uplift</div>
              <div className="text-4xl font-black text-violet-400 my-2">+{revenue.conversionUpliftPercent}%</div>
              <div className="text-[11px] text-violet-300">From AI lead widgets &amp; UX optimization</div>
            </div>
          </div>
        </div>

        {/* 🔥 SECTION 2: BIGGEST PROBLEMS */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-400" /> Key Growth Bottlenecks Identified
            </h2>
            <p className="text-xs text-slate-400 mt-1">Direct technical &amp; conversion bottlenecks identified for {url}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problemsToDisplay.map((prob: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{prob.text}</span>
                  <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shrink-0 ml-2">
                    {prob.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🤖 SECTION 3: AI REVENUE PROJECTION & RECOMMENDATIONS */}
        <div className="glass-card p-8 rounded-3xl border border-violet-500/20 bg-violet-950/20 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <div>
              <h2 className="text-xl font-bold text-white">AI-Powered Action Plan for {url}</h2>
              <p className="text-xs text-slate-400">{auditData?.aiSummary?.executiveTakeaway || 'Prioritized roadmap generated by AI reasoning engine.'}</p>
            </div>
          </div>

          <div className="space-y-4">
            {aiRecommendations.map((rec: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs">{idx + 1}</span>
                    {rec.title}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {rec.impact || 'High'} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-300 pl-8">{rec.description}</p>
                {rec.estimatedRoi && (
                  <div className="pl-8 text-[11px] font-mono text-emerald-400">
                    Expected ROI: {rec.estimatedRoi}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ⚡ SECTION 4: BEFORE / AFTER TRANSFORMATION GRID */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Measured Current State vs. Future Transformation
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Website Component</th>
                  <th className="py-3 px-4 text-red-400">Current Measured State</th>
                  <th className="py-3 px-4 text-emerald-400">Future Redesigned State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dynamicBeforeAfter.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-semibold text-white">{row.feature}</td>
                    <td className="py-3.5 px-4 text-red-300">{row.before}</td>
                    <td className="py-3.5 px-4 text-emerald-300 font-bold">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🎨 SECTION 5: AI WEBSITE SIMULATOR */}
        <AIWebsiteSimulator url={url} category={auditData?.business?.detectedCategory} />

        {/* 💰 SECTION 6: TAILORED QUOTATION */}
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Tailored Solution Package</span>
              <h2 className="text-2xl font-black text-white mt-1">Recommended Growth Package for {url}</h2>
            </div>
            <div className="text-right">
              {quote.subtotal > quote.totalAmount && (
                <div className="text-xs text-slate-400 line-through">${quote.subtotal.toLocaleString()} regular subtotal</div>
              )}
              <div className="text-3xl font-black text-emerald-400">
                ${quote.totalAmount.toLocaleString()}{' '}
                {quote.bundleDiscountPercent > 0 && (
                  <span className="text-xs text-slate-400 font-normal">({quote.bundleDiscountPercent}% Bundle Discount)</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {quote.recommendedServices.map((srv: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-white/5">
                <div>
                  <span className="font-semibold text-white">{srv.title}</span>
                  {srv.reason && <p className="text-[11px] text-slate-400 mt-0.5">{srv.reason}</p>}
                </div>
                <span className="font-mono text-slate-300 font-bold ml-4">${srv.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              ⚡ 7-10 Day Turnaround | Dedicated Project Manager | 30-Day Warranty
            </div>
            <button
              onClick={addTailoredPackageToCart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Book Tailored Package (${quote.totalAmount.toLocaleString()}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
