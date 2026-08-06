'use client'

import { useState, useRef, useEffect } from 'react'
import { useGeo, CURRENCIES, SupportedCurrency } from '@/context/GeoContext'

export function CurrencyToggle() {
  const { geo, activeCurrency, setCurrency } = useGeo()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // India users: just show ₹ badge, no toggle
  if (geo.isIndia) {
    return (
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/70">
        <span>🇮🇳</span>
        <span>₹ INR</span>
      </div>
    )
  }

  const available: SupportedCurrency[] = ['USD', 'EUR', 'GBP']

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all text-sm font-medium text-white/80 hover:text-white"
        aria-label="Change currency"
        id="currency-toggle-btn"
      >
        <span>{activeCurrency.flag}</span>
        <span>{activeCurrency.symbol} {activeCurrency.code}</span>
        <svg
          className={`w-3 h-3 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {available.map(code => {
            const c = CURRENCIES[code]
            const isActive = activeCurrency.code === code
            return (
              <button
                key={code}
                onClick={() => { setCurrency(code); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold leading-none">{c.symbol} {c.code}</span>
                  <span className="text-[10px] text-white/40 mt-0.5">{c.label}</span>
                </div>
                {isActive && (
                  <svg className="w-3 h-3 ml-auto text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
