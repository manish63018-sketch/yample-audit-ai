'use client'

import { useEffect, useState } from 'react'

const PHASES = [
  { icon: '💻', label: 'Laptop opens your website...', color: '#6366f1' },
  { icon: '🌐', label: 'Website loads...', color: '#8b5cf6' },
  { icon: '🤖', label: 'AI begins scanning...', color: '#a855f7' },
  { icon: '⚠️', label: 'Issues detected...', color: '#f59e0b' },
  { icon: '📊', label: 'Report generated...', color: '#10b981' },
  { icon: '📄', label: 'Proposal prepared...', color: '#3b82f6' },
  { icon: '🎉', label: 'Client is growing!', color: '#ec4899' },
]

const SCAN_LINES = [
  'Checking Core Web Vitals...',
  'Analyzing SEO signals...',
  'Testing mobile responsiveness...',
  'Scanning security headers...',
  'Evaluating business conversion paths...',
  'Generating AI recommendations...',
]

export function HeroAnimation() {
  const [phase, setPhase] = useState(0)
  const [scanLine, setScanLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [scores, setScores] = useState([0, 0, 0, 0, 0])

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhase(p => {
        const next = (p + 1) % PHASES.length
        if (next === 2) setProgress(0)
        if (next === 4) setShowReport(true)
        return next
      })
    }, 1800)

    const scanTimer = setInterval(() => {
      setScanLine(s => (s + 1) % SCAN_LINES.length)
    }, 900)

    return () => {
      clearInterval(phaseTimer)
      clearInterval(scanTimer)
    }
  }, [])

  useEffect(() => {
    if (phase >= 2 && phase < 4) {
      const t = setInterval(() => {
        setProgress(p => Math.min(p + 3, 100))
      }, 40)
      return () => clearInterval(t)
    }
  }, [phase])

  useEffect(() => {
    if (showReport) {
      const targets = [92, 88, 95, 78, 84]
      targets.forEach((target, i) => {
        setTimeout(() => {
          setScores(prev => {
            const next = [...prev]
            next[i] = target
            return next
          })
        }, i * 150)
      })
    }
  }, [showReport])

  const current = PHASES[phase]
  const categories = ['Performance', 'SEO', 'Security', 'Accessibility', 'Business']
  const colors = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899']

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      {/* Laptop frame */}
      <div className="relative">
        {/* Screen */}
        <div
          className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0f] shadow-2xl"
          style={{
            boxShadow: `0 0 60px ${current.color}22, 0 0 120px ${current.color}11`,
            transition: 'box-shadow 0.8s ease',
          }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 bg-white/5 rounded-md h-5 mx-4 flex items-center px-3">
              <span className="text-[10px] text-white/30 font-mono">
                {phase >= 1 ? 'https://yourclient.com' : ''}
              </span>
            </div>
          </div>

          {/* Screen content */}
          <div className="h-48 md:h-64 relative overflow-hidden p-4">
            {/* Phase label */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium z-10 backdrop-blur-sm"
              style={{ background: `${current.color}22`, border: `1px solid ${current.color}44`, color: current.color, transition: 'all 0.4s ease' }}
            >
              <span>{current.icon}</span>
              <span>{current.label}</span>
            </div>

            {/* Scanning animation (phases 2-3) */}
            {phase >= 2 && phase < 4 && (
              <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col gap-1 px-4 py-2">
                {/* Scan line */}
                <div
                  className="absolute inset-x-4 h-[2px] opacity-70 transition-all duration-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${current.color}, transparent)`, top: `${progress}%` }}
                />
                {/* Live message */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="text-[11px] text-white/50 font-mono animate-pulse">
                    ▶ {SCAN_LINES[scanLine]}
                  </div>
                  <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${current.color}, #ec4899)` }}
                    />
                  </div>
                </div>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `repeating-linear-gradient(0deg, ${current.color} 0, ${current.color} 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, ${current.color} 0, ${current.color} 1px, transparent 1px, transparent 24px)` }} />
              </div>
            )}

            {/* Report preview (phases 4-6) */}
            {showReport && phase >= 4 && (
              <div className="absolute inset-x-3 top-10 bottom-2 grid grid-cols-5 gap-1.5 px-1">
                {categories.map((cat, i) => (
                  <div key={cat} className="flex flex-col items-center justify-center bg-white/3 rounded-lg border border-white/5 p-1">
                    <div className="text-[18px] font-bold tabular-nums" style={{ color: colors[i], transition: 'all 0.5s ease' }}>
                      {scores[i]}
                    </div>
                    <div className="text-[8px] text-white/40 text-center leading-tight mt-0.5">{cat}</div>
                    <div className="mt-1 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${scores[i]}%`, background: colors[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Happy client (phase 6) */}
            {phase === 6 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2 animate-bounce">🎉</div>
                  <div className="text-sm text-white/60">Business is growing!</div>
                  <div className="text-xs text-green-400 mt-1">+34% conversion increase</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Laptop base */}
        <div className="h-3 bg-[#111118] rounded-b-xl border-x border-b border-white/5 mx-4" />
        <div className="h-1.5 bg-[#0d0d12] rounded-b-2xl border-x border-b border-white/5 mx-2" />
      </div>

      {/* Floating badges */}
      <div
        className="absolute -left-8 top-1/3 px-3 py-1.5 rounded-full text-[11px] font-medium shadow-lg backdrop-blur-sm animate-float"
        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}
      >
        🔍 SEO Score: 88
      </div>
      <div
        className="absolute -right-8 top-1/4 px-3 py-1.5 rounded-full text-[11px] font-medium shadow-lg backdrop-blur-sm animate-float-delayed"
        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}
      >
        ⚡ Performance: 92
      </div>
      <div
        className="absolute -right-6 top-2/3 px-3 py-1.5 rounded-full text-[11px] font-medium shadow-lg backdrop-blur-sm animate-float"
        style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', color: '#f472b6' }}
      >
        🤖 AI Report Ready
      </div>
    </div>
  )
}
