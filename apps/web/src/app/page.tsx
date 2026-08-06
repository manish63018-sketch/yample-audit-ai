'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HeroAnimation } from '@/components/hero/HeroAnimation'
import { Navbar } from '@/components/layout/navbar'
import { useCart } from '@/context/CartContext'
import { AIAssistantBot } from '@/components/journey/AIAssistantBot'
import { ComparePlansTable } from '@/components/pricing/ComparePlansTable'
import { ArrowRight, Search, Zap, CheckCircle2, ShieldCheck, TrendingUp, Award, Clock } from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'website-upgrade',
    icon: '⚡',
    title: 'Website Upgrade',
    short: 'Performance, SEO & UI overhaul',
    price: 599,
    timeline: '7 days',
    benefits: ['50%+ faster load time', 'Core Web Vitals fix', 'Modern responsive design'],
    description: 'We accelerate your existing website — Core Web Vitals, SEO structure, WCAG accessibility, and a modern UI refresh. No rebuild required.',
    badge: 'Most Popular',
  },
  {
    id: 'custom-website',
    icon: '🌐',
    title: 'Custom Website Development',
    short: 'Professional website from scratch',
    price: 899,
    timeline: '10 days',
    benefits: ['Custom branded design', 'Mobile-first', 'SEO-ready launch'],
    description: 'A professionally crafted Next.js website — designed for conversions, optimized for Google, and built to represent your brand.',
    badge: null,
  },
  {
    id: 'ai-automation',
    icon: '🤖',
    title: 'AI Automation & Chatbots',
    short: 'Custom AI assistants & lead agents',
    price: 799,
    timeline: '12 days',
    benefits: ['24/7 AI customer support', 'Lead qualification', 'WhatsApp integration'],
    description: 'Deploy AI assistants that handle customer queries, qualify leads automatically, and integrate with your CRM.',
    badge: '🔥 Hot',
  },
  {
    id: 'web-app',
    icon: '🖥️',
    title: 'Web Applications & SaaS',
    short: 'Full-stack web apps & dashboards',
    price: 1299,
    timeline: '18 days',
    benefits: ['React / Next.js frontend', 'Custom API backend', 'Database & auth'],
    description: 'Full-stack web applications — dashboards, booking systems, portals, and SaaS tools built with modern tech.',
    badge: null,
  },
  {
    id: 'mobile-app',
    icon: '📱',
    title: 'Mobile Applications',
    short: 'iOS & Android cross-platform app',
    price: 1499,
    timeline: '21 days',
    benefits: ['Cross-platform React Native', 'Push notifications', 'App Store ready'],
    description: 'Cross-platform mobile apps built with React Native — iOS & Android from a single codebase with native performance.',
    badge: null,
  },
  {
    id: 'enterprise-saas',
    icon: '☁️',
    title: 'Enterprise SaaS Platforms',
    short: 'Multi-tenant scalable platforms',
    price: 3499,
    timeline: 'Custom',
    benefits: ['Multi-tenant architecture', 'Subscription billing', 'Admin & analytics'],
    description: 'End-to-end SaaS platform development — multi-tenant architecture, Stripe billing, role-based access, and analytics built for scale.',
    badge: 'Enterprise',
  },
]

const PRICING = [
  {
    name: 'Starter Upgrade',
    price: '$599',
    highlight: false,
    badge: null,
    sub: 'Best for small businesses with an existing site',
    features: [
      'Full AI Website Audit Report',
      'Performance Acceleration (Core Web Vitals)',
      'On-Page SEO Overhaul & Meta Hierarchy',
      'WCAG AA Accessibility Fixes',
      'Security Headers Hardening',
      'Professional PDF Report',
      'AI Recommendations Engine',
      '30-Day Post-Launch Warranty',
    ],
    cta: 'Get Started',
    href: '/audit',
  },
  {
    name: 'Professional SaaS',
    price: '$1,999',
    highlight: true,
    badge: '⭐ Most Popular',
    sub: 'Full redesign + AI systems for growing businesses',
    features: [
      'Everything in Starter',
      'Complete Website Redesign (Vercel/Apple Feel)',
      '24/7 AI Lead Qualifier Assistant',
      'Lead CRM Integration',
      'WhatsApp Automation Flow',
      'Security Hardening & CSP Protection',
      'Conversion Rate Optimization (+44% Avg Boost)',
      '60-Day Priority Engineering Support',
    ],
    cta: 'Start Free Audit',
    href: '/audit',
  },
  {
    name: 'Enterprise Platform',
    price: '$5,000+',
    highlight: false,
    badge: 'Custom',
    sub: 'Bespoke SaaS, mobile apps & custom AI models',
    features: [
      'Everything in Professional',
      'Custom SaaS / Mobile App Development',
      'Custom AI Model Fine-Tuning',
      'Dedicated Engineering Team',
      'Advanced Analytics & Revenue Dashboard',
      'Multi-tenant Cloud Architecture',
      'CI/CD Pipeline & DevOps Infrastructure',
      '24/7 SLA & Dedicated Slack Channel',
    ],
    cta: 'Contact Us',
    href: '#contact',
  },
]

