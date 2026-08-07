'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import { CurrencyToggle } from '@/components/CurrencyToggle'
import { InternationalOfferBanner } from '@/components/InternationalOfferBanner'
import { MessageSquare, ShieldCheck, Zap, Clock } from 'lucide-react'

/* ── Razorpay global type declaration ───────────────────────────── */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: { name?: string; email?: string; contact?: string }
  notes?: Record<string, string>
  theme?: { color?: string }
  handler: (response: RazorpayResponse) => void
  modal?: { ondismiss?: () => void }
}
interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
interface RazorpayInstance {
  open(): void
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { items, total, discount, discountLabel, clearCart } = useCart()
  const { formatPrice, activeCurrency, isInternational, transferFee, geo } = useGeo()
  const router = useRouter()

  const finalTotalUSD = total - discount + (isInternational ? transferFee : 0)
  const maxTimeline = items.length > 0 ? Math.max(...items.map(i => parseInt(i.timeline) || 7)) : 0

  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', instagram: '', company: '', message: '' })
  const [activeQuote, setActiveQuote] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 min countdown
  const [submitting, setSubmitting] = useState(false)
  const [payingStripe, setPayingStripe] = useState(false)
  const [payingRazorpay, setPayingRazorpay] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [error, setError] = useState('')

