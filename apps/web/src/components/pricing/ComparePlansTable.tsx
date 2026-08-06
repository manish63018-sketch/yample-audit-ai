'use client'

import { useGeo } from '@/context/GeoContext'
import { Check, X } from 'lucide-react'

const COMPARISON_FEATURES = [
  { name: 'Responsive Website (5+ Pages)', basic: true, business: true, enterprise: true },
  { name: 'Admin Management Panel', basic: true, business: true, enterprise: true },
  { name: 'AI Customer Assistant (24/7)', basic: false, business: true, enterprise: true },
  { name: 'Lead CRM System', basic: false, business: 'Optional', enterprise: true },
  { name: 'Mobile Application (iOS/Android)', basic: false, business: 'Optional', enterprise: true },
  { name: 'Booking / Scheduling System', basic: false, business: true, enterprise: true },
  { name: 'Payment Gateway Integration', basic: true, business: true, enterprise: true },
  { name: 'Performance & Speed Overhaul (90+)', basic: true, business: true, enterprise: true },
  { name: 'WCAG AA Accessibility', basic: true, business: true, enterprise: true },
  { name: 'Monthly SEO Strategy & Tracking', basic: false, business: true, enterprise: true },
  { name: 'Custom Analytics Dashboard', basic: false, business: true, enterprise: true },
  { name: 'Priority 24/7 Engineering Support', basic: false, business: true, enterprise: true },
]

export function ComparePlansTable() {
  const { formatPrice } = useGeo()

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Compare Our Growth Packages
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Choose the right stack for your business growth. Transparent pricing with zero hidden fees.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0B1120]/80 backdrop-blur-xl shadow-2xl shadow-black/50">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/3">
              <th className="p-5 text-sm font-bold text-white w-1/3">Feature / Capability</th>
              <th className="p-5 text-center text-sm font-bold text-slate-300 w-1/5">
                <div className="text-base text-white">Starter</div>
                <div className="text-violet-400 font-extrabold text-lg mt-0.5">{formatPrice(599)}</div>
                <div className="text-[10px] text-slate-400 font-normal">One-time</div>
              </th>
              <th className="p-5 text-center text-sm font-bold text-violet-300 bg-violet-500/10 border-x border-violet-500/20 w-1/5">
                <div className="inline-block px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] uppercase font-extrabold mb-1">
                  ⭐ Popular
                </div>
                <div className="text-base text-white">Business</div>
                <div className="text-violet-300 font-extrabold text-lg mt-0.5">{formatPrice(1999)}</div>
                <div className="text-[10px] text-violet-200/60 font-normal">Full AI Stack</div>
              </th>
              <th className="p-5 text-center text-sm font-bold text-slate-300 w-1/5">
                <div className="text-base text-white">Enterprise</div>
                <div className="text-indigo-400 font-extrabold text-lg mt-0.5">{formatPrice(5000)}+</div>
                <div className="text-[10px] text-slate-400 font-normal">Custom SaaS</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {COMPARISON_FEATURES.map((feat, i) => (
              <tr key={feat.name} className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/1'}>
                <td className="p-4 font-medium text-slate-200 text-xs sm:text-sm">{feat.name}</td>
                {/* Basic */}
                <td className="p-4 text-center">
                  {feat.basic === true ? (
                    <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                  ) : feat.basic === false ? (
                    <X className="h-4 w-4 text-slate-600 mx-auto" />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">{feat.basic}</span>
                  )}
                </td>
                {/* Business */}
                <td className="p-4 text-center bg-violet-500/5 border-x border-violet-500/10 font-semibold">
                  {feat.business === true ? (
                    <Check className="h-5 w-5 text-violet-400 mx-auto" />
                  ) : feat.business === false ? (
                    <X className="h-4 w-4 text-slate-600 mx-auto" />
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold">
                      {feat.business}
                    </span>
                  )}
                </td>
                {/* Enterprise */}
                <td className="p-4 text-center">
                  {feat.enterprise === true ? (
                    <Check className="h-5 w-5 text-indigo-400 mx-auto" />
                  ) : feat.enterprise === false ? (
                    <X className="h-4 w-4 text-slate-600 mx-auto" />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">{feat.enterprise}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
