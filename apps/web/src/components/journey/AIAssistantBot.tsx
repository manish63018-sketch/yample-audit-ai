'use client'

import { useState, useEffect, useRef } from 'react'

const BUDGET_OPTIONS = [
  { label: 'Under $500', value: 'budget' },
  { label: '$500 - $1,500', value: 'mid' },
  { label: '$1,500 - $3,000', value: 'pro' },
  { label: '$3,000+', value: 'enterprise' },
]

const BUSINESS_TYPES = [
  { label: 'E-Commerce', emoji: '🛒' },
  { label: 'Restaurant / Food', emoji: '🍕' },
  { label: 'Service Business', emoji: '🤝' },
  { label: 'SaaS / Tech', emoji: '💻' },
  { label: 'Healthcare', emoji: '🏥' },
]

const TIMELINE_OPTIONS = [
  { label: 'ASAP (within 1 week)', value: 'urgent' },
  { label: '2-4 weeks', value: 'normal' },
  { label: '1-2 months', value: 'flexible' },
  { label: 'Just exploring', value: 'exploring' },
]

const RECOMMENDATIONS: Record<string, { name: string; price: number; match: string }[]> = {
  budget: [
    { name: 'Website Upgrade', price: 599, match: '95%' },
    { name: 'Monthly SEO', price: 200, match: '82%' },
  ],
  mid: [
    { name: 'Website Upgrade', price: 599, match: '95%' },
    { name: 'AI Customer Assistant', price: 500, match: '88%' },
  ],
  pro: [
    { name: 'Website Upgrade', price: 599, match: '95%' },
    { name: 'AI Customer Assistant', price: 500, match: '88%' },
    { name: 'CRM System', price: 400, match: '82%' },
  ],
  enterprise: [
    { name: 'Professional Package', price: 1999, match: '99%' },
    { name: 'Mobile App', price: 800, match: '85%' },
  ],
}

type Step = 'idle' | 'greeting' | 'budget' | 'business' | 'timeline' | 'recommendation'

interface Props {
  idleSeconds?: number
}

export function AIAssistantBot({ idleSeconds = 30 }: Props) {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [budget, setBudget] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (dismissed) return
    timerRef.current = setTimeout(() => {
      setVisible(true)
      setStep('greeting')
    }, idleSeconds * 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [idleSeconds, dismissed])

  const handleNo = () => { setDismissed(true); setVisible(false) }
  const handleYes = () => { setOpen(true); setStep('budget'); setVisible(false) }
  const handleBudget = (v: string) => { setBudget(v); setStep('business') }
  const handleBusiness = () => setStep('timeline')
  const handleTimeline = () => setStep('recommendation')

  if (!visible && !open) return null

  return (
    <>
      {/* Idle popup bubble */}
      {visible && !open && (
        <div className="fixed bottom-6 right-6 z-50 w-72 animate-slide-up">
          <div className="rounded-2xl border border-violet-500/20 bg-[#0d0d14] shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(139,92,246,0.2)' }}>
            <div className="h-0.5 bg-gradient-to-r from-violet-600 to-indigo-500" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-xl shrink-0">🤖</div>
                <div>
                  <div className="text-xs font-semibold text-violet-300 mb-0.5">AI Assistant</div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Need help choosing the right package for your business?
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleYes} className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity">Yes, help me!</button>
                <button onClick={handleNo} className="flex-1 py-2 rounded-lg border border-white/10 bg-white/5 text-white/40 text-xs hover:text-white/60 transition-colors">No thanks</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-violet-500/20 bg-[#0d0d14] shadow-2xl overflow-hidden animate-slide-up" style={{ boxShadow: '0 0 40px rgba(139,92,246,0.2)' }}>
          <div className="h-0.5 bg-gradient-to-r from-violet-600 to-indigo-500" />
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-xs font-semibold text-white">AI Assistant</div>
                <div className="flex items-center gap-1 text-[10px] text-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors text-sm">✕</button>
          </div>

          <div className="p-4 min-h-[180px]">
            {step === 'budget' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm shrink-0">🤖</div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none px-3 py-2 text-xs text-white/80">
                    What&apos;s your approximate budget for this project?
                  </div>
                </div>
                <div className="space-y-2">
                  {BUDGET_OPTIONS.map(b => (
                    <button key={b.value} onClick={() => handleBudget(b.value)} className="w-full text-left text-xs px-3 py-2 rounded-lg border border-white/5 bg-white/3 text-white/60 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white transition-all">
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'business' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm shrink-0">🤖</div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none px-3 py-2 text-xs text-white/80">
                    Great! What type of business do you run?
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_TYPES.map(b => (
                    <button key={b.label} onClick={handleBusiness} className="text-xs px-2 py-2 rounded-lg border border-white/5 bg-white/3 text-white/60 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white transition-all">
                      {b.emoji} {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'timeline' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm shrink-0">🤖</div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none px-3 py-2 text-xs text-white/80">
                    Almost done! What&apos;s your ideal timeline?
                  </div>
                </div>
                <div className="space-y-2">
                  {TIMELINE_OPTIONS.map(t => (
                    <button key={t.value} onClick={handleTimeline} className="w-full text-left text-xs px-3 py-2 rounded-lg border border-white/5 bg-white/3 text-white/60 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white transition-all">
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'recommendation' && (
              <div>
                <div className="flex gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm shrink-0">🤖</div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none px-3 py-2 text-xs text-white/80">
                    Based on your answers, here&apos;s what I recommend:
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {(RECOMMENDATIONS[budget] || RECOMMENDATIONS.mid).map(r => (
                    <div key={r.name} className="flex items-center justify-between p-2 rounded-lg border border-violet-500/10 bg-violet-500/5">
                      <div>
                        <div className="text-xs font-medium text-white">{r.name}</div>
                        <div className="text-[10px] text-violet-300">{r.match} match</div>
                      </div>
                      <div className="text-xs font-bold text-white/70">${r.price}</div>
                    </div>
                  ))}
                </div>
                <a href="/audit" className="block w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold text-center hover:opacity-90 transition-opacity">
                  🚀 Start Free Audit →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
