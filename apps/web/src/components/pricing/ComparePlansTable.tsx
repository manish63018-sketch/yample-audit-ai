'use client'

import { Check, X, Sparkles } from 'lucide-react'

const COMPARISON_ROWS = [
  { name: 'Custom Website', starter: '✓', business: '✓', pro: '✓', growth: '✓', managed: '✓' },
  { name: 'Responsive Design', starter: '✓', business: '✓', pro: '✓', growth: '✓', managed: '✓' },
  { name: 'UI / UX Design', starter: 'Basic', business: 'Advanced', pro: 'Advanced', growth: 'Custom', managed: 'Premium Custom' },
  { name: 'Included Pages', starter: 'Up to 4', business: 'Up to 7', pro: 'Up to 10', growth: 'Custom Scope', managed: 'Custom Scope' },
  { name: 'Custom Domain', starter: '1 Year', business: '1 Year', pro: '1 Year', growth: '1 Year', managed: '4 Years' },
  { name: 'Business Email', starter: '1 Year', business: '1 Year', pro: '1 Year', growth: '1 Year', managed: '4 Years' },
  { name: 'Hosting Setup', starter: '✓', business: '✓', pro: '✓', growth: '✓', managed: 'Included' },
  { name: 'SEO Foundation', starter: 'Basic', business: 'Improved', pro: 'Advanced', growth: 'Advanced', managed: 'Basic' },
  { name: 'Analytics & Tracking', starter: '—', business: '✓', pro: '✓', growth: '✓', managed: '✓' },
  { name: 'Database Integration', starter: '—', business: '—', pro: 'Optional', growth: 'Optional', managed: 'Optional' },
  { name: 'Admin Panel', starter: '—', business: '—', pro: 'Optional', growth: 'Optional', managed: 'Optional' },
  { name: 'Advanced Features', starter: '—', business: 'Optional', pro: '✓', growth: '✓', managed: '✓' },
  { name: 'Full Code Ownership', starter: '✓', business: '✓', pro: '✓', growth: '✓', managed: '✓' },
  { name: 'Support & Management', starter: 'Basic', business: 'Basic', pro: 'Priority', growth: 'Priority', managed: '12 Months Managed' },
  { name: 'After Year 1 Rate', starter: '—', business: '—', pro: '—', growth: '—', managed: '$100 / month' },
  { name: 'Next Project Benefit', starter: '—', business: '—', pro: '—', growth: '—', managed: '40% OFF' },
]

export function ComparePlansTable() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-3 sm:px-6">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Full Feature Matrix
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
          Compare All Website &amp; Management Plans
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Transparent, fixed pricing with full asset ownership and zero hidden fees.
        </p>
        <div className="block sm:hidden text-[10px] text-violet-400 font-medium pt-1">
          ← Swipe horizontally to compare all 5 packages →
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0B1120]/90 backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider sticky left-0 bg-[#0F172A] z-20 shadow-[2px_0_8px_rgba(0,0,0,0.4)] w-1/4">
                Feature / Capability
              </th>
              <th className="p-3 sm:p-4 text-center text-[11px] sm:text-xs font-bold text-slate-300">
                <div className="text-xs sm:text-sm text-white font-black">Starter</div>
                <div className="text-emerald-400 font-extrabold text-sm sm:text-base mt-0.5">₹15,000</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-normal">Essential</div>
              </th>
              <th className="p-3 sm:p-4 text-center text-[11px] sm:text-xs font-bold text-slate-300">
                <div className="text-xs sm:text-sm text-white font-black">Business</div>
                <div className="text-emerald-400 font-extrabold text-sm sm:text-base mt-0.5">₹25,000</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-normal">Growing</div>
              </th>
              <th className="p-3 sm:p-4 text-center text-[11px] sm:text-xs font-bold text-violet-300 bg-violet-500/10 border-x border-violet-500/20">
                <div className="inline-block px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[8px] sm:text-[9px] uppercase font-black mb-0.5">
                  ⭐ Popular
                </div>
                <div className="text-xs sm:text-sm text-white font-black">Business Pro</div>
                <div className="text-violet-300 font-extrabold text-sm sm:text-base mt-0.5">₹45,000</div>
                <div className="text-[9px] sm:text-[10px] text-violet-200/60 font-normal">Advanced</div>
              </th>
              <th className="p-3 sm:p-4 text-center text-[11px] sm:text-xs font-bold text-slate-300">
                <div className="text-xs sm:text-sm text-white font-black">Growth</div>
                <div className="text-blue-400 font-extrabold text-sm sm:text-base mt-0.5">₹75,000+</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-normal">Custom System</div>
              </th>
              <th className="p-3 sm:p-4 text-center text-[11px] sm:text-xs font-bold text-amber-300 bg-amber-500/10 border-l border-amber-500/30">
                <div className="inline-block px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[8px] sm:text-[9px] uppercase font-black mb-0.5">
                  🌎 Managed
                </div>
                <div className="text-xs sm:text-sm text-white font-black">Managed Plan</div>
                <div className="text-amber-300 font-extrabold text-sm sm:text-base mt-0.5">$4,999 USD</div>
                <div className="text-[9px] sm:text-[10px] text-amber-200/70 font-normal">1-Yr Dev Partner</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px] sm:text-xs">
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.name} className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}>
                <td className="p-3 sm:p-4 font-semibold text-slate-200 sticky left-0 bg-[#0F172A] z-20 shadow-[2px_0_8px_rgba(0,0,0,0.4)]">
                  {row.name}
                </td>
                <td className="p-3 sm:p-4 text-center text-slate-300 font-mono">{renderVal(row.starter)}</td>
                <td className="p-3 sm:p-4 text-center text-slate-300 font-mono">{renderVal(row.business)}</td>
                <td className="p-3 sm:p-4 text-center bg-violet-500/5 border-x border-violet-500/10 font-bold text-violet-200 font-mono">
                  {renderVal(row.pro)}
                </td>
                <td className="p-3 sm:p-4 text-center text-slate-300 font-mono">{renderVal(row.growth)}</td>
                <td className="p-3 sm:p-4 text-center bg-amber-500/5 border-l border-amber-500/20 font-bold text-amber-300 font-mono">
                  {renderVal(row.managed, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderVal(val: string, isManaged = false) {
  if (val === '✓') {
    return <Check className={`h-4 w-4 mx-auto ${isManaged ? 'text-amber-400' : 'text-emerald-400'}`} />
  }
  if (val === '—') {
    return <X className="h-3.5 w-3.5 text-slate-600 mx-auto" />
  }
  return <span className="text-[10px] sm:text-[11px] font-semibold">{val}</span>
}
