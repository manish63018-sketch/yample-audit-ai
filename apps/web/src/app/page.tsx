'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HeroAnimation } from '@/components/hero/HeroAnimation'
import { useCart } from '@/context/CartContext'
import { AIAssistantBot } from '@/components/journey/AIAssistantBot'

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
    title: 'AI Automation',
    short: 'Custom AI assistants & chatbots',
    price: 799,
    timeline: '12 days',
    benefits: ['24/7 AI customer support', 'Lead qualification', 'WhatsApp integration'],
    description: 'Deploy AI assistants that handle customer queries, qualify leads automatically, and integrate with your CRM.',
    badge: '🔥 Hot',
  },
  {
    id: 'web-app',
    icon: '🖥️',
    title: 'Web Applications',
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
    title: 'Mobile Apps',
    short: 'iOS & Android application',
    price: 1499,
    timeline: '21 days',
    benefits: ['Cross-platform React Native', 'Push notifications', 'App Store ready'],
    description: 'Cross-platform mobile apps built with React Native — iOS & Android from a single codebase with native performance.',
    badge: null,
  },
  {
    id: 'saas',
    icon: '☁️',
    title: 'SaaS Development',
    short: 'Multi-tenant SaaS platforms',
    price: 0,
    timeline: 'Custom',
    benefits: ['Multi-tenant architecture', 'Subscription billing', 'Admin & analytics'],
    description: 'End-to-end SaaS platform development — multi-tenant architecture, Stripe billing, role-based access, and analytics built for scale.',
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
      'Full AI Website Audit',
      'Performance Acceleration (Core Web Vitals)',
      'On-Page SEO Overhaul',
      'WCAG AA Accessibility Fixes',
      'Security Headers Hardening',
      'Professional PDF Report',
      'AI Recommendations',
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
      'AI Customer Assistant (24/7)',
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
    price: 'Custom Quote',
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
  {
    q: 'How does AuditAI work?',
    a: 'Enter your website URL. Our AI instantly analyzes Performance (Core Web Vitals), SEO, Accessibility (WCAG AA), Security headers, and Business Growth opportunities. You receive a full report with scores, issue list, and AI-generated recommendations — in under 60 seconds. No sign-up required.',
  },
  {
    q: 'How long does development take?',
    a: 'Starter upgrades are typically complete in 7 days. Professional packages take 14–21 days. Enterprise timelines are scoped per project and agreed upfront before development begins.',
  },
  {
    q: 'What is included in the report?',
    a: 'Every report includes: Cover Page (Yample Labs branding), Executive Summary, Website Score, Full Issues List, Business Impact Analysis, Recommended Solution, Suggested Package, Estimated Timeline, and our Contact Details — delivered as a professional PDF.',
  },
  {
    q: 'What is the AI Assistant?',
    a: 'A custom-trained conversational AI deployed on your website. It handles customer FAQs 24/7, qualifies leads automatically, books appointments, answers product questions, and syncs data to your CRM. Available in Professional and Enterprise plans.',
  },
  {
    q: 'How do I get support after launch?',
    a: 'Every package includes a post-launch warranty period. Starter includes 30-day support. Professional includes 60-day priority support. Enterprise includes a 24/7 SLA and a dedicated support channel. You can always reach us at yamplelabs@gmail.com.',
  },
  {
    q: 'Can I start with just the free audit?',
    a: 'Absolutely. The AI audit is 100% free — no sign-up, no credit card. Review your report and AI recommendations first, then choose services when you\'re ready. Our team never pressures you.',
  },
]

