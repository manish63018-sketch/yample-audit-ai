import Link from 'next/link'
import type { Metadata } from 'next'
import { AIWebsiteSimulator } from '@/components/report/AIWebsiteSimulator'
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  DollarSign,
  Rocket,
  Clock,
  Check,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sample Enterprise Growth Report | AuditAI by Yample Labs',
  description: 'See a real AuditAI business opportunity report — revenue uplift, AI website simulator, delivery timeline, and instant quote.',
}

const BIGGEST_PROBLEMS = [
  { text: "Visitors don't contact you easily (No prominent lead CTA)", impact: 'High Bounce Rate' },
  { text: 'No Automated Lead Capture System', impact: 'Lost Prospect Inquiries' },
  { text: 'No 24/7 AI Customer Support / Chat Bot', impact: 'After-Hours Drop-off' },
  { text: 'Weak Call-To-Action Above the Fold', impact: '-34% Conversion Penalty' },
  { text: 'Slow Mobile Response on Cellular Networks', impact: 'Mobile User Loss' },
  { text: 'Missing Trust Elements & Client Testimonials', impact: 'Low Conversion Authority' },
]

const BEFORE_AFTER = [
  { feature: 'Hero CTA & Value Proposition', before: '❌ Generic', after: '✅ High Converting' },
  { feature: 'Lead Contact & Intake Form', before: '❌ Basic Mailto Link', after: '✅ Smart Lead Qualifier' },
  { feature: 'Automated Booking System', before: '❌ None', after: '✅ Instant Calendar Sync' },
  { feature: '24/7 AI Customer Assistant', before: '❌ None', after: '✅ Live Voice & Chat Bot' },
  { feature: 'Search Visibility (SEO Score)', before: '60 / 100', after: '92 / 100' },
]

const TIMELINE_STEPS = [
  { day: 'Day 1', phase: 'Planning & Strategy', desc: 'Requirements, content architecture & wireframing.' },
  { day: 'Day 2', phase: 'UI/UX Design', desc: 'Custom high-converting Framer/Stripe aesthetic design.' },
  { day: 'Day 4', phase: 'Development', desc: 'Next.js 16 build, Core Web Vitals optimization.' },
  { day: 'Day 7', phase: 'Testing & QA', desc: 'Security hardening, accessibility & mobile QA.' },
  { day: 'Day 8', phase: 'Launch & Deployment', desc: 'Vercel edge deployment & Search Console submission.' },
]

