'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import { CheckCircle2, Clock, Zap, ArrowRight, ShieldCheck, Upload, Mic } from 'lucide-react'

const BUSINESS_TYPES = [
  'Restaurant / Cafe',
  'Clinic / Healthcare / Doctor',
  'Gym / Fitness Studio',
  'E-Commerce / Online Store',
  'SaaS / Tech Startup',
  'Agency / Professional Services',
  'Real Estate / Property',
  'Portfolio / Creator',
  'General Business',
]

const DESIGN_STYLES = [
  'Modern & Sleek (Framer / Stripe Aesthetic)',
  'Bold & Creative (High Energy)',
  'Corporate & Executive (Clean & Professional)',
  'Minimalist & Minimal Debt',
]

const FEATURE_GRID = [
  { id: 'admin-dashboard', label: 'Admin Dashboard & CMS', price: 149, desc: 'Manage content & inquiries without developers' },
  { id: 'ai-assistant', label: '24/7 AI Voice & Chat Support Agent', price: 199, desc: 'Qualify after-hours leads automatically' },
  { id: 'booking-system', label: 'Online Calendar & Booking System', price: 149, desc: 'Instant client scheduling' },
  { id: 'seo-setup', label: 'On-Page SEO & Schema Markup', price: 149, desc: 'Index on Google & search engines' },
  { id: 'ecommerce', label: 'E-Commerce Cart & Payments', price: 249, desc: 'Accept Razorpay / Stripe payments' },
  { id: 'blog', label: 'Blog & Article Engine', price: 99, desc: 'Content marketing system' },
  { id: 'security-hardening', label: 'Security Hardening & CSP Protection', price: 99, desc: 'HSTS, CSP & DDoS protection' },
]

