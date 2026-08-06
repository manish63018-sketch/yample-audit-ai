'use client'

import { useEffect, useState, useCallback } from 'react'
import { useGeo } from '@/context/GeoContext'
import { useCart } from '@/context/CartContext'

const OFFER_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const OFFER_DISCOUNT_USD = 20
const STORAGE_KEY = 'auditai_intl_offer'

interface OfferState {
  startedAt: number
  applied: boolean
}

export function InternationalOfferBanner() {
  const { isInternational, formatPrice, convertPrice } = useGeo()
  const { setDiscount, setDiscountLabel, discount } = useCart()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [expired, setExpired] = useState(false)
  const [visible, setVisible] = useState(false)

  const applyDiscount = useCallback(() => {
    const discountConverted = convertPrice(OFFER_DISCOUNT_USD)
    setDiscount(discountConverted)
    setDiscountLabel('🎉 International Special Offer')
  }, [convertPrice, setDiscount, setDiscountLabel])

  // Initialize offer timer
  useEffect(() => {
    if (!isInternational) return

    const saved = sessionStorage.getItem(STORAGE_KEY)
    let startedAt: number

    if (saved) {
      const state: OfferState = JSON.parse(saved)
      startedAt = state.startedAt
      const elapsed = Date.now() - startedAt
      if (elapsed >= OFFER_DURATION_MS) {
        setExpired(true)
        return
      }
      if (state.applied && discount === 0) {
        applyDiscount()
      }
    } else {
      startedAt = Date.now()
      const offerState: OfferState = { startedAt, applied: true }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(offerState))
      applyDiscount()
    }

    setVisible(true)
    const remaining = OFFER_DURATION_MS - (Date.now() - startedAt)
    setTimeLeft(remaining)

    const interval = setInterval(() => {
      const now = Date.now()
      const left = OFFER_DURATION_MS - (now - startedAt)
      if (left <= 0) {
        setExpired(true)
        setVisible(false)
        setDiscount(0)
        setDiscountLabel('')
        clearInterval(interval)
      } else {
        setTimeLeft(left)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isInternational, applyDiscount, discount, setDiscount, setDiscountLabel])

  if (!isInternational || !visible || expired) return null

  const totalMs = timeLeft ?? OFFER_DURATION_MS
  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const pct = (totalMs / OFFER_DURATION_MS) * 100
  const isUrgent = totalMs < 2 * 60 * 1000 // last 2 minutes

  return (
    <div
      id="intl-offer-banner"
      className={`relative overflow-hidden rounded-2xl border p-4 mb-6 transition-all duration-500 ${
        isUrgent
          ? 'border-red-500/50 bg-gradient-to-r from-red-900/20 to-orange-900/15'
          : 'border-violet-500/30 bg-gradient-to-r from-violet-900/20 to-indigo-900/15'
      }`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Animated top bar */}
      <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-1000"
        style={{ width: `${pct}%` }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
            isUrgent ? 'bg-red-500/20 animate-pulse' : 'bg-violet-500/20'
          }`}>
            🎉
          </div>
          <div>
            <div className={`text-sm font-bold ${isUrgent ? 'text-red-300' : 'text-violet-200'}`}>
              Special International Offer!
            </div>
            <div className="text-xs text-white/50 mt-0.5">
              Complete your payment within the timer and save{' '}
              <span className={`font-semibold ${isUrgent ? 'text-red-400' : 'text-green-400'}`}>
                {formatPrice(OFFER_DISCOUNT_USD)}
              </span>
              {' '}— automatically applied ✓
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className={`shrink-0 text-center ${isUrgent ? 'text-red-300' : 'text-violet-200'}`}>
          <div className={`text-2xl font-mono font-bold tabular-nums tracking-tight ${
            isUrgent ? 'animate-pulse' : ''
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
            {isUrgent ? '⚠️ Expires Soon' : 'Time Left'}
          </div>
        </div>
      </div>
    </div>
  )
}
