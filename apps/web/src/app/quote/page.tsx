'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGeo } from '@/context/GeoContext'
import { useCart } from '@/context/CartContext'
import { VoiceInput } from '@/components/VoiceInput'
import { AIRequirementCard } from '@/components/AIRequirementCard'
import { InternationalOfferBanner } from '@/components/InternationalOfferBanner'

const INDUSTRIES = [
  'E-Commerce / Online Store',
  'Restaurant / Cafe / Food',
  'Service Business',
  'SaaS / Tech Product',
  'Healthcare',
  'Education',
  'Real Estate',
  'Fashion / Lifestyle',
  'Finance / Legal',
  'Other',
]

const TIMELINES = [
  { label: 'ASAP (Rush)', value: 'asap', emoji: '⚡' },
  { label: '1 Month', value: '1_month', emoji: '📅' },
  { label: '3 Months', value: '3_months', emoji: '🗓️' },
  { label: '6 Months', value: '6_months', emoji: '📆' },
  { label: 'Flexible', value: 'flexible', emoji: '🕐' },
]

const FEATURE_OPTIONS = [
  { id: 'website', label: '🌐 Website', price: 599 },
  { id: 'admin', label: '⚙️ Admin Panel', price: 149 },
  { id: 'ai_chat', label: '🤖 AI Chatbot', price: 199 },
  { id: 'booking', label: '📅 Booking System', price: 149 },
  { id: 'payment', label: '💳 Payment Gateway', price: 99 },
  { id: 'crm', label: '📋 CRM', price: 249 },
  { id: 'mobile_app', label: '📱 Mobile App', price: 799 },
  { id: 'seo', label: '🔍 SEO Package', price: 149 },
  { id: 'analytics', label: '📊 Analytics', price: 99 },
  { id: 'pos', label: '🏪 POS System', price: 349 },
  { id: 'multi_lang', label: '🌍 Multi-language', price: 149 },
  { id: 'custom', label: '✨ Custom Feature', price: 0 },
]

interface AIAnalysis {
  summary: string[]
  estimatedCost: number
  budgetFit: 'under' | 'over' | 'match'
  recommendation: string
  translatedText?: string
  detectedLanguage?: string
  originalText?: string
}