const TRUST_METRICS = [
  { value: '100+', label: 'Websites Audited', sub: 'Instant AI diagnostic reports', icon: '🌐', color: '#4F8CFF' },
  { value: '50+', label: 'Projects Delivered', sub: 'High-conversion SaaS web apps', icon: '🚀', color: '#8B5CF6' },
  { value: '99%', label: 'Client Satisfaction', sub: '5-star agency experience', icon: '⭐', color: '#38BDF8' },
  { value: '24/7', label: 'AI Monitoring', sub: 'Real-time issue detection', icon: '🤖', color: '#22C55E' },
]

const FAQS = [
  {
    q: 'How does AuditAI work?',
    a: 'Enter your website URL. Our AI instantly analyzes Performance (Core Web Vitals), SEO, Accessibility (WCAG AA), Security headers, and Business Growth opportunities. You receive a full report with scores, issue list, and AI-generated recommendations — in under 60 seconds.',
  },
  {
    q: 'How long does project delivery take?',
    a: 'Starter website upgrades are completed within 7 days. Professional packages take 14–21 days. Enterprise SaaS platforms are scoped with explicit milestones upfront.',
  },
  {
    q: 'What is included in the AI Report?',
    a: 'Every report includes: Executive Summary, Website Scorecards, Full Issues List, Business Impact Analysis, Recommended Solution, Suggested Package, Estimated Timeline, and actionable fix code.',
  },
  {
    q: 'Can I start with just the free audit?',
    a: 'Absolutely. The AI audit is 100% free — no sign-up or credit card required. Test your website first and explore recommended fixes before committing.',
  },
]