  // Load active quote from localStorage if available
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('auditai_active_quote')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setActiveQuote(parsed)
        if (parsed.customer?.businessName) {
          setForm(f => ({ ...f, business: parsed.customer.businessName }))
        }
      } catch {}
    }
  }, [])

  // 15 Minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  /* ── Option B: Chat on WhatsApp ──────────────────────────────────── */
  const handleWhatsAppCheckout = () => {
    if (!form.name || !form.phone) {
      setError('Please enter your Full Name and Phone Number to open WhatsApp chat.')
      return
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to proceed.')
      return
    }

    setError('')

    const quoteId = activeQuote?.quoteId || `Q-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const servicesList = items.map(i => `• ${i.name}`).join('\n')

    const websiteUrl = activeQuote?.customer?.websiteUrl || activeQuote?.websiteUrl || ''
    const companyName = form.company || activeQuote?.customer?.companyName || form.business || ''
    const budgetRange = activeQuote?.customer?.budget || 'As per quote'
    const deadline = activeQuote?.customer?.deadline || `${maxTimeline || 7} Days`
    const featuresIncluded = activeQuote?.selectedFeatures?.join(', ') || items.map((i: { name: string }) => i.name).join(', ')

    const messagePayload = `Hello Yample Labs Team,

I would like to confirm and place my project order.

[ QUOTE & ORDER DETAILS ]
----------------------------------------
• Quote Ref #: ${quoteId}
• Full Name: ${form.name}
• Email: ${form.email || 'Not provided'}
• Phone / WhatsApp: ${form.phone}
• Business / Company: ${companyName || 'Not provided'}
• Country: ${geo.country}
• Website: ${websiteUrl || 'Not provided'}

[ SELECTED SERVICES ]
----------------------------------------
${featuresIncluded}

[ FINANCIAL DETAILS ]
----------------------------------------
• Budget Range: ${budgetRange}
• Total Amount: ${formatPrice(finalTotalUSD)} (${activeCurrency.code})
• Expected Delivery: ${deadline}

[ SPECIAL NOTES ]
----------------------------------------
${form.message || 'None'}

Please confirm project availability and kickoff timeline. Thank you.`

    const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent(messagePayload)}`
    window.open(whatsappUrl, '_blank')
  }

  /* ── Option A1: Razorpay Payment ────────────────────────────────── */
  const handleRazorpayCheckout = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in Name, Email, and Phone to proceed with online payment.')
      return
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to proceed.')
      return
    }

    setPayingRazorpay(true)
    setError('')

    try {
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) {
        setError('Failed to load Razorpay SDK. Please check your internet connection.')
        setPayingRazorpay(false)
        return
      }

      const orderRes = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerEmail: form.email,
          discount,
          currency: 'INR',
        }),
      })
      const orderData = await orderRes.json()

      if (!orderData.success) {
        setError(orderData.error || 'Failed to create Razorpay order.')
        setPayingRazorpay(false)
        return
      }

      if (orderData.isDemo) {
        clearCart()
        router.push(`/thankyou?payment=razorpay&demo=1`)
        return
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Yample Labs',
        description: items.map(i => i.name).join(', '),
        order_id: orderData.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          business: form.business,
          instagram: form.instagram,
          message: form.message,
        },
        theme: { color: '#6366f1' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/checkout/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerName: form.name,
                customerEmail: form.email,
                items,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              clearCart()
              router.push(verifyData.redirectUrl || `/thankyou?payment=razorpay&id=${response.razorpay_payment_id}`)
            } else {
              setError(verifyData.error || 'Payment verification failed.')
            }
          } catch {
            setError('Payment completed but verification failed. Support has been notified.')
          }
          setPayingRazorpay(false)
        },
        modal: { ondismiss: () => setPayingRazorpay(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      setError('Razorpay checkout error. Please try again.')
      setPayingRazorpay(false)
    }
  }

  /* ── Option A2: Stripe Payment ──────────────────────────────────── */
  const handleStripeCheckout = async () => {
    if (!form.name || !form.email) {
      setError('Please fill in at least your Name and Email for online checkout.')
      return
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.')
      return
    }

    setPayingStripe(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerEmail: form.email,
          discount,
          discountLabel,
          currency: activeCurrency.code,
        }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to initialize Stripe checkout.')
      }
    } catch {
      setError('Stripe connection error. Please try again.')
    } finally {
      setPayingStripe(false)
    }
  }

  const INR_RATE = 84
  const totalINR = Math.round(finalTotalUSD * INR_RATE)

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Top Bar */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/cart" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Edit Cart
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          📋 Checkout &amp; Order Confirmation
        </h1>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <span className="text-xs text-white/30">Step 2 of 2</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <InternationalOfferBanner />

        {/* ⏱️ Quote Validity Banner */}
        {activeQuote && (
          <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Quote <strong>#{activeQuote.quoteId}</strong> Bundle Discount Locked</span>
            </div>
            <div className="font-mono font-bold text-amber-400 text-sm">
              Timer: {formatTimer(timeLeft)}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Your Project Scope</h2>

            {items.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-white/2">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-white text-sm">{item.name}</div>
                  <div className="text-sm font-bold text-violet-300">{formatPrice(item.price)}</div>
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
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>🎁 {discountLabel || 'Bundle Savings'}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/5">
                <span>Total Investment</span>
                <span className="text-emerald-400 font-mono">{formatPrice(finalTotalUSD)}</span>
              </div>

              {geo.isIndia && (
                <div className="flex justify-between text-emerald-400/80 text-xs font-medium">
                  <span>In Indian Rupees (Razorpay)</span>
                  <span className="font-mono">₹{totalINR.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Warranty */}
            <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-4 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-violet-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Yample Labs Commitment:
              </div>
              <div>✓ 30-Day Post-Launch Technical Warranty</div>
              <div>✓ Dedicated Senior Architect Assigned</div>
              <div>✓ 100% Core Web Vitals Sub-1.5s Guarantee</div>
            </div>
          </div>

          {/* Right: Customer Form & Dual Checkout Options */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Customer Details</h2>
            <form onSubmit={e => e.preventDefault()} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Business Name</label>
                  <input name="business" value={form.business} onChange={handleChange} placeholder="Acme Inc." className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Phone / WhatsApp *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Instagram / Handle</label>
                  <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@yourhandle" className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Message / Requirements</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={2} placeholder="Any specific design requests or notes..." className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 resize-none" />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentTerms}
                    onChange={e => setConsentTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-violet-500"
                  />
                  <span>
                    I agree to the <Link href="/terms" className="text-violet-400 underline">Terms of Service</Link>, <Link href="/privacy" className="text-violet-400 underline">Privacy Policy</Link>, and <Link href="/refund-policy" className="text-violet-400 underline">Refund Policy</Link>.
                  </span>
                </label>
              </div>

              {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

              {/* ── DUAL CHECKOUT OPTIONS ──────────────────────────────── */}
              <div className="pt-3 space-y-3">
                {/* OPTION 1: ONLINE PAYMENT (RAZORPAY / STRIPE) */}
                <button
                  type="button"
                  onClick={handleRazorpayCheckout}
                  disabled={submitting || payingStripe || payingRazorpay || items.length === 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {payingRazorpay ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Opening Razorpay...
                    </>
                  ) : (
                    <>
                      <span>🇮🇳</span> Pay ₹{totalINR.toLocaleString('en-IN')} via Razorpay (UPI · Cards · Netbanking)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  disabled={submitting || payingStripe || payingRazorpay || items.length === 0}
                  className="w-full py-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-bold text-xs hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  💳 Pay {formatPrice(finalTotalUSD)} via Stripe International →
                </button>

                {/* DIVIDER */}
                <div className="relative flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs font-mono">OR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* OPTION 2: CHAT ON WHATSAPP (+91 63056 30468) */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  disabled={items.length === 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp (+91 63056 30468) &amp; Confirm Order
                </button>
              </div>

              <p className="text-xs text-white/20 text-center pt-2">
                🔒 Secure SSL Encryption · 30-Day Satisfaction Guarantee
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