export default function RequirementsPage() {
  const router = useRouter()
  const { addItem, clearCart } = useCart()
  const { formatPrice, convertPrice, activeCurrency } = useGeo()

  const [form, setForm] = useState({
    businessName: '',
    websiteUrl: '',
    businessType: 'General Business',
    designStyle: 'Modern & Sleek (Framer / Stripe Aesthetic)',
    primaryGoal: 'More Leads & Sales',
    targetAudience: '',
    budget: '$500 - $1,000',
    deadline: '7-10 Days',
    notes: '',
    referenceLinks: '',
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'admin-dashboard',
    'ai-assistant',
    'seo-setup',
  ])

  const [consentTerms, setConsentTerms] = useState(false)
  const [consentData, setConsentData] = useState(false)
  const [error, setError] = useState('')
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  // Calculate Subtotal & Discount
  const baseWebsitePrice = 599
  const featuresTotal = selectedFeatures.reduce((acc, featId) => {
    const item = FEATURE_GRID.find(f => f.id === featId)
    return acc + (item ? item.price : 0)
  }, 0)

  const subtotalUSD = baseWebsitePrice + featuresTotal
  const discountPercent = selectedFeatures.length >= 4 ? 15 : selectedFeatures.length >= 2 ? 10 : 0
  const discountUSD = Math.round((subtotalUSD * discountPercent) / 100)
  const totalUSD = subtotalUSD - discountUSD

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.businessName) {
      setError('Please enter your Business / Brand Name.')
      return
    }
    if (!consentTerms || !consentData) {
      setError('Please accept the Terms of Service and Data Processing Consent.')
      return
    }

    setError('')
    setIsGeneratingQuote(true)

    // Generate custom Quote ID
    const quoteId = `Q-2026-${Math.floor(1000 + Math.random() * 9000)}`

    // Package details
    const selectedFeatureLabels = selectedFeatures.map(id => FEATURE_GRID.find(f => f.id === id)?.label || id)
    const quotePayload = {
      quoteId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min timer
      customer: form,
      selectedFeatures: selectedFeatureLabels,
      subtotalUSD,
      discountUSD,
      totalUSD,
      currency: activeCurrency.code,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`auditai_quote_${quoteId}`, JSON.stringify(quotePayload))
      localStorage.setItem('auditai_active_quote', JSON.stringify(quotePayload))
    }

    // Add tailored items to Cart Context
    clearCart()
    addItem({
      id: `custom-bundle-${quoteId}`,
      name: `Custom Website & Growth Bundle (${form.businessName || 'Business'})`,
      price: totalUSD,
      timeline: form.deadline,
      benefits: ['Custom Redesign', ...selectedFeatureLabels],
      category: 'Custom Package',
    })

    setTimeout(() => {
      router.push('/checkout')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Top Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">
          ← Back to Home
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          📋 Project Requirement &amp; Scope Form
        </h1>
        <div className="text-xs text-violet-400 font-mono">Step 1 of 2</div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form Left */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Custom Scope Intake</span>
              <h2 className="text-3xl font-black text-white mt-1">Tell Us About Your Project</h2>
              <p className="text-xs text-slate-400 mt-1">Fill out your requirements to generate an instant itemized quotation.</p>
            </div>

            <form onSubmit={handleGenerateQuote} className="space-y-5">
              {/* Business Name & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Business / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Website URL (Optional)</label>
                  <input
                    type="text"
                    value={form.websiteUrl}
                    onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                    placeholder="e.g. acme.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Business Type & Design Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Category</label>
                  <select
                    value={form.businessType}
                    onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  >
                    {BUSINESS_TYPES.map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preferred Design Aesthetic</label>
                  <select
                    value={form.designStyle}
                    onChange={e => setForm(f => ({ ...f, designStyle: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  >
                    {DESIGN_STYLES.map(ds => (
                      <option key={ds} value={ds}>{ds}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Feature Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Select Required Features &amp; Modules</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {FEATURE_GRID.map(feat => {
                    const isSelected = selectedFeatures.includes(feat.id)
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-violet-500/50 bg-violet-500/10 text-white'
                            : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${isSelected ? 'bg-violet-500 text-white' : 'border border-white/20'}`}>
                            {isSelected && '✓'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{feat.label}</div>
                            <div className="text-[11px] text-slate-400">{feat.desc}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-violet-300">+{formatPrice(feat.price)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Budget Range</label>
                  <select
                    value={form.budget}
                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="$300 - $500">$300 – $500 (Basic Setup)</option>
                    <option value="$500 - $1,000">$500 – $1,000 (Standard Agency)</option>
                    <option value="$1,000 - $2,500">$1,000 – $2,500 (Full Platform)</option>
                    <option value="$2,500+">$2,500+ (Enterprise Scope)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Delivery Deadline</label>
                  <select
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="3-5 Days">⚡ Urgent (3-5 Days)</option>
                    <option value="7-10 Days">🚀 Standard (7-10 Days)</option>
                    <option value="14 Days">📅 Relaxed (14 Days)</option>
                  </select>
                </div>
              </div>

              {/* Notes & Reference Links */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Special Notes / Reference Websites</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Paste reference site URLs or describe your specific business goals..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
                />
              </div>

              {/* Legal Consent Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentTerms}
                    onChange={e => setConsentTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-0"
                  />
                  <span>
                    I agree to the <Link href="/terms" className="text-violet-400 underline">Terms of Service</Link>, <Link href="/privacy" className="text-violet-400 underline">Privacy Policy</Link>, and <Link href="/refund-policy" className="text-violet-400 underline">Refund &amp; Satisfaction Policy</Link>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentData}
                    onChange={e => setConsentData(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-0"
                  />
                  <span>
                    I consent to Yample Labs processing my project requirements to generate an automated quotation.
                  </span>
                </label>
              </div>

              {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={isGeneratingQuote}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2"
              >
                {isGeneratingQuote ? 'Generating Instant Quote...' : 'Generate Auto Quote & Proceed to Checkout →'}
              </button>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-violet-500/20 bg-violet-950/20 space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Live Quotation Preview</span>
                  <h3 className="text-lg font-bold text-white">Estimated Investment</h3>
                </div>
                <Zap className="w-5 h-5 text-violet-400" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Custom Website Redesign</span>
                  <span className="font-mono text-white">{formatPrice(baseWebsitePrice)}</span>
                </div>

                {selectedFeatures.map(id => {
                  const feat = FEATURE_GRID.find(f => f.id === id)
                  if (!feat) return null
                  return (
                    <div key={id} className="flex justify-between text-slate-400">
                      <span>+ {feat.label}</span>
                      <span className="font-mono text-white">{formatPrice(feat.price)}</span>
                    </div>
                  )
                })}

                {discountUSD > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                    <span>🎁 Bundle Savings ({discountPercent}%)</span>
                    <span>-{formatPrice(discountUSD)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-white/10">
                  <span>Total Quotation</span>
                  <span className="text-emerald-400 font-mono">{formatPrice(totalUSD)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white">Included Warranty &amp; SLA:</div>
                <div className="text-[11px] text-slate-400">✓ 30-Day Technical Post-Launch Warranty</div>
                <div className="text-[11px] text-slate-400">✓ 100% Core Web Vitals Sub-1.5s Commitment</div>
                <div className="text-[11px] text-slate-400">✓ Dedicated Yample Labs Architect Assigned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
