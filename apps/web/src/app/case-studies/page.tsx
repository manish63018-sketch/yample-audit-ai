'use client'

import Link from 'next/link'

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12 space-y-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border/60 pb-6">
        <div>
          <Link href="/" className="text-xs text-brand hover:underline">
            ← Back to Yample Labs
          </Link>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight mt-2">
            Client Case Studies
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Real performance transformations, Core Web Vitals acceleration, and growth stories.
          </p>
        </div>
      </div>

      {/* Honest Coming Soon Hero Card */}
      <div className="p-8 rounded-2xl border border-brand/30 bg-card/60 backdrop-blur-md text-center space-y-4 shadow-xl">
        <div className="inline-block px-3.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
          Transparency First
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Case Studies Coming Soon</h2>
        <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          We maintain strict engineering integrity at Yample Labs — we do not invent fake client testimonials or benchmark results. Real client case studies will be published here upon completion of current agency client projects.
        </p>
      </div>

      {/* Blueprint Architecture Showcase */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-text-primary">What Each Case Study Will Measure</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Before & After Telemetry', desc: 'Side-by-side Core Web Vitals, LCP load time, and WCAG AA accessibility metrics.' },
            { title: 'Client Goals & Challenges', desc: 'Exact business objectives, conversion friction points, and legacy technical debt.' },
            { title: 'Solution Delivered', desc: 'Engineering architecture, Next.js optimization, edge caching, and AI Assistant integration.' },
            { title: 'Measurable ROI', desc: 'Percentage conversion rate uplift, organic Google search traffic growth, and sales pipeline impact.' },
            { title: 'Technology Stack', desc: 'Detailed breakdown of Next.js, Supabase, Tailwind CSS, and AI models utilized.' },
            { title: 'Long-Term Support', desc: 'Continuous monitoring and automated regression auditing logs.' },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-border bg-card space-y-2">
              <h4 className="text-sm font-bold text-text-primary">{item.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-border/60 text-center">
        <Link
          href="/#pricing"
          className="px-6 py-3 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover inline-block transition-all shadow-md shadow-brand/20"
        >
          Become Our Next Case Study →
        </Link>
      </div>
    </div>
  )
}
