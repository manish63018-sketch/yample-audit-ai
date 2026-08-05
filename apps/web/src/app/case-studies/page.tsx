import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real business results from Yample Labs — before & after, performance improvements, and client growth stories.',
}

const FUTURE_CATEGORIES = [
  { icon: '⚡', label: 'Performance Improvements' },
  { icon: '🔍', label: 'SEO Growth' },
  { icon: '📈', label: 'Conversion Rate Optimization' },
  { icon: '🤖', label: 'AI Automation Results' },
  { icon: '📱', label: 'Mobile App Launches' },
  { icon: '☁️', label: 'SaaS Deployments' },
]

const WHAT_YOULL_SEE = [
  { icon: '📸', title: 'Before & After', desc: 'Side-by-side screenshots of websites before and after our work — design, speed, and UX improvements.' },
  { icon: '📊', title: 'Performance Data', desc: 'Real Lighthouse scores, Core Web Vitals metrics, and PageSpeed improvements with numbers.' },
  { icon: '🎯', title: 'Client Goals', desc: 'What the client needed, their industry, target audience, and business objectives.' },
  { icon: '⚙️', title: 'Solution Delivered', desc: 'Exact services used, technology stack, development timeline, and team involved.' },
  { icon: '🚀', title: 'Results Achieved', desc: 'Measurable outcomes — traffic growth, conversion improvements, lead increase, revenue impact.' },
  { icon: '💬', title: 'Client Testimonial', desc: 'Direct quote from the client about their experience working with Yample Labs.' },
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <span className="font-semibold">🔍 AuditAI</span>
        </Link>
        <Link href="/audit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Free Audit →
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-6">
            📁 Case Studies
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Real Results.<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Coming Soon.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            We are currently completing our first client projects. Detailed case studies with before & after data, performance metrics, and client testimonials will be published here.
          </p>
        </div>

        {/* Coming Soon card */}
        <div className="relative rounded-3xl border border-dashed border-violet-500/20 bg-gradient-to-br from-violet-900/10 to-indigo-900/8 p-16 text-center mb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <div className="text-6xl mb-5">🏗️</div>
            <h2 className="text-3xl font-bold text-white mb-3">Case Studies Coming Soon</h2>
            <p className="text-white/40 max-w-lg mx-auto mb-8 leading-relaxed">
              We&apos;re currently delivering projects for our first clients. Once 5–10 projects are complete, this page will feature detailed case studies with real data, metrics, and client quotes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/audit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20">
                🚀 Become Our First Case Study
              </Link>
              <Link href="/#contact" className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all">
                📧 Get Notified When Published
              </Link>
            </div>
          </div>
        </div>

        {/* Future categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">What You&apos;ll Find in Our Case Studies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FUTURE_CATEGORIES.map(cat => (
              <div key={cat.label} className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/2 text-sm text-white/50">
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What you'll see section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Each Case Study Will Include</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WHAT_YOULL_SEE.map(item => (
              <div key={item.title} className="p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="font-semibold text-white mb-1 text-sm">{item.title}</div>
                <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center p-8 rounded-2xl border border-white/5 bg-white/2">
          <h3 className="text-xl font-bold text-white mb-2">Want to be featured?</h3>
          <p className="text-white/40 text-sm mb-5">Start a project with us and get a full case study published on this page — free marketing for your business.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:yamplelabs@gmail.com" className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all">
              📧 yamplelabs@gmail.com
            </a>
            <a href="https://instagram.com/yamplelabs" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl border border-pink-500/20 bg-pink-500/8 text-pink-300 text-sm font-medium hover:bg-pink-500/15 transition-all">
              📸 @yamplelabs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
