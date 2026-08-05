'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6']

function Confetti() {
  const [pieces, setPieces] = useState<{ x: number; color: string; delay: number; size: number; duration: number }[]>([])

  useEffect(() => {
    setPieces(Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 2 + 2,
    })))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}

export default function ThankYouPage() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center relative overflow-hidden">
      <Confetti />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className={`relative z-10 text-center max-w-lg px-6 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Animation */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center text-5xl animate-pulse-slow shadow-2xl shadow-violet-500/20">
            🎉
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm animate-bounce">✓</div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Proposal Sent!
        </h1>
        <p className="text-white/50 text-lg mb-2">
          Thank you for choosing Yample Labs.
        </p>
        <p className="text-white/40 text-sm mb-10 leading-relaxed">
          Our team will review your project summary and contact you within <span className="text-violet-300 font-medium">24 hours</span> with a full proposal, timeline, and next steps.
        </p>

        {/* What's next */}
        <div className="rounded-2xl border border-white/5 bg-white/3 p-5 mb-8 text-left space-y-3">
          {[
            { icon: '📧', title: 'Check your inbox', desc: 'A confirmation has been sent to your email.' },
            { icon: '📞', title: 'We\'ll call within 24h', desc: 'Our team reviews every project personally.' },
            { icon: '📄', title: 'Full proposal coming', desc: 'Detailed scope, timeline & investment breakdown.' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">{s.title}</div>
                <div className="text-xs text-white/40">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <a
            href="https://instagram.com/yamplelabs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300 text-sm font-medium hover:bg-pink-500/20 transition-all"
          >
            📸 Follow @yamplelabs
          </a>
          <a
            href="mailto:yamplelabs@gmail.com"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
          >
            📧 yamplelabs@gmail.com
          </a>
        </div>

        <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
          ← Back to Home
        </Link>
      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          from { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
