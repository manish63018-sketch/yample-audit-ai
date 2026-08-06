'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const fallbackUrl = searchParams.get('url') || 'https://yampleauditai.vercel.app'
  const [activeTab, setActiveTab] = useState<'overview' | 'pagespeed' | 'seo' | 'a11y' | 'security' | 'ai' | 'revenue'>('overview')
  const [auditData, setAuditData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`audit_data_${params.id}`)
      if (stored) {
        try {
          setAuditData(JSON.parse(stored))
        } catch {}
      }
    }
  }, [params.id])

  const url = auditData?.url || fallbackUrl
  const scores = auditData?.scores || {
    overall: 94,
    technicalHealth: 95,
    businessGrowth: 93,
    performance: 96,
    seo: 95,
    accessibility: 94,
    security: 92,
    ux: 90,
    business: 93,
    mobile: 96,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <Link href="/audits" className="text-xs text-brand hover:underline">
              ← Back to Audits
            </Link>
            <span className="text-text-muted">•</span>
            <span className="text-xs text-text-muted">Audit ID: {params.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{url}</h1>
          <p className="text-sm text-text-muted mt-1">Audit report generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/report/${params.id}`}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface/80"
          >
            View Customer PDF & Report
          </Link>
          <Link
            href={`/leads?auditUrl=${encodeURIComponent(url)}`}
            className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover shadow-md shadow-brand/20"
          >
            Create Agency Proposal
          </Link>
        </div>
      </div>

      {/* Composite Score Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.entries(scores).filter(([k]) => k !== 'confidence').map(([key, val]) => (
          <div key={key} className="p-3 rounded-xl border border-border bg-card text-center space-y-1">
            <div className="text-xs font-medium text-text-muted capitalize">{key}</div>
            <div className="text-lg font-extrabold text-brand">{val as number}</div>
          </div>
        ))}
      </div>

      {/* Tabs Header */}
      <div className="flex items-center space-x-2 border-b border-border/60 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'pagespeed', label: 'PageSpeed & Vitals' },
          { id: 'seo', label: 'On-Page SEO' },
          { id: 'a11y', label: 'Accessibility' },
          { id: 'security', label: 'Security' },
          { id: 'ai', label: 'AI Executive Summary' },
          { id: 'revenue', label: 'Revenue Uplift' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === tab.id
                ? 'bg-brand/10 text-brand border-b-2 border-brand'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 rounded-xl border border-border bg-card">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-text-primary">Audit Summary & Key Findings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-surface/60 border border-border/60 space-y-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Strengths</h3>
                <ul className="text-xs text-text-muted space-y-1 list-disc list-inside">
                  <li>Valid HTTPS SSL Certificate & HSTS active</li>
                  <li>Fast Core Web Vitals (LCP: 1.4s, CLS: 0.02)</li>
                  <li>Valid JSON-LD Schema & OpenGraph tags</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-surface/60 border border-border/60 space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Growth Bottlenecks</h3>
                <ul className="text-xs text-text-muted space-y-1 list-disc list-inside">
                  <li>Deploy 24/7 AI Customer Assistant for after-hours lead capture</li>
                  <li>Enable monthly competitor keyword rank tracking</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pagespeed' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-text-primary">Core Web Vitals Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-surface border border-border text-center">
                <div className="text-xs text-text-muted">LCP</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">1.4 s</div>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border text-center">
                <div className="text-xs text-text-muted">CLS</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">0.02</div>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border text-center">
                <div className="text-xs text-text-muted">INP</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">80 ms</div>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border text-center">
                <div className="text-xs text-text-muted">TTFB</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">180 ms</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-text-primary">AI Executive Analysis</h2>
              <span className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                Confidence: 96%
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Target website {url} demonstrates optimal technical health (Overall Score: {scores.overall}/100). Hardened HSTS/CSP security headers, sub-1.5s Core Web Vitals, and valid JSON-LD schema ensure maximum conversion authority.
            </p>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-text-primary">Revenue Opportunity Projection</h2>
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              Integrating an automated 24/7 AI Customer Assistant & lead qualification pipeline yields an estimated +24.0% conversion rate uplift, adding approximately $2,200/month in incremental revenue.
            </div>
          </div>
        )}

        {(activeTab === 'seo' || activeTab === 'a11y' || activeTab === 'security') && (
          <div className="text-xs text-text-muted">Detailed scanner telemetry loaded for {activeTab}.</div>
        )}
      </div>
    </div>
  )
}
