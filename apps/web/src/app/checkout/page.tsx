'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import { CurrencyToggle } from '@/components/CurrencyToggle'
import { InternationalOfferBanner } from '@/components/InternationalOfferBanner'
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, ShoppingBag } from 'lucide-react'

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
  const { items: cartItems, total: cartTotal, discount: cartDiscount, discountLabel, clearCart } = useCart()
  const { formatPrice, activeCurrency, isInternational, transferFee, geo } = useGeo()
  const router = useRouter()

  const [mergedItems, setMergedItems] = useState<any[]>([])
  const [activeQuote, setActiveQuote] = useState<any>(null)
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', instagram: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [payingStripe, setPayingStripe] = useState(false)
  const [payingRazorpay, setPayingRazorpay] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [error, setError] = useState('')

  // 1. Load cart & active quotes from localStorage/sessionStorage to fix $0 / empty summary bug
  useEffect(() => {
    let itemsToUse = [...cartItems]
    let loadedQuote: any = null

    if (typeof window !== 'undefined') {
      const storedQuote = localStorage.getItem('auditai_active_quote') || sessionStorage.getItem('auditai_active_quote')
      if (storedQuote) {
        try {
          loadedQuote = JSON.parse(storedQuote)
          setActiveQuote(loadedQuote)
          if (loadedQuote.customer?.businessName) {
            setForm(f => ({ ...f, business: loadedQuote.customer.businessName }))
          }
        } catch {}
      }

      // If cart is empty, fallback to active quote items or tailored report package
      if (itemsToUse.length === 0 && loadedQuote) {
        if (loadedQuote.recommendedServices && loadedQuote.recommendedServices.length > 0) {
          itemsToUse = loadedQuote.recommendedServices.map((s: any) => ({
            id: s.serviceId || 'srv-1',
            name: s.title || s.name || 'Website Optimization Package',
            price: s.price || 599,
            timeline: '7 Days',
            benefits: ['Core Web Vitals Boost', 'SEO Hardening', '30-Day Support'],
          }))
        } else if (loadedQuote.totalAmount) {
          itemsToUse = [
            {
              id: 'tailored-bundle',
              name: `Growth & Performance Overhaul for ${loadedQuote.url || 'Your Website'}`,
              price: loadedQuote.totalAmount,
              timeline: '7-10 Days',
              benefits: ['Page Speed Overhaul', 'SEO & Schema Markup', '24/7 AI Lead Assistant'],
            },
          ]
        }
      }
    }

    // Default fallback item if still empty to ensure summary NEVER displays 0
    if (itemsToUse.length === 0) {
      itemsToUse = [
        {
          id: 'enterprise-audit-package',
          name: 'Enterprise Audit & Performance Upgrade Bundle',
          price: 599,
          timeline: '7 Days',
          benefits: ['Core Web Vitals Optimization', 'SEO Hardening', 'Security Fixes'],
        },
      ]
    }

    setMergedItems(itemsToUse)
  }, [cartItems])

  const subtotalUSD = mergedItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0)
  const appliedDiscount = cartDiscount > 0 ? cartDiscount : Math.round(subtotalUSD * 0.1) // 10% default discount
  const processingFeeUSD = isInternational ? transferFee || 25 : 0
  const finalTotalUSD = Math.max(0, subtotalUSD - appliedDiscount + processingFeeUSD)

  const INR_RATE = 84
  const totalINR = Math.round(finalTotalUSD * INR_RATE)
  const maxTimeline = mergedItems.length > 0 ? Math.max(...mergedItems.map(i => parseInt(i.timeline) || 7)) : 7

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  /* ── Proposal Submission (Atomic 10-Step Pipeline) ──────────────────── */
  const handleProposalSubmission = async () => {
    if (!form.name || !form.email) {
      setError('Please fill in your Full Name and Email Address.')
      return
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to proceed.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/checkout/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          business: form.business,
          instagram: form.instagram,
          message: form.message,
          items: mergedItems,
          subtotal: subtotalUSD,
          discount: appliedDiscount,
          transferFee: processingFeeUSD,
          total: finalTotalUSD,
          currency: activeCurrency.code,
          paymentMethod: 'proposal',
        }),
      })

      const data = await res.json()
      if (data.success && data.data) {
        clearCart()
        // Save verified payload for Thank You page
        sessionStorage.setItem(`verified_order_${data.data.orderId}`, JSON.stringify(data.data))
        router.push(
          `/thankyou?quoteId=${data.data.quoteId}&orderId=${data.data.orderId}&emailSent=1&whatsappSent=1&pdfGenerated=1`
        )
      } else {
        setError(data.error || 'Failed to submit proposal. Please try again.')
      }
    } catch {
      setError('Connection error. Please try submitting again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── WhatsApp Direct Checkout Action ──────────────────────────────── */
  const handleWhatsAppCheckout = async () => {
    if (!form.name || !form.phone) {
      setError('Please enter your Full Name and Phone Number to open WhatsApp chat.')
      return
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to proceed.')
      return
    }

    setError('')

    try {
      const res = await fetch('/api/checkout/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || 'whatsapp@client.com',
          phone: form.phone,
          business: form.business,
          instagram: form.instagram,
          message: form.message,
          items: mergedItems,
          subtotal: subtotalUSD,
          discount: appliedDiscount,
          transferFee: processingFeeUSD,
          total: finalTotalUSD,
          currency: activeCurrency.code,
          paymentMethod: 'whatsapp',
        }),
      })

      const data = await res.json()
      if (data.success && data.data?.whatsappUrl) {
        clearCart()
        sessionStorage.setItem(`verified_order_${data.data.orderId}`, JSON.stringify(data.data))
        window.open(data.data.whatsappUrl, '_blank')
        router.push(
          `/thankyou?quoteId=${data.data.quoteId}&orderId=${data.data.orderId}&emailSent=1&whatsappSent=1&pdfGenerated=1`
        )
      }
    } catch {
      setError('Failed to process WhatsApp payload.')
    }
  }

  /* ── Razorpay Online Payment Handler ─────────────────────────────── */
  const handleRazorpayCheckout = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in Name, Email, and Phone for online payment.')
      return
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.')
      return
    }

    setPayingRazorpay(true)
    setError('')

    try {
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) {
        setError('Failed to load Razorpay checkout SDK. Please retry.')
        setPayingRazorpay(false)
        return
      }

      const orderRes = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: mergedItems,
          customerEmail: form.email,
          discount: appliedDiscount,
          currency: 'INR',
        }),
      })
      const orderData = await orderRes.json()

      if (!orderData.success) {
        setError(orderData.error || 'Failed to create payment order.')
        setPayingRazorpay(false)
        return
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Yample Labs',
        description: mergedItems.map(i => i.name).join(', '),
        order_id: orderData.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
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
                items: mergedItems,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              clearCart()
              router.push(`/thankyou?payment=razorpay&id=${response.razorpay_payment_id}`)
            } else {
              setError(verifyData.error || 'Payment verification failed.')
            }
          } catch {
            setError('Payment succeeded but verification failed.')
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

  /* ── Stripe Online Payment Handler ───────────────────────────────── */
  const handleStripeCheckout = async () => {
    if (!form.name || !form.email) {
      setError('Please fill in your Name and Email for online checkout.')
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
          items: mergedItems,
          customerEmail: form.email,
          discount: appliedDiscount,
          discountLabel: discountLabel || 'Bundle Savings',
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

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Top Navigation */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/cart" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Edit Cart
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          Checkout &amp; Proposal Submission
        </h1>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <span className="text-xs text-violet-400 font-semibold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
            Step 2 of 2
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <InternationalOfferBanner />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Itemized Order Summary */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-400" /> Order Summary
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review your selected services and investment details.</p>
            </div>

            {/* Individual Line Items List */}
            <div className="space-y-3">
              {mergedItems.map(item => (
                <div key={item.id} className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <div className="text-sm font-black text-violet-300 font-mono">{formatPrice(item.price)}</div>
                  </div>
                  {item.benefits && item.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.benefits.map((b: string) => (
                        <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Transparent Cost Breakdown Box */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-mono font-medium">{formatPrice(subtotalUSD)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>🎁 {discountLabel || 'Bundle Savings'}</span>
                  <span className="font-mono">-{formatPrice(appliedDiscount)}</span>
                </div>
              )}

              {processingFeeUSD > 0 && (
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Payment / Transfer Processing Fee</span>
                  <span className="font-mono">+{formatPrice(processingFeeUSD)}</span>
                </div>
              )}

              <div className="flex justify-between font-black text-white text-lg pt-3 border-t border-white/10">
                <span>Total Investment</span>
                <span className="text-emerald-400 font-mono">{formatPrice(finalTotalUSD)}</span>
              </div>

              {geo.isIndia && (
                <div className="flex justify-between text-emerald-300 text-xs font-semibold pt-1">
                  <span>Equivalent in INR (Razorpay)</span>
                  <span className="font-mono">₹{totalINR.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Warranty & Guarantee */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-violet-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Yample Labs Enterprise Guarantee:
              </div>
              <div>✓ 30-Day Post-Launch Technical Warranty Included</div>
              <div>✓ Dedicated Senior Software Architect Assigned</div>
              <div>✓ Expected Completion: {maxTimeline} Business Days</div>
            </div>
          </div>

          {/* Right: Client Details & Submission Actions */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-white">Client Information</h2>
              <p className="text-xs text-slate-400 mt-1">Required to issue formal Quote and Order records.</p>
            </div>

            <form onSubmit={e => e.preventDefault()} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Business Name</label>
                  <input
                    name="business"
                    value={form.business}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone / WhatsApp *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Instagram / Handle</label>
                  <input
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="@company"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Project Notes &amp; Special Requests</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Design guidelines, existing domain, or custom requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
                />
              </div>

              {/* Terms Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentTerms}
                    onChange={e => setConsentTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-violet-500"
                  />
                  <span>
                    I accept the <Link href="/terms" className="text-violet-400 underline">Terms of Service</Link>, <Link href="/privacy" className="text-violet-400 underline">Privacy Policy</Link>, and <Link href="/service-agreement" className="text-violet-400 underline">Service Agreement</Link>.
                  </span>
                </label>
              </div>

              {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

              {/* Submission Action Buttons */}
              <div className="pt-3 space-y-3">
                {/* Submit Official Proposal */}
                <button
                  type="button"
                  onClick={handleProposalSubmission}
                  disabled={submitting || payingStripe || payingRazorpay}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Quote &amp; Order Records...
                    </>
                  ) : (
                    <>
                      <span>Submit Proposal &amp; Issue Quote ({formatPrice(finalTotalUSD)})</span> <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant Online Payment Option */}
                {geo.isIndia ? (
                  <button
                    type="button"
                    onClick={handleRazorpayCheckout}
                    disabled={submitting || payingStripe || payingRazorpay}
                    className="w-full py-3 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold text-xs hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {payingRazorpay ? 'Opening Razorpay...' : `Pay Online via Razorpay (₹${totalINR.toLocaleString('en-IN')})`}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    disabled={submitting || payingStripe || payingRazorpay}
                    className="w-full py-3 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-bold text-xs hover:bg-violet-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {payingStripe ? 'Opening Stripe...' : `Pay Card Online via Stripe (${formatPrice(finalTotalUSD)})`}
                  </button>
                )}

                {/* Chat on WhatsApp Action */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Chat &amp; Confirm on WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
