'use client'

import { useState, useEffect, useRef } from 'react'

const PRIZES = [
  { label: '5% Off', value: 0.05, color: '#6366f1', emoji: '🎁' },
  { label: '10% Off', value: 0.10, color: '#8b5cf6', emoji: '🔥' },
  { label: 'Free SEO Report', value: 0, color: '#a855f7', emoji: '🔍', bonus: 'Free SEO Report' },
  { label: '7% Off', value: 0.07, color: '#ec4899', emoji: '💜' },
  { label: 'Free Logo', value: 0, color: '#3b82f6', emoji: '🎨', bonus: 'Free Logo Design' },
  { label: '15% Off', value: 0.15, color: '#10b981', emoji: '🚀' },
  { label: '3% Off', value: 0.03, color: '#f59e0b', emoji: '✨' },
  { label: '12% Off', value: 0.12, color: '#ef4444', emoji: '🎯' },
]

const SEGMENT_ANGLE = 360 / PRIZES.length

interface Props {
  onClose: () => void
  onReward: (amount: number, label: string) => void
  cartTotal: number
}

export function LaunchRewardWheel({ onClose, onReward, cartTotal }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [applied, setApplied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    drawWheel(rotation)
  }, [rotation])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const drawWheel = (rot: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = cx - 8

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    PRIZES.forEach((prize, i) => {
      const startAngle = (rot + i * SEGMENT_ANGLE - 90) * (Math.PI / 180)
      const endAngle = (rot + (i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180)

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = prize.color + '33'
      ctx.fill()
      ctx.strokeStyle = prize.color + '66'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((startAngle + endAngle) / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px system-ui'
      ctx.fillText(prize.label, r - 10, 4)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#0d0d14'
    ctx.fill()
    ctx.strokeStyle = '#6366f133'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('🎰', cx, cy + 5)
  }

  const spin = () => {
    if (spinning || result) return
    setSpinning(true)

    const winIndex = Math.floor(Math.random() * PRIZES.length)
    const extra = 5 + Math.random() * 5  // 5-10 full spins
    const targetRotation = rotation + extra * 360 + (PRIZES.length - winIndex) * SEGMENT_ANGLE

    let current = rotation
    const target = targetRotation
    const duration = 3000
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      const curr = rotation + (target - rotation) * ease
      setRotation(curr)
      drawWheel(curr)
      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        setResult(PRIZES[winIndex])
        startTimer()
      }
    }
    requestAnimationFrame(animate)
  }

  const startTimer = () => {
    setTimeLeft(900) // 15 minutes
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const applyReward = () => {
    if (!result) return
    const discountAmount = result.value > 0 ? Math.round(cartTotal * result.value) : 0
    const label = result.bonus ?? result.label
    onReward(discountAmount, label)
    setApplied(true)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={!result ? onClose : undefined}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">✕</button>

        {!result ? (
          <>
            <div className="text-2xl font-bold text-white mb-1">🎰 Launch Reward</div>
            <p className="text-white/40 text-sm mb-5">Spin the wheel for an exclusive discount!</p>
            <div className="relative flex justify-center mb-4">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-xl">▼</div>
              <canvas ref={canvasRef} width={220} height={220} className="rounded-full" />
            </div>
            <button
              onClick={spin}
              disabled={spinning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
            >
              {spinning ? '🌀 Spinning...' : '🎯 SPIN NOW!'}
            </button>
          </>
        ) : applied ? (
          <>
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Reward Applied!</h3>
            <p className="text-white/50 text-sm mb-4">{result.label} has been added to your cart.</p>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity">
              Continue →
            </button>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">{result.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-1">You Won!</h3>
            <div className="text-3xl font-bold mb-3" style={{ color: result.color }}>{result.label}</div>
            {result.value > 0 && (
              <div className="text-sm text-white/40 mb-4">
                That's ${Math.round(cartTotal * result.value)} off your order
              </div>
            )}
            {timeLeft > 0 && (
              <div className="mb-5 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-xs text-yellow-400 mb-1">⏱️ Offer expires in</div>
                <div className="text-2xl font-bold text-yellow-300 font-mono">{formatTime(timeLeft)}</div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={applyReward}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
              >
                Apply Discount ✓
              </button>
              <button onClick={onClose} className="px-4 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/60 transition-colors text-sm">
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