/* ─── Service Detail Popup ──────────────────────────────────────────── */
function ServiceDetailPopup({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) {
  const { addItem, items } = useCart()
  const isInCart = items.some(i => i.id === service.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out' }}
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
                addItem({ id: service.id, name: service.title, price: service.price, timeline: service.timeline, benefits: service.benefits, category: 'service' })
              }
              onClose()
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isInCart ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-default'
                : service.price === 0 ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#08080f]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-white">
          <span className="text-xl">🔍</span>
          <span>AuditAI</span>
          <span className="text-white/30 text-sm font-normal hidden sm:inline">by Yample Labs</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a href="#what-we-do" className="hover:text-white transition-colors">What We Do</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/sample-report" className="hover:text-white transition-colors">Sample Report</Link>
          <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-lg">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-white text-[10px] flex items-center justify-center font-bold">{itemCount}</span>
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

        {/* ═══════════════════════════════════════════════════════
            1. HERO
        ═══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                AI Website Intelligence Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-3">
                <span className="text-white">AuditAI</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">by Yample Labs</span>
              </h1>
              <p className="text-2xl text-white/40 font-light mb-3 tracking-widest">
                Analyze • Upgrade • Grow
              </p>
              <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-lg">
                Transform your website into a business growth engine. AI-powered audit, personalized roadmap, and expert execution — all in one platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/audit" className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40">
                  🚀 Start Free Audit
                </Link>
                <Link href="/sample-report" className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all backdrop-blur-sm">
                  📊 View Sample Report
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. WHAT AUDITAI DOES
        ═══════════════════════════════════════════════════════ */}
        <section id="what-we-do" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                Platform Capabilities
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">What AuditAI Does</h2>
              <p className="text-white/50 max-w-2xl mx-auto">Seven AI-powered analysis dimensions. One clear report. Zero guesswork.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '⚡', title: 'Website Performance', desc: 'Core Web Vitals (LCP, CLS, INP), PageSpeed, TTFB, load time, caching, image optimization — all measured against Google\'s standards.', color: '#10b981' },
                { icon: '🔍', title: 'SEO Analysis', desc: 'Title tags, meta descriptions, heading hierarchy, internal linking, canonical tags, structured data, and keyword opportunity analysis.', color: '#6366f1' },
                { icon: '♿', title: 'Accessibility Analysis', desc: 'WCAG AA compliance check — color contrast, ARIA labels, keyboard navigation, screen reader compatibility, and tab order.', color: '#3b82f6' },
                { icon: '🛡️', title: 'Security Analysis', desc: 'HTTPS enforcement, CSP headers, HSTS, X-Frame-Options, clickjacking protection, mixed content, and vulnerability scanning.', color: '#f59e0b' },
                { icon: '📈', title: 'Business Growth Analysis', desc: 'Conversion paths, CTA placement, bounce rate signals, lead capture friction, trust indicators, and revenue opportunity estimation.', color: '#ec4899' },
                { icon: '🤖', title: 'AI Recommendations', desc: 'Not just issues — AI explains WHY each problem matters to your business and provides a prioritized, actionable fix plan.', color: '#a855f7' },
                { icon: '📄', title: 'Professional PDF Reports', desc: 'Branded reports with Cover Page, Executive Summary, Score Cards, Issues, Business Impact, Solutions, Timeline, and Contact Details.', color: '#f97316' },
                { icon: '🗺️', title: '30-60-90 Day Roadmap', desc: 'AI generates your personalized business growth roadmap with recommended services, investment breakdown, and expected outcomes.', color: '#14b8a6' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 border"
                    style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                  >
                    {item.icon}
                  </div>
                  <div className="font-semibold text-white mb-2 text-sm group-hover:text-violet-300 transition-colors">{item.title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. WHY CHOOSE YAMPLE LABS
        ═══════════════════════════════════════════════════════ */}
        <section id="why-us" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                Why Us
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Yample Labs</h2>
              <p className="text-white/50">Not just an agency. Your long-term technology partner.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Multi-model AI (Claude, Gemini, GPT-4) for the deepest insights and most accurate recommendations.' },
                { icon: '🎨', title: 'Premium UI/UX', desc: 'Geist typography, dark-mode elegance, micro-animations — every interface feels premium out of the box.' },
                { icon: '⚡', title: 'Modern Technology', desc: 'Next.js 16, Supabase, TypeScript, Turbopack — an enterprise-grade stack that scales with your business.' },
                { icon: '📈', title: 'Business-Focused Solutions', desc: 'Every technical decision is optimized to increase your revenue, conversions, and customer satisfaction.' },
                { icon: '💰', title: 'Transparent Pricing', desc: 'Fixed packages at $599 and $1,999 — no hidden fees, no hourly billing surprises.' },
                { icon: '🏗️', title: 'Scalable Architecture', desc: 'Monorepo, RLS policies, and multi-tenant design built to grow from 10 to 10,000 users.' },
                { icon: '🛡️', title: 'Security-First', desc: 'CSP headers, HTTPS, WCAG compliance, and OWASP best practices on every single project.' },
                { icon: '🤝', title: 'Long-Term Support', desc: 'Post-launch warranty, uptime monitoring, and a dedicated support channel for every client.' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-violet-500/15 transition-all duration-300">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-semibold text-white mb-1 text-sm">{item.title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. OUR SERVICES
        ═══════════════════════════════════════════════════════ */}
        <section id="services" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                Services
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-white/50 max-w-xl mx-auto">Click any service to see full details and add it to your project plan.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group text-left p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-violet-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {service.badge && (
                    <div className="mb-2 inline-block text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                      {service.badge}
                    </div>
                  )}
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <div className="font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{service.title}</div>
                  <div className="text-xs text-white/40 mb-4 leading-relaxed">{service.short}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-violet-400">
                      {service.price === 0 ? 'Custom' : `from $${service.price}`}
                    </span>
                    <span className="text-xs text-white/20 group-hover:text-white/50 transition-colors">View details →</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/calculator" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/20 bg-violet-500/8 text-violet-300 font-medium text-sm hover:bg-violet-500/15 transition-all">
                🧮 Use Project Calculator to get your custom estimate →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. PRICING
        ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                Pricing
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
              <p className="text-white/50">Start with a free audit. Choose a plan when you are ready. No pressure, ever.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PRICING.map(plan => (
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

        {/* ═══════════════════════════════════════════════════════
            6. AI ASSISTANT
        ═══════════════════════════════════════════════════════ */}
        <section id="ai-assistant" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Explainer */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-6">
                  🤖 AI Assistant
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Your 24/7 AI<br />Business Assistant
                </h2>
                <p className="text-white/60 mb-6 leading-relaxed">
                  A custom-trained AI deployed on your website — works around the clock to capture leads, answer questions, and book appointments. Your sales team, multiplied by AI.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: '🕐', title: '24/7 Customer Support', desc: 'Never miss a customer query. AI answers instantly, at any hour.', plan: 'All Plans' },
                    { icon: '🎯', title: 'Lead Collection & Qualification', desc: 'Captures visitor details, qualifies intent, and alerts your team for hot leads.', plan: 'All Plans' },
                    { icon: '💬', title: 'FAQ Answers', desc: 'Trained on your business — answers product, pricing, and service questions accurately.', plan: 'All Plans' },
                    { icon: '📅', title: 'Appointment Support', desc: 'Books calls, consultations, or in-store visits automatically.', plan: 'Professional+' },
                    { icon: '📦', title: 'Order Support', desc: 'Handles order tracking, returns, and post-purchase queries.', plan: 'Professional+' },
                    { icon: '🔗', title: 'CRM Integration', desc: 'All leads and conversations sync to your CRM automatically.', plan: 'Professional / Enterprise' },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-base shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-white">{item.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5">{item.plan}</span>
                        </div>
                        <div className="text-xs text-white/40">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right: Chat preview mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600/5 rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl border border-white/8 bg-[#0d0d14] overflow-hidden shadow-2xl">
                  <div className="border-b border-white/5 px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-base">🤖</div>
                    <div>
                      <div className="text-xs font-semibold text-white">AI Assistant</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Online • Typically replies instantly
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 min-h-[240px]">
                    {[
                      { from: 'bot', msg: 'Hello! 👋 Welcome to Yample Labs. How can I help you today?' },
                      { from: 'user', msg: 'I need a new website for my restaurant.' },
                      { from: 'bot', msg: 'Great choice! 🍕 We build beautiful restaurant websites with online menus, booking, and WhatsApp ordering. Can I grab your details to prepare a custom quote?' },
                      { from: 'user', msg: 'Sure, my name is Alex.' },
                      { from: 'bot', msg: '✅ Thanks Alex! I\'ve created a lead profile for you. A specialist from Yample Labs will reach out within 24 hours. Meanwhile, would you like to start a free website audit?' },
                    ].map((m, i) => (
                      <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                            m.from === 'user'
                              ? 'bg-violet-600/80 text-white rounded-br-none'
                              : 'bg-white/6 text-white/80 rounded-bl-none'
                          }`}
                        >
                          {m.msg}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/5 px-3 py-2 flex items-center gap-2">
                    <input readOnly placeholder="Type your message..." className="flex-1 text-xs text-white/30 bg-transparent outline-none placeholder-white/20" />
                    <button className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs">→</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            7. SAMPLE REPORT
        ═══════════════════════════════════════════════════════ */}
        <section id="sample-report" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                Sample Report
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">See a Real Audit Report</h2>
              <p className="text-white/50 max-w-xl mx-auto">Every detail, every score, every recommendation — see exactly what you get.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Report Preview Card */}
              <div className="rounded-2xl border border-white/8 bg-[#0d0d14] overflow-hidden shadow-2xl">
                {/* Cover bar */}
                <div className="h-2 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500" />
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">🔍</div>
                    <div>
                      <div className="font-bold text-white text-sm">AuditAI Report</div>
                      <div className="text-xs text-white/30">by Yample Labs</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/30">example-website.com • August 2025</div>
                </div>
                {/* Score row */}
                <div className="grid grid-cols-5 divide-x divide-white/5 border-b border-white/5">
                  {[
                    { label: 'Performance', score: 72, color: '#f59e0b' },
                    { label: 'SEO', score: 64, color: '#f59e0b' },
                    { label: 'Accessibility', score: 58, color: '#ef4444' },
                    { label: 'Security', score: 81, color: '#10b981' },
                    { label: 'Business', score: 45, color: '#ef4444' },
                  ].map(s => (
                    <div key={s.label} className="py-4 text-center">
                      <div className="text-2xl font-bold" style={{ color: s.color }}>{s.score}</div>
                      <div className="text-[9px] text-white/30 mt-0.5">{s.label}</div>
                      <div className="mx-3 mt-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Issues preview */}
                <div className="p-5 space-y-2">
                  {[
                    { sev: '🔴', cat: 'Performance', title: 'LCP is 4.8s — should be under 2.5s', impact: 'High bounce rate' },
                    { sev: '🔴', cat: 'SEO', title: 'Missing meta descriptions on 8 pages', impact: '30% fewer clicks' },
                    { sev: '🔴', cat: 'Business', title: 'No CTA visible above the fold', impact: '40% drop-off' },
                    { sev: '🟡', cat: 'Accessibility', title: 'Color contrast ratio 2.4:1 (WCAG requires 4.5:1)', impact: 'WCAG fail' },
                    { sev: '🟡', cat: 'Security', title: 'Content-Security-Policy header missing', impact: 'XSS vulnerability' },
                  ].map((issue, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/2 border border-white/3 text-xs">
                      <span>{issue.sev}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/40">{issue.cat}</span>
                      <span className="flex-1 text-white/60 truncate">{issue.title}</span>
                      <span className="text-white/25 shrink-0 hidden sm:block">{issue.impact}</span>
                    </div>
                  ))}
                  <div className="text-center py-2 text-xs text-white/20">+ 12 more issues in the full report</div>
                </div>
                {/* Report includes */}
                <div className="border-t border-white/5 px-5 py-4">
                  <div className="text-xs text-white/30 mb-3 font-medium">Report includes:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Cover Page', 'Executive Summary', 'Score Cards', 'Issues List', 'Business Impact', 'AI Recommendations', 'Suggested Package', 'Estimated Timeline', 'Contact Details'].map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <span className="text-green-400">✓</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link href="/sample-report" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20">
                  📊 View Sample Report
                </Link>
                <a href="/sample-report.pdf" download className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all">
                  ⬇️ Download Sample Report
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            8. OUR PROCESS
        ═══════════════════════════════════════════════════════ */}
        <section id="process" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                Our Process
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Your Growth Journey</h2>
              <p className="text-white/50">From audit to results — a clear, structured path with you at every step.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { n: '1', icon: '🔍', title: 'Audit', desc: 'Free AI analysis of your entire website — performance, SEO, security, and business health.', color: '#6366f1' },
                { n: '2', icon: '📊', title: 'Analysis', desc: 'AI generates a full report with scores, issues, and prioritized business impact.', color: '#8b5cf6' },
                { n: '3', icon: '📄', title: 'Proposal', desc: 'We prepare a branded PDF proposal with scope, timeline, and fixed investment.', color: '#a855f7' },
                { n: '4', icon: '⚙️', title: 'Development', desc: 'Expert engineers build your solution following agreed scope and daily updates.', color: '#ec4899' },
                { n: '5', icon: '🚀', title: 'Launch', desc: 'Full QA testing, staging review, then a smooth production launch with monitoring.', color: '#3b82f6' },
                { n: '6', icon: '📈', title: 'Growth', desc: 'Post-launch warranty, analytics tracking, and ongoing support to scale your business.', color: '#10b981' },
              ].map((step, i) => (
                <div key={i} className="group flex flex-col items-center text-center p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-3 border" style={{ color: step.color, borderColor: `${step.color}40`, background: `${step.color}15` }}>
                    {step.n}
                  </div>
                  <div className="text-2xl mb-2">{step.icon}</div>
                  <div className="text-sm font-semibold text-white mb-1">{step.title}</div>
                  <div className="text-[10px] text-white/30 leading-relaxed hidden md:block">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            9. TESTIMONIALS
        ═══════════════════════════════════════════════════════ */}
        <section id="testimonials" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-6">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-white/40 mb-12">Real results coming soon. We are currently onboarding our first clients.</p>

            <div className="relative max-w-2xl mx-auto">
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 p-12 flex flex-col items-center">
                <div className="text-5xl mb-4">⭐</div>
                <div className="text-xl font-semibold text-white mb-2">Testimonials Coming Soon</div>
                <p className="text-white/40 text-sm max-w-sm leading-relaxed">
                  We&apos;re working with our first clients right now. Real results and verified reviews will be published here as projects complete.
                </p>
                <div className="mt-6 flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <div className="mt-3 text-xs text-white/20">Be our first success story →</div>
                <Link href="/audit" className="mt-4 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  Start Your Free Audit
                </Link>
              </div>
            </div>

            {/* Case Studies CTA */}
            <div className="mt-10">
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                📁 View Case Studies (Coming Soon) →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            10. FAQ
        ═══════════════════════════════════════════════════════ */}
        <section id="faq" className="py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                FAQ
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked</h2>
              <p className="text-white/40">Everything you need to know before you start.</p>
            </div>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-white/2 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
                  >
                    <span className="text-sm font-medium text-white/90 pr-4">{faq.q}</span>
                    <span className={`text-white/30 transition-transform duration-300 shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-4 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            11. CONTACT / FOOTER CTA
        ═══════════════════════════════════════════════════════ */}
        <section id="contact" className="py-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            {/* CTA block */}
            <div className="relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-indigo-900/15 p-10 text-center overflow-hidden mb-14">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative">
                <h2 className="text-4xl font-bold text-white mb-3">Let&apos;s Build Your Growth Engine</h2>
                <p className="text-white/50 mb-8 text-lg">Start with a free audit. No commitment. No credit card. No spam.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/audit" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40">
                    🚀 Start Your Free Audit
                  </Link>
                  <Link href="/calculator" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all">
                    🧮 Try Calculator
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
              {[
                { icon: '📧', label: 'Email', value: 'yamplelabs@gmail.com', href: 'mailto:yamplelabs@gmail.com' },
                { icon: '📸', label: 'Instagram', value: '@yamplelabs', href: 'https://instagram.com/yamplelabs' },
                { icon: '💬', label: 'Support & Feedback', value: '@mannish_2323', href: 'https://instagram.com/mannish_2323' },
                { icon: '💻', label: 'GitHub', value: 'manish63018-sketch', href: 'https://github.com/manish63018-sketch' },
              ].map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-violet-500/15 transition-all text-center"
                >
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="text-xs text-white/30 mb-0.5">{c.label}</div>
                  <div className="text-xs text-white/60 group-hover:text-violet-300 transition-colors font-medium">{c.value}</div>
                </a>
              ))}
            </div>

            {/* Footer links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs text-white/25">
              <div>© 2025 Yample Labs. All rights reserved.</div>
              <div className="flex gap-4">
                <Link href="/sample-report" className="hover:text-white/50 transition-colors">Sample Report</Link>
                <Link href="/case-studies" className="hover:text-white/50 transition-colors">Case Studies</Link>
                <Link href="/admin" className="hover:text-white/50 transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Popups */}
      <AIAssistantBot idleSeconds={30} />
      {selectedService && (
        <ServiceDetailPopup service={selectedService} onClose={() => setSelectedService(null)} />
      )}

      <style jsx global>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(-4px); } 50% { transform: translateY(4px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3.5s ease-in-out infinite; }
      `}</style>
    </>
  )
}
