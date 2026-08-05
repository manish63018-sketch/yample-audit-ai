'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const ROADMAP_PHASES = [
  {
    phase: '30 Days',
    color: '#6366f1',
    emoji: '🚀',
    title: 'Foundation & Quick Wins',
    actions: [
      'Fix all Critical Core Web Vitals issues (LCP < 2.5s, CLS < 0.1)',
      'Implement on-page SEO: title tags, meta descriptions, heading hierarchy',
      'Fix all WCAG AA accessibility violations',
      'Enable HTTPS, HSTS, and security headers',
      'Optimize all images (WebP, lazy loading)',
    ],
    services: ['Website Upgrade'],
    investment: 599,
  },
  {
    phase: '60 Days',
    color: '#8b5cf6',
    emoji: '📈',
    title: 'Growth & Automation',
    actions: [
      'Launch AI Customer Assistant (24/7 lead qualification)',
      'Set up CRM pipeline for lead management',
      'WhatsApp automation for instant lead response',
      'Implement conversion rate optimization (CRO) on key pages',
      'Monthly SEO content strategy kickoff',
    ],
    services: ['AI Automation', 'CRM System', 'Monthly SEO'],
    investment: 1300,
  },
  {
    phase: '90 Days',
    color: '#ec4899',
    emoji: '🏆',
    title: 'Scale & Dominate',
    actions: [
      'Advanced analytics dashboard with custom KPIs',
      'Competitor gap analysis and content calendar',
      'Performance monitoring & regression alerts',
      'Conversion funnel optimization review',
      'Expansion: Mobile app or POS (based on business type)',
    ],
    services: ['Analytics Dashboard', 'Mobile App / POS'],
    investment: 850,
  },
]

const RECOMMENDED_SERVICES = [
  { id: 'website-upgrade', name: 'Website Upgrade', price: 599, timeline: '7 days', benefits: ['Performance fix', 'SEO overhaul', 'Modern design'], score: 95 },
  { id: 'ai-automation', name: 'AI Customer Assistant', price: 500, timeline: '7 days', benefits: ['24/7 support', 'Lead qualification', 'WhatsApp integration'], score: 88 },
  { id: 'crm', name: 'CRM System', price: 400, timeline: '10 days', benefits: ['Lead pipeline', 'Auto follow-up', 'Team collaboration'], score: 82 },
  { id: 'seo-monthly', name: 'Monthly SEO', price: 200, timeline: 'Monthly', benefits: ['Keyword tracking', 'Content strategy', 'Ranking growth'], score: 79 },
]

interface Props {
  url: string
  reportId: string
  onClose: () => void
}

export function GrowthRoadmapModal({ url, reportId, onClose }: Props) {
  const [generating, setGenerating] = useState(true)
  const [activePhase, setActivePhase] = useState(0)
  const [addedServices, setAddedServices] = useState<string[]>([])
  const { addItem, items } = useCart()

  useEffect(() => {
    const timer = setTimeout(() => setGenerating(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  const totalInvestment = ROADMAP_PHASES.reduce((s, p) => s + p.investment, 0)

  const handleAddService = (service: typeof RECOMMENDED_SERVICES[0]) => {
    addItem({ ...service, category: 'roadmap' })
    setAddedServices(prev => [...prev, service.id])
  }

  const handleAddAll = () => {
    RECOMMENDED_SERVICES.forEach(s => {
      if (!items.find(i => i.id === s.id)) {
        addItem({ ...s, category: 'roadmap' })
      }
    })
    setAddedServices(RECOMMENDED_SERVICES.map(s => s.id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-violet-500/20 bg-[#0d0d14] shadow-2xl my-4 animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 0 80px rgba(139,92,246,0.15)' }}
      >
        <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500" />
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors z-10">✕</button>

        <div className="p-6">
          {generating ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4 animate-spin-slow">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">Generating Your Growth Roadmap</h3>
              <p className="text-white/40 text-sm mb-6">AI is analyzing your audit results and building a personalized plan...</p>
              <div className="space-y-2 max-w-xs mx-auto text-left">
                {['Analyzing audit findings...', 'Prioritizing opportunities...', 'Calculating ROI projections...', 'Building 30-60-90 day plan...'].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/40 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                    <span className="text-violet-400">▶</span> {msg}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🗺️</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your 90-Day Growth Roadmap</h3>
                  <p className="text-xs text-white/40">Personalized for <span className="text-violet-300">{url}</span></p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-white/30">Total Investment</div>
                  <div className="text-2xl font-bold text-violet-300">${totalInvestment.toLocaleString()}</div>
                </div>
              </div>

              {/* Phase tabs */}
              <div className="flex gap-2 mb-5">
                {ROADMAP_PHASES.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhase(i)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${activePhase === i ? 'border-transparent text-white' : 'border-white/5 text-white/40 bg-white/2 hover:bg-white/5'}`}
                    style={activePhase === i ? { background: `${p.color}22`, borderColor: `${p.color}44`, color: p.color } : {}}
                  >
                    {p.emoji} {p.phase}
                  </button>
                ))}
              </div>

              {/* Active phase details */}
              {(() => {
                const p = ROADMAP_PHASES[activePhase]
                return (
                  <div className="rounded-xl border border-white/5 bg-white/2 p-5 mb-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-white">{p.title}</div>
                        <div className="text-xs text-white/40">Month {activePhase === 0 ? '1' : activePhase === 1 ? '2' : '3'} actions</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: p.color }}>${p.investment.toLocaleString()}</div>
                        <div className="text-xs text-white/30">investment</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {p.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                          <span className="mt-0.5 shrink-0" style={{ color: p.color }}>✓</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Recommended services */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-white">Recommended Services</div>
                  <button onClick={handleAddAll} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    Add All to Cart →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {RECOMMENDED_SERVICES.map(service => {
                    const isAdded = addedServices.includes(service.id) || items.some(i => i.id === service.id)
                    return (
                      <div key={service.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2">
                        <div>
                          <div className="text-xs font-medium text-white mb-0.5">{service.name}</div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${service.score}%` }} />
                            </div>
                            <span className="text-[10px] text-white/30">{service.score}% match</span>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-sm font-bold text-violet-300 mb-1">${service.price}</div>
                          <button
                            onClick={() => !isAdded && handleAddService(service)}
                            className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-all ${isAdded ? 'bg-green-500/15 text-green-300 border border-green-500/20' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30'}`}
                          >
                            {isAdded ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/cart"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-center text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
                >
                  🛒 Review Cart & Proceed
                </Link>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-white/5 text-white/40 hover:text-white/60 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-scale-in { animation: scale-in 0.25s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
      `}</style>
    </div>
  )
}
