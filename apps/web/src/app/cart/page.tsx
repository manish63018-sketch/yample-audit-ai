'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { LaunchRewardWheel } from '@/components/journey/LaunchRewardWheel'

export default function CartPage() {
  const { items, removeItem, total, discount, discountLabel, setDiscount, setDiscountLabel, clearCart } = useCart()
  const [showWheel, setShowWheel] = useState(false)
  const tax = Math.round((total - discount) * 0.0)  // 0% tax for now — update for local tax
  const finalTotal = total - discount + tax
  const maxTimeline = items.length > 0 ? Math.max(...items.map(i => parseInt(i.timeline) || 7)) : 0

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Continue Shopping</Link>
        <h1 className="text-lg font-bold text-white">🛒 Your Business Cart</h1>
        <Link href="/calculator" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">+ Add More</Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/2">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-white/40 mb-6">Your cart is empty</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/calculator" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  Use Calculator
                </Link>
                <Link href="/#services" className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-all">
                  Browse Services
                </Link>
              </div>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="rounded-2xl border border-white/5 bg-white/2 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <div className="text-xs text-white/40 mt-0.5">Est. delivery: {item.timeline}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-violet-300">${item.price.toLocaleString()}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-white/20 hover:text-red-400 transition-colors text-sm"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {item.benefits.map(b => (
                    <div key={b} className="flex items-center gap-1.5 text-xs text-white/50 bg-white/3 rounded-lg px-2 py-1.5">
                      <span className="text-green-400 shrink-0">✓</span> {b}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/2 p-5">
            <h2 className="font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-white/60">
                <span>Subtotal ({items.length} services)</span>
                <span>${total.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>🎁 {discountLabel || 'Discount'}</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-white/40 text-xs">
                <span>Tax</span>
                <span>$0</span>
              </div>
              {maxTimeline > 0 && (
                <div className="flex justify-between text-white/40 text-xs">
                  <span>Est. Timeline</span>
                  <span>{maxTimeline} days</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/5">
                <span>Total Investment</span>
                <span className="text-violet-300">${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {!discount && items.length > 0 && (
              <button
                onClick={() => setShowWheel(true)}
                className="w-full mb-3 py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm font-semibold hover:bg-yellow-500/20 transition-all animate-pulse"
              >
                🎰 Spin for Discount!
              </button>
            )}

            {items.length > 0 && (
              <Link
                href="/checkout"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-center hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
              >
                Review Project Summary →
              </Link>
            )}

            {items.length > 0 && (
              <div className="mt-3 text-center">
                <Link href="/audit" className="text-xs text-white/30 hover:text-white/50 transition-colors">
                  🔍 Run an audit first to get recommendations
                </Link>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-white/2 p-4">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">What Happens Next</h3>
              <div className="space-y-2">
                {['Submit your project summary', 'We review within 24 hours', 'Proposal sent to your email', 'Project kicks off!'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showWheel && (
        <LaunchRewardWheel
          onClose={() => setShowWheel(false)}
          onReward={(amount, label) => {
            setDiscount(amount)
            setDiscountLabel(label)
            setShowWheel(false)
          }}
          cartTotal={total}
        />
      )}
    </div>
  )
}
