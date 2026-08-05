'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HeroAnimation } from '@/components/hero/HeroAnimation'
import { useCart } from '@/context/CartContext'
import { AIAssistantBot } from '@/components/journey/AIAssistantBot'

/* ─── Service data ─────────────────────────────────────────────────── */
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
    id: 'business-website',
    icon: '🌐',
    title: 'Business Website',
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
    title: 'AI Automation',
    short: 'Custom AI assistants & chatbots',
    price: 799,
    timeline: '12 days',
    benefits: ['24/7 AI customer support', 'Lead qualification', 'WhatsApp integration'],
    description: 'Deploy AI assistants that handle customer queries, qualify leads automatically, and integrate with your CRM.',
    badge: '🔥 Hot',
  },
  {
    id: 'crm',
    icon: '📋',
    title: 'CRM System',
    short: 'Customer management platform',
    price: 699,
    timeline: '14 days',
    benefits: ['Lead pipeline tracking', 'Auto follow-up', 'Team collaboration'],
    description: 'A custom CRM built for your sales workflow — leads, pipeline, follow-ups, WhatsApp integration, and analytics dashboard.',
    badge: null,
  },
  {
    id: 'pos',
    icon: '🏪',
    title: 'POS System',
    short: 'Point of sale for retail/restaurants',
    price: 999,
    timeline: '16 days',
    benefits: ['Inventory management', 'Sales reports', 'Multi-terminal support'],
    description: 'A full-featured POS system with inventory, invoices, daily sales reports, and optional WhatsApp receipt delivery.',
    badge: null,
  },
  {
    id: 'mobile-app',
    icon: '📱',
    title: 'Mobile App',
    short: 'iOS & Android application',
    price: 1499,
    timeline: '21 days',
    benefits: ['Cross-platform React Native', 'Push notifications', 'App Store ready'],
    description: 'Cross-platform mobile apps built with React Native — iOS & Android from a single codebase with native performance.',
    badge: null,
  },
  {
    id: 'custom-software',
    icon: '⚙️',
    title: 'Custom Software',
    short: 'Bespoke SaaS & enterprise tools',
    price: 0,
    timeline: 'Custom',
    benefits: ['Tailored architecture', 'Dedicated team', '24/7 SLA support'],
    description: 'Enterprise-grade custom software — multi-tenant SaaS, internal tools, and full-stack platforms designed for scale.',
    badge: 'Enterprise',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: '$599',
    highlight: false,
    badge: null,
    sub: 'Best for small businesses with an existing site',
    features: [
      'Full AuditAI Website Analysis',
      'Performance Acceleration (Core Web Vitals)',
      'On-Page SEO Overhaul',
      'WCAG AA Accessibility Fixes',
      'Security Headers Hardening',
      'Professional PDF Report',
      'Basic AI Recommendations',
      '30-Day Post-Launch Warranty',
    ],
    cta: 'Get Started',
    href: '/audit',
  },
  {
    name: 'Professional',
    price: '$1,999',
    highlight: true,
    badge: '⭐ Most Popular',
    sub: 'Full redesign + AI systems for growing businesses',
    features: [
      'Everything in Starter',
      'Complete Website Redesign',
      'Advanced AI Customer Assistant (24/7)',
      'Lead CRM Integration',
      'WhatsApp Automation Flow',
      'Security Hardening & CSP',
      'Conversion Rate Optimization',
      '60-Day Priority Support',
    ],
    cta: 'Start Free Audit',
    href: '/audit',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    highlight: false,
    badge: null,
    sub: 'Bespoke SaaS, mobile apps & AI systems',
    features: [
      'Everything in Professional',
      'Custom SaaS / Mobile App Development',
      'Custom AI Model Training',
      'Dedicated Engineering Team',
      'Advanced Analytics Dashboard',
      'Multi-tenant Architecture',
      'CI/CD Pipeline & DevOps',
      '24/7 SLA & Dedicated Support',
    ],
    cta: 'Contact Us',
    href: '#contact',
  },
]

const FAQS = [
  { q: 'How does the free audit work?', a: 'Enter your website URL and our AI will analyze Performance, SEO, Accessibility, Security, and Business Growth — fully automated in 60 seconds. No signup required.' },
  { q: 'How long does development take?', a: 'Starter upgrades typically complete in 7 days. Professional packages in 14-21 days. Enterprise timelines are scoped per project.' },
  { q: 'What is the AI Assistant?', a: 'A custom-trained conversational AI deployed on your website — handles customer FAQs, qualifies leads, books appointments, and syncs to your CRM 24/7.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes. Every package includes a post-launch warranty period. If agreed deliverables are not met, we provide full remediation at no extra cost.' },
  { q: 'Can I start with just the audit?', a: 'Absolutely. The AI audit is free. Review your report and AI recommendations first — then choose services if and when you are ready.' },
  { q: 'What happens after I submit the form?', a: 'You receive your audit report immediately. For services, our team contacts you within 24 hours to review your growth plan and finalize the proposal.' },
]

