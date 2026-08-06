'use client'

import { useState } from 'react'
import { Check, ChevronDown, Shield, Zap, Globe, Cpu, Search, Mail, BarChart3, Rocket, HeadphonesIcon, Layout, Smartphone, Bot, Lock, Eye } from 'lucide-react'

/* ─── Section Data ─────────────────────────────────────────────── */

const DETAIL_SECTIONS = [
  {
    id: 'website',
    icon: <Globe className="w-5 h-5" />,
    emoji: '🌐',
    title: 'Professional Website',
    tagline: 'A premium website designed specifically for your business.',
    includes: [
      'Custom Design',
      'Responsive on Mobile, Tablet & Desktop',
      'Modern UI & UX',
      'Fast Loading (90+ Score)',
      'Business Pages (Home, About, Services, Contact, etc.)',
      'Contact Forms with Validation',
      'Image Gallery',
      'Google Maps Integration',
      'Social Media Integration',
      'Professional Layout & Typography',
    ],
    benefits: [
      { label: 'More Trust', desc: 'Professional design builds instant credibility' },
      { label: 'Better Brand Image', desc: 'Stand out from competitors' },
      { label: 'More Enquiries', desc: 'Optimized forms capture leads' },
      { label: 'Higher Conversion', desc: 'Design that turns visitors into customers' },
    ],
    color: '#4F8CFF',
  },
  {
    id: 'admin',
    icon: <Layout className="w-5 h-5" />,
    emoji: '⚙️',
    title: 'Admin Dashboard',
    tagline: 'Manage your website without technical knowledge.',
    includes: [
      'Manage Content & Pages',
      'Update Images & Media',
      'Manage Services & Products',
      'Customer Enquiries Inbox',
      'Orders & Bookings',
      'Analytics & Insights',
      'Role & User Management',
    ],
    benefits: [
      { label: 'Save Time', desc: 'Update anything in minutes, not hours' },
      { label: 'Easy Management', desc: 'No coding knowledge required' },
      { label: 'No Developer Required', desc: 'Make changes yourself, anytime' },
    ],
    color: '#8B5CF6',
  },
  {
    id: 'ai',
    icon: <Bot className="w-5 h-5" />,
    emoji: '🤖',
    title: 'AI Customer Assistant',
    tagline: 'A smart AI assistant that works 24/7 for your business.',
    includes: [
      'Instant Customer Support',
      'Automatic Lead Collection',
      'Smart FAQ Answers',
      'Appointment Booking',
      'Order Status Information',
      'Customer Feedback Collection',
      'Voice Message Support',
      'Voice-to-Text Transcription',
      'Automatic Translation',
      'Multi-Language Support',
      'Human Handover When Needed',
    ],
    benefits: [
      { label: 'Never Miss A Customer', desc: 'Respond instantly, even at midnight' },
      { label: '24/7 Support', desc: 'Always available, no staff needed' },
      { label: 'Increase Leads', desc: 'Capture every interested visitor' },
      { label: 'Better Experience', desc: 'Customers get answers in seconds' },
    ],
    color: '#22C55E',
  },
  {
    id: 'performance',
    icon: <Zap className="w-5 h-5" />,
    emoji: '⚡',
    title: 'Website Performance',
    tagline: 'Fast websites create better customer experiences.',
    includes: [
      'Speed Optimization (90+ Score)',
      'Image Compression & Lazy Loading',
      'Core Web Vitals Improvements',
      'Mobile Performance Tuning',
    ],
    benefits: [
      { label: 'Lower Bounce Rate', desc: 'Visitors stay longer on fast sites' },
      { label: 'Higher Conversion', desc: 'Speed directly increases sales' },
      { label: 'Better UX', desc: 'Smooth, instant page loads' },
    ],
    color: '#F59E0B',
  },
  {
    id: 'seo',
    icon: <Search className="w-5 h-5" />,
    emoji: '🔍',
    title: 'SEO Ready',
    tagline: 'Your website is built with search engines in mind.',
    includes: [
      'SEO-Optimized Structure',
      'Meta Titles & Descriptions',
      'Google-Ready Markup',
      'Automatic Sitemap Generation',
      'Search Console Ready',
    ],
    benefits: [
      { label: 'Higher Visibility', desc: 'Appear in Google search results' },
      { label: 'More Organic Visitors', desc: 'Free traffic from search engines' },
      { label: 'Long-Term Growth', desc: 'SEO compounds over time' },
    ],
    color: '#4F8CFF',
  },
  {
    id: 'identity',
    icon: <Mail className="w-5 h-5" />,
    emoji: '✉️',
    title: 'Business Identity',
    tagline: 'Build a professional online identity from day one.',
    includes: [
      'Custom Domain Connection',
      'Professional Business Email Setup',
      'Business Email Configuration',
      'SSL Security Certificate',
    ],
    examples: [
      'hello@yourbusiness.com',
      'support@yourbusiness.com',
      'sales@yourbusiness.com',
    ],
    benefits: [
      { label: 'Professional Brand', desc: 'No more @gmail.com emails' },
      { label: 'Customer Trust', desc: 'Branded email builds credibility' },
      { label: 'Business Credibility', desc: 'Look established from day one' },
    ],
    color: '#EC4899',
  },
  {
    id: 'security',
    icon: <Shield className="w-5 h-5" />,
    emoji: '🛡️',
    title: 'Security',
    tagline: 'Security is included from day one. Not an afterthought.',
    includes: [
      'SSL Certificate (HTTPS)',
      'Secure Contact Forms',
      'Authentication & Login Protection',
      'Spam & Bot Protection',
      'Data Protection Best Practices',
    ],
    benefits: [
      { label: 'Reliable', desc: 'Your website is always safe' },
      { label: 'Safe', desc: 'Customer data stays protected' },
      { label: 'Trusted', desc: 'Security badges build confidence' },
    ],
    color: '#22C55E',
  },
  {
    id: 'analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    emoji: '📊',
    title: 'Analytics',
    tagline: 'Understand how your business is growing online.',
    includes: [
      'Visitor Tracking',
      'Traffic Sources & Channels',
      'Business Performance Reports',
      'Lead Tracking & Attribution',
      'Conversion Tracking',
    ],
    benefits: [
      { label: 'Data-Driven Decisions', desc: 'Know what works and what doesn\'t' },
      { label: 'Growth Visibility', desc: 'Track progress over time' },
    ],
    color: '#8B5CF6',
  },
  {
    id: 'launch',
    icon: <Rocket className="w-5 h-5" />,
    emoji: '🚀',
    title: 'Launch',
    tagline: 'We prepare everything before your website goes live.',
    includes: [
      'Cross-Browser Testing',
      'Production Deployment',
      'Performance & Speed Check',
      'Final Design Review',
      'Go-Live Assistance',
    ],
    benefits: [
      { label: 'Zero Stress', desc: 'We handle the entire launch process' },
      { label: 'Quality Assured', desc: 'Everything tested before going live' },
    ],
    color: '#F59E0B',
  },
  {
    id: 'support',
    icon: <HeadphonesIcon className="w-5 h-5" />,
    emoji: '🎧',
    title: 'Post-Launch Support',
    tagline: 'We\'re here after your website is launched.',
    includes: [
      'Technical Support',
      'Bug Fix Guidance',
      'Upgrade Consultation',
      'Business Growth Advice',
    ],
    benefits: [
      { label: 'Peace of Mind', desc: 'Help when you need it' },
      { label: 'Future Ready', desc: 'Guidance on scaling your platform' },
    ],
    color: '#38BDF8',
  },
]