/* ─── Service Detail Popup ──────────────────────────────────────────── */
function ServiceDetailPopup({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) {
  const { addItem, items } = useCart()
  const isInCart = items.some(i => i.id === service.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl">✕</button>
        <div className="text-4xl mb-3">{service.icon}</div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-white">{service.title}</h3>
          {service.badge && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{service.badge}</span>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
        <div className="mb-4 space-y-2">
          {service.benefits.map(b => (
            <div key={b} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/10">
          <div>
            <div className="text-2xl font-bold text-white">
              {service.price === 0 ? 'Custom Quote' : `$${service.price}`}
            </div>
            <div className="text-xs text-slate-400">Est. timeline: {service.timeline}</div>
          </div>
          <button
            onClick={() => {
              if (service.price > 0) {
                addItem({ id: service.id, name: service.title, price: service.price, timeline: service.timeline, benefits: service.benefits, category: 'service' })
              }
              onClose()
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isInCart ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'btn-gradient-primary'
            }`}
          >
            {isInCart ? '✓ In Cart' : service.price === 0 ? 'Contact Us' : 'Add to Cart →'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page Component ─────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter()
  const [urlInput, setUrlInput] = useState('')
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const handleAuditSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    router.push(`/audit?url=${encodeURIComponent(urlInput.trim())}`)
  }

  return (
    <div className="aurora-bg min-h-screen text-slate-100 selection:bg-purple-500/30 selection:text-white overflow-hidden">
      {/* Background Aurora Orbs */}
      <div className="aurora-orb-1" />
      <div className="aurora-orb-2" />
      <div className="aurora-orb-3" />

      {/* Sticky Header */}
      <Navbar />

      <main id="main-content" className="relative z-10">

        {/* ═══════════════════════════════════════════════════════
            1. HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text & URL Input */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                AuditAI by Yample Labs
              </div>

              {/* Main Headline (Replaced as requested) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Turn Your Website Into a{' '}
                <span className="gradient-text-accent">Revenue Machine</span>
              </h1>

              {/* Subheading (Replaced as requested) */}
              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                AI-powered Website Audit, Business Intelligence, Growth Roadmap and Development Platform.
              </p>

              {/* BIGGEST FEATURE: Hero URL Audit Input Bar */}
              <form
                onSubmit={handleAuditSubmit}
                className="my-6 p-2 rounded-2xl bg-[#0F172A]/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-xl group hover:border-purple-500/60 transition-all duration-300 glow-purple"
              >
                <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                  <Search className="w-5 h-5 text-purple-400 shrink-0" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="Paste Website URL (e.g., https://yourwebsite.com)"
                    required
                    className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gradient-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Analyze</span>
                  <Zap className="w-4 h-4 fill-white" />
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/audit"
                  className="btn-gradient-primary px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  🚀 Start Free Audit
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/sample-report"
                  className="btn-glass-secondary px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  📊 View Sample Report
                </Link>
              </div>

              {/* Sub-text trust indicators */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant 60s report</span>
                </div>
              </div>
            </div>

            {/* Right Hero Animation (8-Stage Pipeline) */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. TRUST METRICS SECTION
        ═══════════════════════════════════════════════════════ */}
        <section className="py-16 border-y border-white/5 bg-[#0F172A]/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {TRUST_METRICS.map((m, i) => (
                <div
                  key={i}
                  className="glass-card p-6 text-center group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{m.icon}</div>
                  <div className="text-4xl font-extrabold text-white tracking-tight mb-1" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="text-sm font-bold text-slate-200">{m.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. DASHBOARD BEFORE -> AFTER SCORE TRANSFORMATION MOCKUP
        ═══════════════════════════════════════════════════════ */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold">
                Live Audit Results Demo
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Before vs. After Optimization
              </h2>
              <p className="text-slate-400 text-base">
                Real measurable performance & conversion jumps delivered for clients across every audit dimension.
              </p>
            </div>

            {/* Score Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Performance', before: 48, after: 92, boost: '+44 Boost', color: '#22C55E' },
                { label: 'SEO Signal', before: 67, after: 100, boost: '+33 Boost', color: '#4F8CFF' },
                { label: 'Accessibility', before: 71, after: 96, boost: '+25 Boost', color: '#8B5CF6' },
                { label: 'Business Score', before: 42, after: 89, boost: '+47 Boost', color: '#EC4899' },
              ].map((card, i) => (
                <div key={i} className="glass-card p-6 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {card.boost}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between my-4">
                    <div>
                      <div className="text-xs text-slate-400">Before</div>
                      <div className="text-2xl font-bold text-slate-400 line-through">{card.before}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                    <div className="text-right">
                      <div className="text-xs text-emerald-400 font-semibold">After Audit</div>
                      <div className="text-4xl font-extrabold text-white" style={{ color: card.color }}>
                        {card.after}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Optimization score</span>
                      <span>{card.after}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${card.after}%`, background: card.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. SERVICES & SOLUTIONS ($599 - $5000)
        ═══════════════════════════════════════════════════════ */}
        <section id="services" className="py-24 border-t border-white/5 bg-[#050816]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold">
                High Impact Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Our Premium Services</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Click any service to inspect full scope, timeline, and add to project plan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map(service => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="glass-card p-6 cursor-pointer flex flex-col justify-between group hover:border-purple-500/50"
                >
                  <div>
                    {service.badge && (
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
                        {service.badge}
                      </span>
                    )}
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">{service.short}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Starting at</span>
                      <div className="text-lg font-bold text-white">
                        {service.price === 0 ? 'Custom' : `$${service.price}`}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Scope →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. TRANSPARENT PRICING
        ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold">
                Transparent Pricing
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Fixed Investment Plans</h2>
              <p className="text-slate-400">Start with a free audit. Choose a package when ready. No hidden fees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PRICING.map(plan => (
                <div
                  key={plan.name}
                  className={`glass-card p-8 relative flex flex-col justify-between ${
                    plan.highlight
                      ? 'border-purple-500/60 bg-gradient-to-b from-purple-900/20 to-slate-900 shadow-2xl glow-purple'
                      : ''
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-bold text-slate-300 mb-1">{plan.name}</div>
                    <div className="text-4xl font-extrabold text-white mb-2">{plan.price}</div>
                    <div className="text-xs text-slate-400 mb-6">{plan.sub}</div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all ${
                      plan.highlight ? 'btn-gradient-primary shadow-lg' : 'btn-glass-secondary'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Plan Comparison Table */}
            <ComparePlansTable />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            6. FAQ SECTION
        ═══════════════════════════════════════════════════════ */}
        <section id="faq" className="py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-slate-400 text-sm">Everything you need to know about AuditAI platform.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-200 text-sm hover:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400">{activeFaq === i ? '−' : '+'}</span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            7. FOOTER CTA & CONTACT
        ═══════════════════════════════════════════════════════ */}
        <section id="contact" className="py-24 border-t border-white/5 bg-[#050816]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <div className="glass-card p-12 relative overflow-hidden bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-slate-900">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Ready to Turn Your Website Into a Revenue Machine?
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
                Get your instant free website audit or connect with our engineering team for a custom quote.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/audit" className="btn-gradient-primary px-8 py-4 rounded-xl font-bold text-sm">
                  🚀 Launch Free Audit Now
                </Link>
                <Link href="/calculator" className="btn-glass-secondary px-8 py-4 rounded-xl font-bold text-sm">
                  🧮 Use Project Calculator
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 pt-8 border-t border-white/10">
              <div>© 2026 Yample Labs. All rights reserved.</div>
              <div className="flex gap-6">
                <Link href="/sample-report" className="hover:text-white">Sample Report</Link>
                <Link href="/case-studies" className="hover:text-white">Case Studies</Link>
                <a href="mailto:yamplelabs@gmail.com" className="hover:text-white">yamplelabs@gmail.com</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating AI Assistant Orb */}
      <AIAssistantBot />

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailPopup service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  )
}

