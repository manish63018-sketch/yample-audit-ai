'use client'

import { useEffect, useState } from 'react'

const STAGES = [
  { id: 1, title: 'Website URL', icon: '🌐', subtitle: 'https://clientwebsite.com', color: '#4F8CFF' },
  { id: 2, title: 'Scanning...', icon: '⚡', subtitle: 'Analyzing Core Web Vitals & Security', color: '#8B5CF6' },
  { id: 3, title: 'Scores & Audit', icon: '📊', subtitle: 'Perf 48 → 92 | SEO 67 → 100', color: '#38BDF8' },
  { id: 4, title: 'Generating AI Report', icon: '🤖', subtitle: 'Building AI Growth Intelligence Roadmap', color: '#A855F7' },
  { id: 5, title: 'Recommendations', icon: '💡', subtitle: '4 Critical High-Impact Fixes Identified', color: '#F59E0B' },
  { id: 6, title: 'Estimated Revenue Growth', icon: '📈', subtitle: '+44% Projected Conversion Boost', color: '#22C55E' },
  { id: 7, title: 'Project Cost', icon: '🏷️', subtitle: 'Fixed Investment: $599 – $1,999', color: '#EC4899' },
  { id: 8, title: 'Order Ready', icon: '🛒', subtitle: '1-Click Project Checkout Enabled', color: '#10B981' },
]

export function HeroAnimation() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIndex(prev => (prev + 1) % STAGES.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setProgress(0)
    const pTimer = setInterval(() => {
      setProgress(p => (p < 100 ? p + 5 : 100))
    }, 100)
    return () => clearInterval(pTimer)
  }, [currentStageIndex])

  const stage = STAGES[currentStageIndex]

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Glow aura */}
      <div
        className="absolute inset-0 rounded-3xl blur-3xl opacity-30 transition-all duration-700 pointer-events-none"
        style={{ background: stage.color }}
      />

      {/* Main SaaS Dashboard Container */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Top Browser Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#050816]/90 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 mx-4 px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono truncate">https://your-website.com</span>
          </div>
          <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SCAN
          </div>
        </div>

        {/* Workflow Pipeline Header Steps */}
        <div className="px-4 py-3 bg-[#050816]/50 border-b border-white/5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {STAGES.map((s, i) => {
            const isActive = i === currentStageIndex
            const isPassed = i < currentStageIndex
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStageIndex(i)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                    : isPassed
                    ? 'text-slate-400 bg-white/5'
                    : 'text-slate-600 bg-transparent'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Stage Content Screen */}
        <div className="p-6 min-h-[280px] flex flex-col justify-between">
          {/* Active Stage Banner */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border"
                style={{ background: `${stage.color}20`, borderColor: `${stage.color}40` }}
              >
                {stage.icon}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Stage {stage.id} of 8</div>
                <div className="text-base font-bold text-white tracking-tight">{stage.title}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-300">{progress}%</span>
            </div>
          </div>

          {/* Dynamic Content Display per Stage */}
          <div className="flex-1 my-2">
            {stage.id === 1 && (
              <div className="space-y-3 animate-fade-in">
                <div className="text-xs text-slate-400">Target Website:</div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-purple-300 flex items-center justify-between">
                  <span>https://yourclientwebsite.com</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Ready</span>
                </div>
                <div className="text-[11px] text-slate-500">Pressing &apos;Analyze&apos; initiates instant AI web diagnostic...</div>
              </div>
            )}

            {stage.id === 2 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Scanning Core Web Vitals & Security...</span>
                  <span className="text-purple-400 font-mono">Analyzing...</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 transition-all duration-150" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
                    <div className="p-1.5 rounded bg-white/3">✓ LCP & CLS timing</div>
                    <div className="p-1.5 rounded bg-white/3">✓ On-Page Meta Hierarchy</div>
                    <div className="p-1.5 rounded bg-white/3">✓ SSL & Security Headers</div>
                    <div className="p-1.5 rounded bg-white/3">✓ Conversion Path Friction</div>
                  </div>
                </div>
              </div>
            )}

            {stage.id === 3 && (
              <div className="grid grid-cols-2 gap-2 animate-fade-in">
                {[
                  { name: 'Performance', before: 48, after: 92, boost: '+44' },
                  { name: 'SEO Signal', before: 67, after: 100, boost: '+33' },
                  { name: 'Accessibility', before: 71, after: 96, boost: '+25' },
                  { name: 'Business Score', before: 42, after: 89, boost: '+47' },
                ].map(s => (
                  <div key={s.name} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">{s.name}</div>
                      <div className="text-sm font-bold text-slate-300">
                        <span className="line-through text-slate-500 text-xs">{s.before}</span> → <span className="text-emerald-400">{s.after}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {s.boost}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {stage.id === 4 && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-center animate-fade-in">
                <div className="text-3xl mb-1">🤖</div>
                <div className="text-xs font-bold text-purple-200">AI Growth Intelligence Report Ready</div>
                <div className="text-[11px] text-slate-400 mt-1">Generated 18 specific code & UX optimization instructions for your engineering team.</div>
              </div>
            )}

            {stage.id === 5 && (
              <div className="space-y-1.5 animate-fade-in text-xs">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                  <span>🚀</span> <span>Accelerate LCP load speed under 1.5s</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-2">
                  <span>🎯</span> <span>Fix Hero CTA friction & add Trust signals</span>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-2">
                  <span>🤖</span> <span>Deploy 24/7 AI Lead Qualifier Assistant</span>
                </div>
              </div>
            )}

            {stage.id === 6 && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center animate-fade-in">
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Projected Impact</div>
                <div className="text-3xl font-extrabold text-white my-1">+44% Revenue Growth</div>
                <div className="text-[11px] text-slate-400">Based on standard conversion improvement metrics after full site optimization.</div>
              </div>
            )}

            {stage.id === 7 && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between animate-fade-in">
                <div>
                  <div className="text-xs text-slate-400">Fixed Package Proposal</div>
                  <div className="text-xl font-bold text-white">$599 – $1,999</div>
                  <div className="text-[10px] text-slate-400">7-Day turn-around • No hidden fees</div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                  Guaranteed ROI
                </div>
              </div>
            )}

            {stage.id === 8 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-between animate-fade-in">
                <div>
                  <div className="text-xs font-bold text-white">Ready to Transform Your Website?</div>
                  <div className="text-[11px] text-slate-400">1-Click checkout ready for instant deployment.</div>
                </div>
                <button className="btn-gradient-primary px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-purple-500/30">
                  Order Now →
                </button>
              </div>
            )}
          </div>

          {/* Progress Bar Footer */}
          <div className="pt-2 border-t border-white/5">
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${progress}%`, background: stage.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