const INCLUDED_CARDS = [
  { icon: '🌐', label: 'Website Design' },
  { icon: '⚙️', label: 'Admin Dashboard' },
  { icon: '🤖', label: 'AI Ready' },
  { icon: '🔍', label: 'SEO Ready' },
  { icon: '🛡️', label: 'Security' },
  { icon: '✉️', label: 'Business Email Setup' },
  { icon: '🔗', label: 'Domain Connection' },
  { icon: '🚀', label: 'Launch Support' },
  { icon: '📱', label: 'Mobile Responsive' },
  { icon: '📊', label: 'Analytics' },
  { icon: '📄', label: 'Documentation' },
  { icon: '🔮', label: 'Future Upgrade Ready' },
]

const ADDITIONAL_SERVICES = [
  { service: 'Domain Registration & Yearly Renewal', note: 'Varies by provider' },
  { service: 'Hosting Plan', note: 'Based on traffic & storage' },
  { service: 'Business Email Subscription (Premium)', note: 'e.g. Google Workspace' },
  { service: 'Database Usage', note: 'Based on application size' },
  { service: 'Third-Party API Charges', note: 'Maps, SMS, payments, etc.' },
  { service: 'AI Usage Beyond Included Limits', note: 'Pay-as-you-grow' },
  { service: 'Payment Gateway Processing Fees', note: 'Stripe / Razorpay rates' },
]

