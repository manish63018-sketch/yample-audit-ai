import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Target, Shield, Globe, Rocket, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Yample Labs — The Team Behind AuditAI',
  description:
    'Learn about Yample Labs — a technology studio building AI-powered business growth tools. Meet the team behind AuditAI, our mission, and our commitment to client success.',
}

const VALUES = [
  {
    icon: Target,
    title: 'Results First',
    desc: 'Every audit, every line of code, every recommendation is centered on one goal: measurable business results for our clients.',
  },
  {
    icon: Shield,
    title: 'Radical Transparency',
    desc: 'No black-box pricing. No surprise fees. No vague timelines. What we quote is what you pay. What we promise is what we deliver.',
  },
  {
    icon: Globe,
    title: 'Global Reach, Personal Touch',
    desc: 'We serve clients across India, UAE, US, UK, and Australia — always with a dedicated point of contact, never a faceless support queue.',
  },
  {
    icon: Rocket,
    title: 'AI-Powered Speed',
    desc: "Our AI models don't just generate reports — they analyze, prioritize, and recommend. Faster insights mean faster action for your business.",
  },
]

export default function AboutPage() {
  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent('Hi Yample Labs! I would like to learn more about your services.')}`

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Nav */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">About Yample Labs</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Yample Labs Technology Studio
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            We Build Digital Systems That<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Actually Drive Growth</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Yample Labs is an Indian technology studio specializing in AI-powered website intelligence, high-performance web development, and custom business automation. We built AuditAI to democratize enterprise-grade website analysis for businesses of every size.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Audits Completed' },
            { value: '50+', label: 'Projects Delivered' },
            { value: '15+', label: 'Countries Served' },
            { value: '98%', label: 'Client Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
              <div className="text-3xl font-black text-violet-400 font-mono">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl font-black text-white">Built by Practitioners, for Business Owners</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Yample Labs was founded with a simple observation: most businesses know their website has problems — slow load times, poor SEO, outdated design — but they don't know where to start, who to trust, or what it will actually cost.
              </p>
              <p>
                We built AuditAI to solve all three problems in one place. Our AI doesn't just report what's wrong — it explains why it matters, calculates business impact, and generates a tailored improvement proposal with transparent, locked pricing.
              </p>
              <p>
                From a startup in Hyderabad to serving clients across 15+ countries, we've maintained one principle: <strong className="text-white">treat every client's project like our own business is on the line.</strong>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-violet-500/20 bg-violet-950/10 space-y-3">
              <div className="text-xs font-bold text-violet-300 uppercase tracking-wider">What We're Building</div>
              <ul className="space-y-2 text-sm text-slate-300">
                {[
                  'AI-powered website audits accessible to any business',
                  'Transparent, auto-generated quotations with no sales calls',
                  'Custom websites that load fast, rank high, convert more',
                  'AI support systems that work 24/7 for your customers',
                  'A complete platform connecting audit → quote → build → launch',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-violet-400 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Our Values</span>
            <h2 className="text-3xl font-black text-white">The Principles We Work By</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3 hover:border-violet-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Technology</span>
            <h2 className="text-2xl font-black text-white">Built with the Best Modern Stack</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'Vercel Edge', 'Razorpay', 'Tailwind CSS', 'Framer Motion', 'Google PageSpeed API', 'Resend', 'Lighthouse CI'].map((tech) => (
              <span key={tech} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card p-10 rounded-2xl border border-violet-500/20 bg-violet-950/10 text-center space-y-5">
          <h2 className="text-2xl font-black text-white">Ready to Work With Us?</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Start with a free AI audit of your website, or jump straight to telling us about your project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Free Website Audit
            </Link>
            <Link
              href="/requirements"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Start a Project
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
