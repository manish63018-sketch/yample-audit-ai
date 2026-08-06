'use client'

import { useState } from 'react'
import { Sparkles, Check, ArrowRight, Smartphone, Monitor } from 'lucide-react'

interface AIWebsiteSimulatorProps {
  url: string
  category?: string
}

export function AIWebsiteSimulator({ url, category }: AIWebsiteSimulatorProps) {
  const [view, setView] = useState<'before' | 'after'>('after')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-950/30 via-slate-900/90 to-slate-950 space-y-6">
      {/* Simulator Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-spin-slow" /> Proprietary Feature: AI Website Simulator
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            See Your Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">Before & After AI Transformation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle between your current website state and Yample Labs' redesigned AI-optimized version.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setView('before')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                view === 'before' ? 'bg-red-500/20 text-red-300 border border-red-500/30 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ❌ Current Version
            </button>
            <button
              onClick={() => setView('after')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                view === 'after'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✨ AI Improved Version
            </button>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 hidden sm:flex">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-xl text-xs ${device === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-xl text-xs ${device === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mock Browser Container */}
      <div className={`mx-auto transition-all duration-500 ${device === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
        <div className="rounded-2xl border border-white/15 bg-[#0d0d18] overflow-hidden shadow-2xl">
          {/* Browser Top Bar */}
          <div className="bg-[#151525] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="bg-black/40 px-4 py-1 rounded-lg text-slate-400 font-mono text-[11px] max-w-md w-full text-center truncate border border-white/5">
              {view === 'before' ? `https://${url}` : `https://${url} (Redesigned by Yample Labs)`}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${view === 'before' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {view === 'before' ? 'Slow & Low Lead Conversion' : 'High-Converting AI Engine'}
            </span>
          </div>

          {/* Browser Canvas Content */}
          <div className="p-6 md:p-8 space-y-6 relative min-h-[380px]">
            {view === 'before' ? (
              /* BEFORE STATE */
              <div className="space-y-6 opacity-75 grayscale-[0.3]">
                {/* Weak Hero */}
                <div className="text-center py-8 space-y-3 border-b border-white/10">
                  <div className="text-xs text-slate-400 font-mono">[Generic Header Logo]</div>
                  <h3 className="text-2xl font-bold text-slate-300">Welcome to Our Business</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">We provide quality services to customers with dedication and integrity.</p>
                  <div className="pt-2">
                    <span className="px-4 py-2 bg-slate-700 text-slate-300 rounded text-xs">Learn More</span>
                  </div>
                </div>

                {/* Missing Lead Features */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
                    <span className="text-red-400 text-xs font-bold block mb-1">❌ Contact Form</span>
                    <span className="text-[11px] text-slate-400">Basic email link only (No instant lead qualifier)</span>
                  </div>
                  <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
                    <span className="text-red-400 text-xs font-bold block mb-1">❌ 24/7 AI Assistant</span>
                    <span className="text-[11px] text-slate-400">No automated chat bot to answer after-hours inquiries</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-xs text-amber-300">
                  ⚠️ 78% of visitors leave within 5 seconds due to missing clear CTA and slow mobile speed.
                </div>
              </div>
            ) : (
              /* AFTER STATE - HIGH CONVERSION YAMPLE LABS DESIGN */
              <div className="space-y-6 animate-fade-in">
                {/* Redesigned Hero */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-slate-900 border border-violet-500/30 overflow-hidden">
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    ✨ High Conversion Layout
                  </div>
                  <div className="space-y-3 max-w-xl">
                    <span className="text-[11px] font-extrabold text-violet-300 uppercase tracking-widest">
                      {category || 'Enterprise Business'} Solution
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight">
                      Grow Your Revenue With <span className="text-emerald-400">Automated Lead Capture</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instant project calculator, sub-1.5s Core Web Vitals, 24/7 AI Customer Assistant, and verified social proof.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                        Get Started Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10">
                        View Interactive Demo
                      </button>
                    </div>
                  </div>
                </div>

                {/* High Converting Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Instant Lead Qualifier</div>
                      <div className="text-[10px] text-slate-400">Captures phone, budget & requirement</div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">24/7 AI Customer Assistant</div>
                      <div className="text-[10px] text-slate-400">Responds to FAQs and books calls</div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Sub-1.5s Speed Engine</div>
                      <div className="text-[10px] text-slate-400">96+ Lighthouse Core Web Vitals</div>
                    </div>
                  </div>
                </div>

                {/* Simulated Floating AI Chat Widget */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-violet-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span><strong>AI Assistant Active:</strong> "Hello! Ready to increase your business leads by 35%?"</span>
                  </div>
                  <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded font-mono">Live Widget</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
