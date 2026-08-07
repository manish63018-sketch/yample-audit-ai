'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AuditDetailContent({ auditId }: { auditId: string }) {
  const searchParams = useSearchParams()
  const fallbackUrl = searchParams ? searchParams.get('url') || 'https://yampleauditai.vercel.app' : 'https://yampleauditai.vercel.app'
  const [activeTab, setActiveTab] = useState<'overview' | 'pagespeed' | 'seo' | 'a11y' | 'security' | 'ai' | 'revenue'>('overview')
  const [auditData, setAuditData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`audit_data_${auditId}`)
      if (stored) {
        try {
          setAuditData(JSON.parse(stored))
        } catch {}
      }
    }
  }, [auditId])

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
            <span className="text-xs text-text-muted">Audit ID: {auditId}</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{url}</h1>
          <p className="text-sm text-text-muted mt-1">Audit report generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/report/${auditId}`}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface/80"
          >
            View Customer PDF &amp; Report
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-border overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'pagespeed', label: 'Performance' },
          { id: 'seo', label: 'SEO' },
          { id: 'a11y', label: 'Accessibility' },
          { id: 'security', label: 'Security' },
          { id: 'ai', label: 'AI Recommendations' },
          { id: 'revenue', label: 'Revenue Forecast' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-brand text-brand font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border bg-surface text-center">
          <div className="text-xs text-text-muted uppercase font-semibold mb-1">Overall Score</div>
          <div className="text-3xl font-black text-emerald-400">{scores.overall}/100</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-surface text-center">
          <div className="text-xs text-text-muted uppercase font-semibold mb-1">Performance</div>
          <div className="text-3xl font-black text-brand">{scores.performance}/100</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-surface text-center">
          <div className="text-xs text-text-muted uppercase font-semibold mb-1">SEO</div>
          <div className="text-3xl font-black text-emerald-400">{scores.seo}/100</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-surface text-center">
          <div className="text-xs text-text-muted uppercase font-semibold mb-1">Security</div>
          <div className="text-3xl font-black text-amber-400">{scores.security}/100</div>
        </div>
      </div>
    </div>
  )
}

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const auditId = params?.id || ''

  return (
    <Suspense fallback={<div className="p-8 text-white/50 text-sm">Loading audit details...</div>}>
      <AuditDetailContent auditId={auditId} />
    </Suspense>
  )
}