const MONTHLY_ROADMAP = [
  { month: 'Month 1', title: 'Launch High-Converting Website', desc: 'Deploy redesigned sub-1.5s website with instant lead forms.' },
  { month: 'Month 2', title: 'SEO & Search Engine Growth', desc: 'Index schema tags, optimize target keywords, rank on Google.' },
  { month: 'Month 3', title: 'AI Automation & Voice Bot', desc: 'Deploy 24/7 AI assistant to qualify inquiries automatically.' },
  { month: 'Month 4', title: 'Scale Revenue & Business', desc: 'Expand content funnel, retarget leads, optimize ROI.' },
]

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold">
          <span>🔍</span> <span>AuditAI</span> <span className="text-xs text-violet-400 font-normal">by Yample Labs</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* HERO BANNER: Your Website Can Grow More */}
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Certified Enterprise Sample Report
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Your Website Can Grow More. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">Here’s Exactly How.</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              We performed an automated technical scan and AI business analysis of <span className="text-violet-300 font-mono font-semibold">yampleauditai.vercel.app</span>. Here are the exact growth bottlenecks and revenue opportunities.
            </p>
          </div>

          {/* 🟢 Website Health Indicator */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Website Health</div>
                <div className="text-lg font-black text-emerald-400">Excellent (92%)</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Your website is technically fast and secure. Improving conversion pathways, lead forms, and AI support will unlock maximum revenue.
            </p>
          </div>
        </div>

        {/* 💰 SECTION 1: REVENUE OPPORTUNITY */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Estimated Revenue Opportunity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Lost Leads</div>
              <div className="text-4xl font-black text-amber-400 my-2">148 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <div className="text-[11px] text-amber-300">Visitors leaving without inquiring</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Monthly Gain</div>
              <div className="text-4xl font-black text-emerald-400 my-2">$3,400 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <div className="text-[11px] text-emerald-300">Estimated incremental business revenue</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Growth Potential</div>
              <div className="text-4xl font-black text-violet-400 my-2">HIGH</div>
              <div className="text-[11px] text-violet-300">Based on industry conversion benchmarks</div>
            </div>
          </div>
        </div>

        {/* 🔥 SECTION 2: BIGGEST PROBLEMS (BUSINESS LANGUAGE) */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-400" /> Key Growth Bottlenecks Identified
            </h2>
            <p className="text-xs text-slate-400 mt-1">Direct business bottlenecks impacting your visitor conversion right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BIGGEST_PROBLEMS.map((prob, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{prob.text}</span>
                  <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shrink-0">
                    {prob.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🤖 SECTION 3: AI REVENUE PROJECTION */}
        <div className="glass-card p-8 rounded-3xl border border-violet-500/20 bg-violet-950/20 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <div>
              <h2 className="text-xl font-bold text-white">AI Revenue Projection Analysis</h2>
              <p className="text-xs text-slate-400">Expected improvements after redesign and AI integration.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-emerald-400">+35%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">More Leads</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-indigo-400">+18%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Faster Load Time</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-violet-400">+42%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Better Mobile UX</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-teal-400">+60%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Customer Trust</div>
            </div>
          </div>
        </div>

        {/* ⚡ SECTION 4: BEFORE / AFTER TRANSFORMATION GRID */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Before vs. Future Transformation
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Website Component</th>
                  <th className="py-3 px-4 text-red-400">Current State</th>
                  <th className="py-3 px-4 text-emerald-400">Future Redesigned State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {BEFORE_AFTER.map((row) => (
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

        {/* 🎨 SECTION 5: PROPRIETARY AI WEBSITE SIMULATOR */}
        <AIWebsiteSimulator url="yampleauditai.vercel.app" category="Enterprise Business" />

        {/* 🗓️ SECTION 6: DELIVERY TIMELINE */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" /> 8-Day Turnaround Delivery Timeline
            </h2>
            <p className="text-xs text-slate-400 mt-1">Step-by-step execution path from project kickoff to live deployment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {TIMELINE_STEPS.map((step) => (
              <div key={step.day} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                    {step.day}
                  </span>
                  <div className="text-xs font-bold text-white mt-2 mb-1">{step.phase}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📈 SECTION 7: MONTHLY BUSINESS ROADMAP */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-emerald-400" /> Month-by-Month Business Growth Roadmap
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MONTHLY_ROADMAP.map((m) => (
              <div key={m.month} className="p-5 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
                <span className="text-xs font-bold text-emerald-400 font-mono">{m.month}</span>
                <h3 className="text-sm font-bold text-white my-1">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 💰 SECTION 8: INSTANT QUOTE & MONEY SECTION */}
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Tailored Package Quotation</span>
              <h2 className="text-2xl font-black text-white mt-1">Recommended Growth Package</h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 line-through">$897 regular subtotal</div>
              <div className="text-3xl font-black text-emerald-400">$837 <span className="text-xs text-slate-400 font-normal">($60 Bundle Discount)</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs py-2 border-b border-white/5">
              <span className="font-semibold text-white">Business Website Redesign Package</span>
              <span className="font-mono text-slate-300">$599</span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-white/5">
              <span className="font-semibold text-white">24/7 AI Customer Assistant & Voice Agent</span>
              <span className="font-mono text-slate-300">$199</span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-white/5">
              <span className="font-semibold text-white">Monthly Search Engine & Keyword Setup</span>
              <span className="font-mono text-slate-300">$99</span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 text-emerald-400 font-semibold">
              <span>Bundle Discount Savings</span>
              <span>-$60</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              ⚡ 8-Day Turnaround | 100% Satisfaction Guarantee | Dedicated Project Manager
            </div>
            <Link
              href="/audit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Run Audit On Your Site <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