export default function QuotePage() {
  const { geo, activeCurrency, formatPrice, convertPrice, isInternational, transferFee } = useGeo()
  const { items: cartItems, total: cartTotal, discount } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    projectName: '',
    businessName: '',
    industry: '',
    timeline: '',
    existingWebsite: '',
    budget: '',
    additionalNotes: '',
  })
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [voiceText, setVoiceText] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [quoteId, setQuoteId] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const handleVoiceTranscript = useCallback(async (text: string, language: string) => {
    setVoiceText(text)
    setVoiceLanguage(language)
    // Auto-fill notes if empty
    if (!form.additionalNotes) {
      setForm(f => ({ ...f, additionalNotes: text }))
    }
    // Auto-analyze
    await analyzeRequirements(text, language)
  }, [form.additionalNotes])

  const analyzeRequirements = useCallback(async (text?: string, language?: string) => {
    const requirementText = text || form.additionalNotes || voiceText
    if (!requirementText || requirementText.length < 10) return

    setAnalyzing(true)
    setError('')

    try {
      const budgetNum = parseFloat(form.budget) || 0
      // Convert budget to USD for analysis
      const budgetUSD = activeCurrency.code === 'INR' ? budgetNum / 84 : budgetNum

      const res = await fetch('/api/ai/analyze-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: requirementText,
          language: language || voiceLanguage || undefined,
          budget: budgetUSD,
          currency: 'USD',
          services: selectedFeatures,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAiAnalysis(data.data)
      }
    } catch (e) {
      console.error('Analysis failed:', e)
    } finally {
      setAnalyzing(false)
    }
  }, [form.additionalNotes, form.budget, voiceText, voiceLanguage, selectedFeatures, activeCurrency])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.businessName || !form.industry) {
      setError('Please fill in Business Name and Industry.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const budgetNum = parseFloat(form.budget) || 0
      const effectiveCartTotal = cartTotal - discount

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: form.projectName,
          businessName: form.businessName,
          industry: form.industry,
          timeline: form.timeline,
          existingWebsite: form.existingWebsite,
          additionalNotes: form.additionalNotes,
          requiredFeatures: selectedFeatures,
          budgetAmount: budgetNum,
          budgetCurrency: activeCurrency.code,
          voiceOriginalText: voiceText || undefined,
          voiceDetectedLanguage: voiceLanguage || undefined,
          voiceTranslatedText: aiAnalysis?.translatedText || undefined,
          aiSummary: aiAnalysis?.summary || [],
          aiEstimatedCostUsd: aiAnalysis?.estimatedCost || undefined,
          aiBudgetFit: aiAnalysis?.budgetFit || undefined,
          aiRecommendation: aiAnalysis?.recommendation || undefined,
          customerCountry: geo.country,
          customerCountryCode: geo.countryCode,
          customerCurrency: activeCurrency.code,
          offerApplied: discount > 0,
          offerDiscountAmount: discount,
          offerDiscountCurrency: activeCurrency.code,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setQuoteId(data.quoteId)
        setSubmitted(true)
      } else {
        setError('Failed to submit. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-6">
            🎉
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Quote Submitted!</h1>
          <p className="text-white/50 text-sm mb-6">
            Your requirements have been received and analyzed by our AI.
          </p>
          <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 mb-6">
            <div className="text-xs text-white/40 mb-1">Your Quote ID</div>
            <div className="text-xl font-mono font-bold text-violet-300">{quoteId}</div>
            <div className="text-xs text-white/30 mt-1">Save this for tracking your project</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/checkout')}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout →
            </button>
            <Link href="/dashboard" className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/8 transition-all text-center">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cart total in active currency
  const effectiveTotal = cartTotal > 0
    ? convertPrice(cartTotal - discount + transferFee)
    : 0

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-[#050816]/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/calculator" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1">
            ← Calculator
          </Link>
          <div className="text-sm font-medium text-white/60">
            Custom Requirements
          </div>
          <div className="text-xs text-white/30">
            {geo.isLoaded ? `${geo.countryCode} · ${activeCurrency.symbol}${activeCurrency.code}` : '...'}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* Main Form — 2 cols */}
        <div className="lg:col-span-2 space-y-6">

          {/* International offer banner */}
          <InternationalOfferBanner />

          {/* Section Title */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Tell Us About Your Project</h1>
            <p className="text-sm text-white/40">
              The more details you share, the more accurate your AI-generated quote will be.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="quote-form">
            {/* Project & Business */}
            <div className="rounded-2xl border border-white/5 bg-white/2 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Project Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Project Name</label>
                  <input
                    name="projectName" value={form.projectName} onChange={handleChange}
                    placeholder="My Online Store"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Business Name *</label>
                  <input
                    name="businessName" value={form.businessName} onChange={handleChange}
                    placeholder="Acme Corporation" required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Industry *</label>
                  <select
                    name="industry" value={form.industry} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    <option value="" disabled>Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Existing Website</label>
                  <input
                    name="existingWebsite" value={form.existingWebsite} onChange={handleChange}
                    placeholder="https://example.com (or leave blank)"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="rounded-2xl border border-white/5 bg-white/2 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Budget & Timeline</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">
                    Budget ({activeCurrency.symbol}{activeCurrency.code})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">
                      {activeCurrency.symbol}
                    </span>
                    <input
                      name="budget" value={form.budget} onChange={handleChange}
                      type="number" min="0" placeholder="0"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Timeline</label>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINES.map(t => (
                      <button
                        key={t.value} type="button"
                        onClick={() => setForm(f => ({ ...f, timeline: t.value }))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          form.timeline === t.value
                            ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                            : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Required Features */}
            <div className="rounded-2xl border border-white/5 bg-white/2 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Required Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FEATURE_OPTIONS.map(f => (
                  <button
                    key={f.id} type="button"
                    onClick={() => toggleFeature(f.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedFeatures.includes(f.id)
                        ? 'border-violet-500/60 bg-violet-500/15 text-violet-200'
                        : 'border-white/8 bg-white/3 text-white/50 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {f.label}
                    {f.price > 0 && (
                      <span className={`block text-[10px] mt-0.5 ${selectedFeatures.includes(f.id) ? 'text-violet-400' : 'text-white/25'}`}>
                        from {formatPrice(f.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes + Voice */}
            <div className="rounded-2xl border border-white/5 bg-white/2 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Requirements</h2>
                <span className="text-[10px] text-white/30">Type or speak</span>
              </div>

              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project in detail — pages needed, features, integrations, your target audience, business goals..."
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
              />

              {/* Voice Input */}
              <div className="border-t border-white/5 pt-4">
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  placeholder="Speak your requirements in any language..."
                />
              </div>

              {/* Analyze Button */}
              {(form.additionalNotes.length > 10 || voiceText) && !aiAnalysis && (
                <button
                  type="button"
                  onClick={() => analyzeRequirements()}
                  disabled={analyzing}
                  id="analyze-requirements-btn"
                  className="w-full py-3 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold hover:bg-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-violet-500/50 border-t-violet-400 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>🤖 Analyze Requirements with AI</>
                  )}
                </button>
              )}
            </div>

            {/* AI Analysis Card */}
            {aiAnalysis && (
              <AIRequirementCard
                data={aiAnalysis}
                clientBudget={parseFloat(form.budget) || 0}
                currency={activeCurrency.code}
              />
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !form.businessName || !form.industry}
              id="quote-submit-btn"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '⏳ Generating Quote...' : '🎯 Generate AI Quote →'}
            </button>
          </form>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-white/2 p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-white mb-4">Selected Services</h3>
              <div className="space-y-2 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{item.name}</span>
                    <span className="text-violet-300 font-semibold">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* International transfer fee */}
              {isInternational && transferFee > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm border-t border-white/5 pt-2">
                    <span className="text-white/40">Est. Transfer Fee</span>
                    <span className="text-white/50">{formatPrice(transferFee)}</span>
                  </div>
                  <div className="text-[10px] text-white/25 mt-1">
                    Transfer fee varies by payment provider
                  </div>
                </>
              )}

              {discount > 0 && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-green-400">🎉 Offer Discount</span>
                  <span className="text-green-400 font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="border-t border-white/5 mt-3 pt-3 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Total</span>
                <span className="text-xl font-bold text-violet-300">
                  {formatPrice(cartTotal - discount + transferFee)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-4 block w-full py-3 text-center rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:text-white hover:bg-white/8 transition-all"
              >
                Skip to Checkout →
              </Link>
            </div>
          )}

          {/* How it works */}
          <div className="rounded-2xl border border-white/5 bg-white/2 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">How It Works</h3>
            <div className="space-y-3">
              {[
                { icon: '📝', text: 'Fill your project details' },
                { icon: '🎤', text: 'Speak or type requirements' },
                { icon: '🤖', text: 'AI analyzes & estimates' },
                { icon: '🎯', text: 'Get Quote ID instantly' },
                { icon: '💳', text: 'Checkout & pay securely' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/50">
                  <span className="text-base w-6 shrink-0">{step.icon}</span>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geo info card */}
          {geo.isLoaded && (
            <div className="rounded-2xl border border-white/5 bg-white/2 p-4">
              <div className="text-xs text-white/30 mb-2">Your Location</div>
              <div className="text-sm text-white/70 font-medium">{geo.country}</div>
              {isInternational && (
                <div className="text-xs text-white/30 mt-1">
                  Prices shown in {activeCurrency.symbol}{activeCurrency.code} · Bank transfer fee applies
                </div>
              )}
              {geo.isIndia && (
                <div className="text-xs text-white/30 mt-1">
                  Prices shown in ₹INR · No transfer fees
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
