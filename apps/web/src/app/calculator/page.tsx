'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart, getBundleDiscountPercentage } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import { CurrencyToggle } from '@/components/CurrencyToggle'
import { InternationalOfferBanner } from '@/components/InternationalOfferBanner'

const STEPS = [
  {
    id: 'businessType',
    question: 'What type of business do you have?',
    icon: '🏢',
    options: [
      { label: 'E-Commerce / Online Store', value: 'ecommerce', price: 0 },
      { label: 'Restaurant / Cafe / Food', value: 'restaurant', price: 0 },
      { label: 'Service Business', value: 'service', price: 0 },
      { label: 'SaaS / Tech Product', value: 'saas', price: 0 },
      { label: 'Healthcare / Education', value: 'healthcare', price: 0 },
      { label: 'Other', value: 'other', price: 0 },
    ],
  },
  {
    id: 'hasWebsite',
    question: 'Do you currently have a website?',
    icon: '🌐',
    options: [
      { label: 'Yes — needs upgrading', value: 'upgrade', price: 599 },
      { label: 'No — need a new website', value: 'new', price: 899 },
    ],
  },
  {
    id: 'adminPanel',
    question: 'Do you need an Admin Panel?',
    icon: '⚙️',
    sub: 'Dashboard to manage content, orders, users, or inventory',
    options: [
      { label: 'Yes, I need an admin dashboard', value: 'yes', price: 149 },
      { label: 'No admin panel needed', value: 'no', price: 0 },
    ],
  },
  {
    id: 'aiAssistant',
    question: 'Do you need an AI Assistant?',
    icon: '🤖',
    sub: '24/7 customer support bot, lead qualification, FAQ automation',
    options: [
      { label: 'Yes — AI Customer Assistant', value: 'yes', price: 199 },
      { label: 'Not right now', value: 'no', price: 0 },
    ],
  },
  {
    id: 'crm',
    question: 'Do you need a CRM System?',
    icon: '📋',
    sub: 'Manage leads, pipeline, follow-ups, and customer data',
    options: [
      { label: 'Yes — full CRM system', value: 'yes', price: 249 },
      { label: 'Not needed', value: 'no', price: 0 },
    ],
  },
  {
    id: 'booking',
    question: 'Do you need a Booking System?',
    icon: '📅',
    sub: 'Online appointments, reservations, or scheduling',
    options: [
      { label: 'Yes — online booking', value: 'yes', price: 149 },
      { label: 'No booking needed', value: 'no', price: 0 },
    ],
  },
  {
    id: 'pos',
    question: 'Do you need a POS System?',
    icon: '🏪',
    sub: 'Point of sale for in-store payments, inventory, and receipts',
    options: [
      { label: 'Yes — POS for my business', value: 'yes', price: 349 },
      { label: 'Not required', value: 'no', price: 0 },
    ],
  },
  {
    id: 'mobileApp',
    question: 'Do you need a Mobile App?',
    icon: '📱',
    sub: 'iOS & Android app for customers or team',
    options: [
      { label: 'Yes — mobile app', value: 'yes', price: 799 },
      { label: 'Website only is fine', value: 'no', price: 0 },
    ],
  },
  {
    id: 'seo',
    question: 'Do you need ongoing SEO?',
    icon: '🔍',
    sub: 'Monthly keyword tracking, content strategy, and ranking growth',
    options: [
      { label: 'Yes — monthly SEO package', value: 'yes', price: 99 },
      { label: 'One-time audit only', value: 'no', price: 0 },
    ],
  },
  {
    id: 'analytics',
    question: 'Do you need an Analytics Dashboard?',
    icon: '📊',
    sub: 'Custom metrics, conversion tracking, business KPIs',
    options: [
      { label: 'Yes — custom analytics', value: 'yes', price: 99 },
      { label: 'Basic analytics is fine', value: 'no', price: 0 },
    ],
  },
]

