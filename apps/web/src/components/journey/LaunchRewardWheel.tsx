'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import { formatCurrencyPrice } from '@/lib/pricing'
import { ShieldCheck, Tag, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const PRIZES = [
  { label: 'Free Logo', value: 0, color: '#3b82f6', emoji: '🎨', name: 'Free Professional Logo Design', origUSD: 199 },
  { label: '15% Off', value: 0.15, color: '#10b981', emoji: '🚀', name: '15% OFF Launch Special', origUSD: 189 },
  { label: 'Free SEO Schema', value: 0, color: '#a855f7', emoji: '🔍', name: 'Free SEO Schema Hardening', origUSD: 149 },
  { label: '10% Off', value: 0.10, color: '#ec4899', emoji: '🔥', name: '10% OFF Growth Overhaul', origUSD: 125 },
]

const SEGMENT_ANGLE = 360 / PRIZES.length

interface Props {
  onClose: () => void
  onRewardApplied?: (reward: any) => void
}

export function LaunchRewardWheel({ onClose, onRewardApplied }: Props) {
  const { addItem, items } = useCart()
  const { activeCurrency } = useGeo()

  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [rewardData, setRewardData] = useState<any>(null)
  const [alreadySpun, setAlreadySpun] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 1. Check server-side single spin status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        let sessionId = ''
        if (typeof window !== 'undefined') {
          sessionId = localStorage.getItem('auditai_session_id') || ''
          if (!sessionId) {
            sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
            localStorage.setItem('auditai_session_id', sessionId)
          }
        }

        const res = await fetch(`/api/rewards/status?sessionId=${sessionId}`)
        const data = await res.json()

        if (data.hasSpun && data.reward) {
          setAlreadySpun(true)
          setRewardData(data.reward)
          if (data.reward.status === 'Added to Cart' || data.reward.status === 'Applied to Order') {
            setClaimed(true)
          }

          // Compute remaining seconds from server expiry timestamp
          const expTime = new Date(data.reward.expiry_timestamp).getTime()
          const remaining = Math.max(0, Math.floor((expTime - Date.now()) / 1000))
          setTimeLeft(remaining)

          if (remaining > 0 && !data.isExpired) {
            startCountdownTimer(expTime)
          }
        }
      } catch {
        // Continue cleanly
      } finally {
        setLoadingStatus(false)
      }
    }

    checkStatus()
  }, [])

  useEffect(() => {
    drawWheel(rotation)
  }, [rotation])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startCountdownTimer = (targetTimestampMs: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((targetTimestampMs - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current)
      }
    }, 1000)
  }

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

  const spin = async () => {
    if (spinning || rewardData || alreadySpun) return
    setSpinning(true)
    setError('')

    try {
      let sessionId = localStorage.getItem('auditai_session_id') || ''
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        localStorage.setItem('auditai_session_id', sessionId)
      }

      const res = await fetch('/api/rewards/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'You have already used your promotional spin.')
        setAlreadySpun(true)
        setSpinning(false)
        return
      }

      const serverReward = data.data
      setRewardData(serverReward)
      setAlreadySpun(true)

      // Find matching wheel target index
      let targetIndex = PRIZES.findIndex(p => p.name === serverReward.reward_name)
      if (targetIndex < 0) targetIndex = 0

      const extraSpins = 6
      const targetRotation = rotation + extraSpins * 360 + (PRIZES.length - targetIndex) * SEGMENT_ANGLE

      const duration = 3000
      const start = performance.now()
      const initialRot = rotation

      const animate = (now: number) => {
        const elapsed = now - start
        const t = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - t, 4)
        const curr = initialRot + (targetRotation - initialRot) * ease
        setRotation(curr)
        drawWheel(curr)

        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          setSpinning(false)
          const expTime = new Date(serverReward.expiry_timestamp).getTime()
          const remaining = Math.max(0, Math.floor((expTime - Date.now()) / 1000))
          setTimeLeft(remaining)
          startCountdownTimer(expTime)
        }
      }

      requestAnimationFrame(animate)
    } catch {
      setError('Connection error during spin. Please try again.')
      setSpinning(false)
    }
  }

  // 2. Claim Reward & Create Real Cart Item
  const claimRewardAndAddToCart = () => {
    if (!rewardData) return

    const origUSD = rewardData.original_value || 199
    const rewardItemName = rewardData.reward_name || 'Free Professional Logo Design'

    addItem({
      id: rewardData.id,
      name: rewardItemName,
      price: 0, // Customer price 100% Free
      originalPrice: origUSD,
      quantity: 1,
      timeline: 'Included',
      benefits: ['100% Promotional Discount', `Original Value: ${formatCurrencyPrice(origUSD, activeCurrency.code)}`],
      category: 'Promotional Reward',
      description: `Official Promotional Reward (${rewardData.id}). Original Value: ${formatCurrencyPrice(origUSD, activeCurrency.code)} (100% Discount).`,
      isReward: true,
      rewardId: rewardData.id,
    })

    setClaimed(true)

    if (onRewardApplied) {
      onRewardApplied(rewardData)
    }

    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={!rewardData ? onClose : undefined}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">✕</button>

        {loadingStatus ? (
          <div className="py-12 text-center text-xs text-slate-400">Verifying promotional spin status...</div>
        ) : alreadySpun && (!rewardData || claimed) ? (
          <div className="py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-white">Promotional Spin Used</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              You have already used your promotional spin for this session. Your claimed reward item is saved in your order details.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg"
            >
              Continue to Order →
            </button>
          </div>
        ) : !rewardData ? (
          <>
            <div className="text-xl font-extrabold text-white mb-1 flex items-center justify-center gap-1.5">
              <span>🎰 Launch Reward Wheel</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Spin to win a free branding package or bundle discount!</p>

            <div className="relative flex justify-center mb-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-violet-400 text-sm font-bold">▼</div>
              <canvas ref={canvasRef} width={220} height={220} className="rounded-full" />
            </div>

            {error && <p className="text-red-400 text-xs font-semibold mb-3">{error}</p>}

            <button
              onClick={spin}
              disabled={spinning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-xs hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
            >
              {spinning ? '🌀 Spinning Wheel...' : '🎯 SPIN NOW!'}
            </button>
          </>
        ) : claimed ? (
          <div className="py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">Reward Claimed!</h3>
            <p className="text-xs text-emerald-300 font-semibold">{rewardData.reward_name} added to your cart!</p>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-xs">
              View Cart &amp; Continue →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-3xl">🎉</div>
            <div>
              <div className="text-xs text-violet-400 font-bold uppercase tracking-wider">Congratulations! You Won</div>
              <h3 className="text-xl font-black text-white mt-1">{rewardData.reward_name}</h3>
              <div className="text-xs text-slate-400 mt-1">
                Original Value:{' '}
                <span className="line-through text-slate-500">
                  {formatCurrencyPrice(rewardData.original_value || 199, activeCurrency.code)}
                </span>{' '}
                → <strong className="text-emerald-400 font-mono">100% FREE ($0 / ₹0)</strong>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Reward ID: <span className="text-violet-300">{rewardData.id}</span>
              </div>
            </div>

            {timeLeft > 0 ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Offer Expires In:</span>
                </div>
                <div className="font-mono font-black text-amber-300 text-sm">{formatTime(timeLeft)}</div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold">
                ⚠️ Promotional offer countdown expired.
              </div>
            )}

            <button
              onClick={claimRewardAndAddToCart}
              disabled={timeLeft <= 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-500/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Claim Reward &amp; Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
