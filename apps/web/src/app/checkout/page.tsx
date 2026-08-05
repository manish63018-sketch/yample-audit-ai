'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
  const { items, total, discount, discountLabel, clearCart } = useCart()
  const router = useRouter()
  const finalTotal = total - discount
  const maxTimeline = items.length > 0 ? Math.max(...items.map(i => parseInt(i.timeline) || 7)) : 0

  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', instagram: '', company: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) { setError('Please fill in name, email, and phone.'); return }
    setSubmitting(true)
    setError('')

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          services: items.map(i => i.name).join(', '),
          total: finalTotal,
          discount,
          source: 'checkout',
        }),
      })
      clearCart()
      router.push('/thankyou')
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/cart" className="text-white/60 hover:text-white transition-colors text-sm">← Edit Cart</Link>
        <h1 className="text-lg font-bold text-white">📋 Project Summary</h1>
        <div className="text-xs text-white/30">Step 3 of 3</div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        {/* Left: Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Your Growth Plan</h2>

          {/* Services */}
          {items.map(item => (
            <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-white/2">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-white text-sm">{item.name}</div>
                <div className="text-sm font-bold text-violet-300">${item.price.toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.benefits.map(b => (
                  <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-white/3 text-white/40 border border-white/5">✓ {b}</span>
                ))}
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-white/50"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-400"><span>🎁 {discountLabel}</span><span>-${discount.toLocaleString()}</span></div>}
            <div className="flex justify-between text-white/40 text-xs"><span>Tax</span><span>$0</span></div>
            {maxTimeline > 0 && <div className="flex justify-between text-white/40 text-xs"><span>Est. Delivery</span><span>{maxTimeline} days</span></div>}
            <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/5">
              <span>Total Investment</span>
              <span className="text-violet-300">${finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-4">
            <div className="text-xs font-semibold text-violet-300 mb-3">What Happens After You Submit</div>
            <div className="space-y-2">
              {[
                '✅ You receive a confirmation email',
                '📞 Our team contacts you within 24 hours',
                '📄 Full proposal sent to your inbox',
                '🚀 Project kickoff scheduled',
              ].map((s, i) => (
                <div key={i} className="text-xs text-white/50">{s}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Your Details</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Business Name</label>
                <input name="business" value={form.business} onChange={handleChange} placeholder="Acme Inc." className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Instagram Handle</label>
                <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@yourhandle" className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Message / Additional Info</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Tell us about your business goals, timeline requirements, or any specific requests..." className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '⏳ Sending...' : '🚀 Submit Project Summary'}
            </button>
            <p className="text-xs text-white/20 text-center">No payment required. We will contact you within 24 hours.</p>
          </form>
        </div>
      </div>
    </div>
  )
}