const WHY_BADGES = [
  { icon: '🛠️', label: 'Custom Built' },
  { icon: '📱', label: 'Mobile First' },
  { icon: '🎨', label: 'Modern UI/UX' },
  { icon: '🤖', label: 'AI Ready' },
  { icon: '🔍', label: 'SEO Ready' },
  { icon: '🛡️', label: 'Secure' },
  { icon: '⚡', label: 'Fast' },
  { icon: '📈', label: 'Scalable' },
  { icon: '⚙️', label: 'Admin Dashboard Included' },
  { icon: '🔮', label: 'Future Upgrade Ready' },
  { icon: '💎', label: 'Transparent Pricing' },
  { icon: '🤝', label: 'Long-Term Support' },
]

/* ─── Accordion Item ────────────────────────────────────────────── */
function DetailAccordion({ section, isOpen, onToggle }: {
  section: typeof DETAIL_SECTIONS[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-white/15 bg-white/[0.03] shadow-lg'
          : 'border-white/5 bg-white/[0.01] hover:border-white/10'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-6 text-left group"
        aria-expanded={isOpen}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: isOpen ? `${section.color}20` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isOpen ? `${section.color}40` : 'rgba(255,255,255,0.05)'}`,
            color: isOpen ? section.color : 'rgba(255,255,255,0.4)',
          }}
        >
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white tracking-tight">{section.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{section.tagline}</p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-0 animate-in" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            {/* Left: What's Included */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">
                What's Included
              </div>
              <div className="space-y-2">
                {section.includes.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: section.color }} />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              {/* Email examples */}
              {'examples' in section && section.examples && (
                <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">
                    Examples
                  </div>
                  {(section as { examples: string[] }).examples.map((ex: string) => (
                    <div key={ex} className="text-xs text-violet-300 font-mono py-0.5">{ex}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Business Benefits */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">
                Business Benefits
              </div>
              <div className="space-y-3">
                {section.benefits.map((b) => (
                  <div key={b.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-sm font-semibold text-white">{b.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Export ────────────────────────────────────────────────── */
export function WhatsIncludedSection() {
  const [openId, setOpenId] = useState<string | null>('website')

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: Everything Your Business Needs — Hero Intro
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs font-semibold mb-6">
            Complete Business Solution
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
            Everything You Need To Build, Launch
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}& Grow Your Business Online.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We create professional digital experiences that help businesses build trust, attract customers, manage operations and grow online.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTIONS 2–11: Detailed Accordion Breakdowns
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs font-semibold">
              Detailed Breakdown
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What You Get — In Detail
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Every feature, every benefit, explained in simple language. Click any section to expand.
            </p>
          </div>

          <div className="space-y-3">
            {DETAIL_SECTIONS.map((section) => (
              <DetailAccordion
                key={section.id}
                section={section}
                isOpen={openId === section.id}
                onToggle={() => setOpenId(openId === section.id ? null : section.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 12: What's Included — Premium Cards Grid
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5 bg-[#0B1120]/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs font-semibold">
              ✓ All Included
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What's Included With Every Project
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              No hidden costs, no surprise add-ons. These are included from day one.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {INCLUDED_CARDS.map((card) => (
              <div
                key={card.label}
                className="group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300 text-center"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <div className="text-sm font-semibold text-white">{card.label}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <Check className="w-3 h-3" /> Included
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 13: Additional Services — Billed Separately
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-semibold">
              Optional Add-Ons
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Additional Services
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              These services are <span className="text-white font-medium">optional</span> and <span className="text-white font-medium">billed separately</span> only if your project requires them.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden divide-y divide-white/5">
            {ADDITIONAL_SERVICES.map((item) => (
              <div key={item.service} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400/60 shrink-0" />
                  <span className="text-sm text-slate-200 font-medium">{item.service}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0 ml-4">{item.note}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-xs text-slate-400">
              💡 <span className="text-slate-300 font-medium">Full transparency.</span> We will always discuss these costs with you before they apply. No surprises, no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 14: Why Yample Labs — Premium Badges
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-[#0B1120]/40 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #4F8CFF, transparent 70%)' }}
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs font-semibold">
              Why Choose Us
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Businesses Choose Yample Labs
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              One team. One platform. Everything your business needs to succeed online.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {WHY_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="group flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 hover:bg-violet-500/[0.03] transition-all duration-300"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                  {badge.icon}
                </span>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl border border-violet-500/10 bg-gradient-to-b from-violet-900/10 to-transparent">
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed italic">
                "I don't need multiple companies.
                <br />
                <span className="text-white font-semibold not-italic">
                  Yample Labs can build, launch, support and grow my business from one place.
                </span>"
              </p>
              <div className="mt-4 text-xs text-slate-500 font-medium">
                — The experience we design for every client
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