/* ─── Service Detail Popup ──────────────────────────────────────────── */
function ServiceDetailPopup({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) {
  const { addItem, items } = useCart()
  const isInCart = items.some(i => i.id === service.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl">✕</button>
        <div className="text-3xl mb-3">{service.icon}</div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-white">{service.title}</h3>
          {service.badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{service.badge}</span>
          )}
        </div>
        <p className="text-white/60 text-sm mb-4 leading-relaxed">{service.description}</p>
        <div className="mb-4 space-y-2">
          {service.benefits.map(b => (
            <div key={b} className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-green-400">✓</span> {b}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/5">
          <div>
            <div className="text-2xl font-bold text-white">
              {service.price === 0 ? 'Custom Quote' : `$${service.price}`}
            </div>
            <div className="text-xs text-white/40">Est. timeline: {service.timeline}</div>
          </div>
          <button
            onClick={() => {
              if (service.price > 0) {
                addItem({
                  id: service.id,
                  name: service.title,
                  price: service.price,
                  timeline: service.timeline,
                  benefits: service.benefits,
                  category: 'service',
                })
              }
              onClose()
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isInCart
                ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-default'
                : service.price === 0
                ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90'
            }`}
          >
            {isInCart ? '✓ In Cart' : service.price === 0 ? 'Contact Us' : 'Add to Cart →'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────────── */
function Navbar() {
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#08080f]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-white">
          <span className="text-xl">🔍</span>
          <span>AuditAI</span>
          <span className="text-white/30 text-sm font-normal">by Yample Labs</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
          <Link href="/sample-report" className="hover:text-white transition-colors">Sample Report</Link>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-lg">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-white text-[10px] flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/audit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Free Audit →
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen bg-[#08080f] text-white overflow-hidden">

        {/* ── 1. HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-20">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                AI Website Intelligence Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                <span className="text-white">AuditAI</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  by Yample Labs
                </span>
              </h1>
              <p className="text-2xl text-white/50 font-light mb-3 tracking-wide">
                Analyze • Upgrade • Grow
              </p>
              <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-lg">
                Transform your website into a business growth engine. AI-powered audit, personalized roadmap, and expert execution — all in one platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/audit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
                >
                  🚀 Start Free Audit
                </Link>
                <Link
                  href="/sample-report"
                  className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  📊 View Sample Report
                </Link>
                <Link
                  href="/calculator"
                  className="px-6 py-3.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 font-semibold text-base hover:bg-violet-500/20 transition-all"
                >
                  🧮 Project Calculator
                </Link>
              </div>
            </div>

            {/* Right: Hero Animation */}
            <div className="flex justify-center">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* ── 2. WHAT AUDITAI DOES ───────────────────────────── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">What AuditAI Does</h2>
              <p className="text-white/50 max-w-2xl mx-auto">One platform. Five dimensions. Complete business intelligence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { icon: '⚡', step: '01', title: 'Website Audit', desc: 'Deep Core Web Vitals, PageSpeed, Lighthouse analysis.' },
                { icon: '🔍', step: '02', title: 'Business Analysis', desc: 'Conversion friction, revenue leaks, growth opportunities.' },
                { icon: '📈', step: '03', title: 'Growth Roadmap', desc: '30-60-90 day action plan generated by AI.' },
                { icon: '📄', step: '04', title: 'Proposal', desc: 'Branded PDF proposal with timeline & investment.' },
                { icon: '🚀', step: '05', title: 'Development', desc: 'Expert execution with post-launch warranty.' },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  {i < 4 && (
                    <div className="absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet-500/30 to-transparent hidden md:block z-0" />
                  )}
                  <div className="relative z-10 p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-violet-500/20 transition-all text-center group-hover:-translate-y-1 duration-300">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-xs text-violet-400 font-mono mb-1">{item.step}</div>
                    <div className="font-semibold text-white mb-2">{item.title}</div>
                    <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. SERVICES ────────────────────────────────────── */}
        <section id="services" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-white/50 max-w-xl mx-auto">Click any service to see details, benefits, and add it to your project cart.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group text-left p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-violet-500/20 transition-all hover:-translate-y-1 duration-300 cursor-pointer"
                >
                  {service.badge && (
                    <div className="mb-2 inline-block text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                      {service.badge}
                    </div>
                  )}
                  <div className="text-2xl mb-3">{service.icon}</div>
                  <div className="font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{service.title}</div>
                  <div className="text-xs text-white/40 mb-3">{service.short}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-violet-400">
                      {service.price === 0 ? 'Custom' : `$${service.price}`}
                    </span>
                    <span className="text-xs text-white/30 group-hover:text-white/60 transition-colors">View details →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. PROJECT CALCULATOR CTA ──────────────────────── */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-10 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative">
                <div className="text-4xl mb-4">🧮</div>
                <h2 className="text-3xl font-bold text-white mb-3">Project Calculator</h2>
                <p className="text-white/50 mb-6 max-w-xl mx-auto">Answer 10 quick questions about your business. Get an instant, itemized project estimate — updated live with every click.</p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {['Business Type', 'Need CRM?', 'Need AI?', 'Mobile App?', 'Need POS?'].map(q => (
                    <span key={q} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">{q}</span>
                  ))}
                </div>
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
                >
                  Calculate My Project →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. WHY YAMPLE LABS ─────────────────────────────── */}
        <section id="why-us" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Yample Labs</h2>
              <p className="text-white/50">Not just an agency. Your long-term technology partner.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Multi-provider AI router (Claude, OpenAI, Gemini) for the deepest insights.' },
                { icon: '🎨', title: 'Premium UI/UX', desc: 'Geist typography, dark mode elegance, and micro-animations throughout.' },
                { icon: '⚡', title: 'Modern Technology', desc: 'Next.js 16, Supabase, TypeScript, Turbopack — enterprise-grade stack.' },
                { icon: '📈', title: 'Business-Focused', desc: 'Every decision is optimized to increase revenue and conversion rate.' },
                { icon: '💰', title: 'Transparent Pricing', desc: 'Fixed packages ($599, $1,999) — no hidden fees, no surprises.' },
                { icon: '🏗️', title: 'Scalable Architecture', desc: 'Monorepo, RLS policies, and multi-tenant design for enterprise growth.' },
                { icon: '🛡️', title: 'Security-First', desc: 'CSP headers, HTTPS enforcement, WCAG compliance on every project.' },
                { icon: '🤝', title: 'Long-Term Support', desc: 'Post-launch warranty, monitoring, and a dedicated support channel.' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-semibold text-white mb-1">{item.title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PRICING ─────────────────────────────────────── */}
        <section id="pricing" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
              <p className="text-white/50">Start with a free audit. Choose a plan when you are ready.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PRICING.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 border transition-all ${
                    plan.highlight
                      ? 'border-violet-500/50 bg-gradient-to-b from-violet-900/30 to-indigo-900/20 shadow-xl shadow-violet-500/10'
                      : 'border-white/5 bg-white/2'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-500/30">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-1 text-white/50 text-sm font-medium">{plan.name}</div>
                  <div className="text-4xl font-bold text-white mb-1">{plan.price}</div>
                  <div className="text-xs text-white/40 mb-5">{plan.sub}</div>
                  <div className="space-y-2.5 mb-6">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-green-400 mt-0.5 shrink-0">✓</span> {f}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={plan.href}
                    className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-violet-500/20'
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. PROCESS ─────────────────────────────────────── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Your Growth Journey</h2>
              <p className="text-white/50">From audit to results — a clear path every step of the way.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { n: '1', icon: '🔍', title: 'Free Audit', color: '#6366f1' },
                { n: '2', icon: '📊', title: 'AI Analysis', color: '#8b5cf6' },
                { n: '3', icon: '🗺️', title: 'Growth Roadmap', color: '#a855f7' },
                { n: '4', icon: '📄', title: 'Proposal', color: '#ec4899' },
                { n: '5', icon: '⚙️', title: 'Development', color: '#3b82f6' },
                { n: '6', icon: '🚀', title: 'Growth', color: '#10b981' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 border" style={{ color: step.color, borderColor: `${step.color}40`, background: `${step.color}15` }}>{step.n}</div>
                  <div className="text-xl mb-1">{step.icon}</div>
                  <div className="text-xs font-medium text-white/70">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FAQ ─────────────────────────────────────────── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked</h2>
            </div>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-white/2 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
                  >
                    <span className="text-sm font-medium text-white/90">{faq.q}</span>
                    <span className={`text-white/30 transition-transform duration-300 ml-3 shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-4 pb-4 text-sm text-white/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CONTACT / FOOTER ────────────────────────────── */}
        <section id="contact" className="py-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Let's Build Your Growth Engine</h2>
            <p className="text-white/50 mb-10 text-lg">Start with a free audit. No commitment. No credit card.</p>
            <Link href="/audit" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 mb-12">
              🚀 Start Your Free Audit Now
            </Link>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <a href="mailto:yamplelabs@gmail.com" className="hover:text-white/70 transition-colors">📧 yamplelabs@gmail.com</a>
              <a href="https://instagram.com/yamplelabs" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">📸 @yamplelabs</a>
              <a href="https://instagram.com/mannish_2323" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">💬 @mannish_2323</a>
              <a href="https://github.com/manish63018-sketch" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">💻 GitHub</a>
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 text-xs text-white/20">
              © 2025 Yample Labs. All rights reserved. AuditAI — AI Website Intelligence Platform.
            </div>
          </div>
        </section>
      </main>

      {/* Service Detail Popup */}
      <AIAssistantBot idleSeconds={30} />

      {selectedService && (
        <ServiceDetailPopup service={selectedService} onClose={() => setSelectedService(null)} />
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3.5s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </>
  )
}