interface Answer {
  stepId: string
  value: string
  price: number
  label: string
}

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [total, setTotal] = useState(0)
  const [done, setDone] = useState(false)
  const { addItem } = useCart()
  const { formatPrice, isInternational, transferFee } = useGeo()

  const progress = ((currentStep) / STEPS.length) * 100

  const handleOption = (option: typeof STEPS[0]['options'][0]) => {
    const newAnswer: Answer = {
      stepId: STEPS[currentStep].id,
      value: option.value,
      price: option.price,
      label: option.label,
    }

    const newAnswers = answers.filter(a => a.stepId !== STEPS[currentStep].id)
    newAnswers.push(newAnswer)
    setAnswers(newAnswers)

    const newTotal = newAnswers.reduce((s, a) => s + a.price, 0)
    setTotal(newTotal)

    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep(s => s + 1), 300)
    } else {
      setDone(true)
    }
  }

  const handleAddToCart = () => {
    const selectedServices: { id: string; name: string; price: number; timeline: string; benefits: string[] }[] = []

    answers.forEach(a => {
      if (a.value === 'upgrade') selectedServices.push({ id: 'website-upgrade', name: 'Website Upgrade', price: 599, timeline: '7 days', benefits: ['Performance fix', 'SEO overhaul', 'Modern design'] })
      if (a.value === 'new') selectedServices.push({ id: 'business-website', name: 'Business Website', price: 899, timeline: '10 days', benefits: ['Custom design', 'Mobile-first', 'SEO-ready'] })
      if (a.stepId === 'adminPanel' && a.value === 'yes') selectedServices.push({ id: 'admin-panel', name: 'Admin Panel', price: 149, timeline: '5 days', benefits: ['Content management', 'User management', 'Analytics'] })
      if (a.stepId === 'aiAssistant' && a.value === 'yes') selectedServices.push({ id: 'ai-automation', name: 'AI Customer Assistant', price: 199, timeline: '7 days', benefits: ['24/7 support', 'Lead qualification', 'WhatsApp integration'] })
      if (a.stepId === 'crm' && a.value === 'yes') selectedServices.push({ id: 'crm', name: 'CRM System', price: 249, timeline: '10 days', benefits: ['Lead pipeline', 'Auto follow-up', 'Team collaboration'] })
      if (a.stepId === 'booking' && a.value === 'yes') selectedServices.push({ id: 'booking', name: 'Booking System', price: 149, timeline: '7 days', benefits: ['Online scheduling', 'Calendar sync', 'Reminders'] })
      if (a.stepId === 'pos' && a.value === 'yes') selectedServices.push({ id: 'pos', name: 'POS System', price: 349, timeline: '14 days', benefits: ['Inventory mgmt', 'Sales reports', 'Receipt delivery'] })
      if (a.stepId === 'mobileApp' && a.value === 'yes') selectedServices.push({ id: 'mobile-app', name: 'Mobile App', price: 799, timeline: '21 days', benefits: ['iOS & Android', 'Push notifications', 'App Store ready'] })
      if (a.stepId === 'seo' && a.value === 'yes') selectedServices.push({ id: 'seo-monthly', name: 'Monthly SEO Package', price: 99, timeline: 'Monthly', benefits: ['Keyword tracking', 'Content strategy', 'Ranking growth'] })
      if (a.stepId === 'analytics' && a.value === 'yes') selectedServices.push({ id: 'analytics-dashboard', name: 'Analytics Dashboard', price: 99, timeline: '5 days', benefits: ['Custom metrics', 'Conversion tracking', 'KPI reports'] })
    })

    selectedServices.forEach(s => addItem({ ...s, category: 'calculator' }))
  }

  const selectedCount = answers.filter(a => a.price > 0).length
  const bundleDiscountPct = getBundleDiscountPercentage(selectedCount)
  const bundleDiscountAmount = Math.round((total * bundleDiscountPct) / 100 * 100) / 100
  const finalEstimateUSD = total - bundleDiscountAmount + (isInternational ? transferFee : 0)

  const step = STEPS[currentStep]
  const selectedValue = answers.find(a => a.stepId === step?.id)?.value

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          ← Back to Home
        </Link>
        <div className="text-sm font-medium text-white/60">
          Step {done ? STEPS.length : currentStep + 1} of {STEPS.length}
        </div>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <Link href="/cart" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View Cart →
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${done ? 100 : progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Live Price Counter */}
        <div className="mb-8 text-center">
          <div className="text-xs text-white/30 mb-1 font-mono">ESTIMATED INVESTMENT</div>
          <div className="text-5xl font-bold tabular-nums" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {formatPrice(total - bundleDiscountAmount)}
          </div>
          {total > 0 && (
            <div className="text-xs text-white/30 mt-1 space-y-0.5">
              <div>
                {selectedCount} service{selectedCount !== 1 ? 's' : ''} selected
                {bundleDiscountPct > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold text-[10px]">
                    {bundleDiscountPct}% Bundle Discount!
                  </span>
                )}
              </div>
              {isInternational && transferFee > 0 && (
                <div className="text-white/20">+ est. {formatPrice(transferFee)} transfer fee</div>
              )}
            </div>
          )}
        </div>

        {!done ? (
          /* Question card */
          <div className="w-full max-w-xl">
            <div className="rounded-2xl border border-white/5 bg-white/2 p-8 mb-6">
              <div className="text-3xl mb-4">{step.icon}</div>
              <h2 className="text-xl font-bold text-white mb-2">{step.question}</h2>
              {step.sub && <p className="text-sm text-white/40 mb-6">{step.sub}</p>}
              <div className="space-y-3">
                {step.options.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleOption(option)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedValue === option.value
                        ? 'border-violet-500/60 bg-violet-500/15 text-white'
                        : 'border-white/5 bg-white/3 text-white/70 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {option.price > 0 && (
                      <span className={`text-sm font-semibold shrink-0 ml-3 ${selectedValue === option.value ? 'text-violet-300' : 'text-white/30'}`}>
                        +{formatPrice(option.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i < currentStep ? 'bg-violet-500 w-4' : i === currentStep ? 'bg-violet-400 w-6' : 'bg-white/10 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Results */
          <div className="w-full max-w-xl space-y-4">
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-900/20 to-indigo-900/10 p-8">
              <InternationalOfferBanner />
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🎯</div>
                <h2 className="text-2xl font-bold text-white mb-1">Your Project Estimate</h2>
                <p className="text-white/40 text-sm">Based on your answers, here's your personalized plan</p>
              </div>

              <div className="space-y-2 mb-6">
                {answers.filter(a => a.price > 0).map(a => (
                  <div key={a.stepId} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-white/70">{a.label}</span>
                    <span className="text-sm font-semibold text-violet-300">{formatPrice(a.price)}</span>
                  </div>
                ))}

                {/* Subtotal */}
                <div className="flex items-center justify-between py-2 text-sm text-white/50 pt-3 border-t border-white/10">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Bundle Discount */}
                {bundleDiscountPct > 0 && (
                  <div className="flex items-center justify-between py-2 text-sm text-green-400 font-medium">
                    <span>Bundle Discount ({bundleDiscountPct}%)</span>
                    <span>-{formatPrice(bundleDiscountAmount)}</span>
                  </div>
                )}

                {isInternational && transferFee > 0 && (
                  <div className="flex items-center justify-between py-2 text-sm text-white/40">
                    <span>Est. Bank Transfer Fee</span>
                    <span>{formatPrice(transferFee)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 border-t border-white/10 mt-2">
                  <span className="font-bold text-white text-base">Final Investment</span>
                  <span className="text-2xl font-bold text-violet-300">{formatPrice(finalEstimateUSD)}</span>
                </div>
              </div>

              {/* 🎉 Bundle Savings Box */}
              {bundleDiscountAmount > 0 && (
                <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-300 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎉</span> Bundle Savings
                  </div>
                  <div className="text-sm">
                    You saved <span className="font-bold text-white">{formatPrice(bundleDiscountAmount)}</span> because you selected multiple services!
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Add All to Cart →
                </button>
                <Link href="/quote" className="flex-1 py-3 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 font-semibold hover:bg-violet-500/20 transition-all text-center">
                  Custom Requirements →
                </Link>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => { setCurrentStep(0); setAnswers([]); setTotal(0); setDone(false) }}
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                ← Restart Calculator
              </button>
              <Link href="/cart" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                View Cart →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
