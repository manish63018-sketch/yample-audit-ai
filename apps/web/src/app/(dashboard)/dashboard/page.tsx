'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuoteItem {
  id: string
  quote_id: string
  business_name: string
  customer_country: string
  customer_currency: string
  budget_amount: number
  ai_estimated_cost_usd: number
  status: string
  created_at: string
  voice_original_text?: string
  voice_detected_language?: string
  voice_translated_text?: string
  required_features?: string[]
}

export default function DashboardOverviewPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loadingQuotes, setLoadingQuotes] = useState(true)

  useEffect(() => {
    fetch('/api/quotes?limit=5')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setQuotes(data.data)
      })
      .catch(() => {})
      .finally(() => setLoadingQuotes(false))
  }, [])

  const kpis = [
    { title: 'Total Audits Completed', value: '142', change: '+18%', isPositive: true, icon: '⚡' },
    { title: 'Average Health Score', value: '74 / 100', change: '+4.2 pts', isPositive: true, icon: '📊' },
    { title: 'Active CRM Leads', value: '38', change: '+12 new', isPositive: true, icon: '🎯' },
    { title: 'Pipeline Revenue Gain', value: '$184,500', change: '+24%', isPositive: true, icon: '💵' },
  ]

  const recentAudits = [
    { id: 'audit-1', url: 'https://example.com', score: 74, status: 'completed', date: '2 hours ago' },
    { id: 'audit-2', url: 'https://acmedental.com', score: 62, status: 'completed', date: '5 hours ago' },
    { id: 'audit-3', url: 'https://apexlegal.com', score: 88, status: 'completed', date: '1 day ago' },
    { id: 'audit-4', url: 'https://zenithshop.com', score: 54, status: 'completed', date: '2 days ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Agency Overview</h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time audit performance metrics, lead activity, international quotes, and agency pipeline velocity.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/quote"
            className="px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-xs font-semibold text-violet-300 hover:bg-violet-600/30 transition-all flex items-center gap-1.5"
          >
            <span>🎤</span>
            <span>New Custom Quote</span>
          </Link>
          <Link
            href="/audits"
            className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface/80 transition-all"
          >
            View All Audits
          </Link>
          <Link
            href="/leads"
            className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-all shadow-md shadow-brand/20"
          >
            Open CRM Board
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{kpi.icon}</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {kpi.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-text-primary tracking-tight">{kpi.value}</div>
              <div className="text-xs text-text-muted mt-1">{kpi.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quotes & Audio Requirements Section */}
      <div className="p-6 rounded-xl border border-violet-500/20 bg-gradient-to-b from-card to-surface space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="text-base font-bold text-text-primary">International Quotes & Voice Requirements</h2>
          </div>
          <Link href="/quote" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            + Create Quote →
          </Link>
        </div>

        {loadingQuotes ? (
          <div className="py-6 text-center text-xs text-text-muted">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <div className="text-xs text-text-muted">No custom quotes submitted yet.</div>
            <Link
              href="/quote"
              className="inline-block px-3 py-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium"
            >
              Submit First Project Requirement →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {quotes.map((q) => (
              <div key={q.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-violet-300">{q.quote_id}</span>
                    <span className="text-sm font-semibold text-text-primary">{q.business_name || 'Project'}</span>
                    {q.customer_country && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                        {q.customer_country}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                    {q.budget_amount && <span>Budget: {q.customer_currency || 'USD'} ${q.budget_amount}</span>}
                    {q.ai_estimated_cost_usd && <span>AI Est: ${q.ai_estimated_cost_usd}</span>}
                    {q.voice_original_text && (
                      <span className="text-violet-400 flex items-center gap-1">
                        🎙️ Voice Requirement ({q.voice_detected_language || 'Auto'})
                      </span>
                    )}
                  </div>
                  {q.voice_translated_text && (
                    <div className="text-xs text-text-muted italic bg-surface/50 p-2 rounded-lg mt-1 border border-border/40">
                      &quot;{q.voice_translated_text}&quot;
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 font-medium capitalize">
                    {q.status || 'submitted'}
                  </span>
                  <Link
                    href={`/checkout`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-hover transition-all"
                  >
                    Checkout →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Audits & CRM Pipeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Audits Table */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-base font-bold text-text-primary">Recent Website Audits</h2>
            <Link href="/audits" className="text-xs font-medium text-brand hover:underline">
              View Audit Center →
            </Link>
          </div>

          <div className="divide-y divide-border/40">
            {recentAudits.map((audit) => (
              <div key={audit.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-surface flex items-center justify-center font-bold text-xs text-brand border border-border/60">
                    {audit.score}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{audit.url}</div>
                    <div className="text-xs text-text-muted">{audit.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                    Completed
                  </span>
                  <Link
                    href={`/audits/${audit.id}?url=${encodeURIComponent(audit.url)}`}
                    className="text-xs text-brand hover:underline font-semibold"
                  >
                    Report →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM Pipeline Breakdown */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <h2 className="text-base font-bold text-text-primary border-b border-border/60 pb-3">
            CRM Pipeline Distribution
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">New Audited Leads</span>
              <span className="font-bold text-text-primary">12</span>
            </div>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[40%]" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Proposals Sent</span>
              <span className="font-bold text-text-primary">18</span>
            </div>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
              <div className="bg-brand h-full w-[65%]" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Deals Won</span>
              <span className="font-bold text-text-primary">8</span>
            </div>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%]" />
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Link
              href="/leads"
              className="w-full py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface/80 block text-center transition-all"
            >
              Manage CRM Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
