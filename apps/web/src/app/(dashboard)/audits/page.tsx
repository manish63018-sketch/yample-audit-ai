'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QuickAuditModal } from '@/components/dashboard/QuickAuditModal'

export default function AuditCenterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const mockAudits = [
    { id: 'audit-101', url: 'https://example.com', overall: 74, perf: 74, seo: 75, a11y: 72, date: '2026-08-05' },
    { id: 'audit-102', url: 'https://acmedental.com', overall: 62, perf: 58, seo: 70, a11y: 65, date: '2026-08-04' },
    { id: 'audit-103', url: 'https://apexlegal.com', overall: 88, perf: 85, seo: 92, a11y: 88, date: '2026-08-03' },
    { id: 'audit-104', url: 'https://zenithshop.com', overall: 54, perf: 48, seo: 60, a11y: 55, date: '2026-08-02' },
  ]

  const filteredAudits = mockAudits.filter((a) => a.url.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Audit Center</h1>
          <p className="text-sm text-text-muted mt-1">
            Run, manage, and analyze technical website audits across performance, SEO, accessibility, and security.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-all shadow-md shadow-brand/20 flex items-center space-x-2 self-start sm:self-auto"
        >
          <span>⚡</span>
          <span>Run New Audit</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
        <input
          type="text"
          placeholder="Filter audits by URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2 text-xs text-text-primary placeholder:text-text-muted/60 focus:border-brand focus:outline-none"
        />
        <div className="text-xs text-text-muted">
          Showing <span className="font-semibold text-text-primary">{filteredAudits.length}</span> audits
        </div>
      </div>

      {/* Audits Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-surface/40 text-xs font-semibold text-text-muted">
              <th className="p-4">Target Website</th>
              <th className="p-4">Overall Score</th>
              <th className="p-4">Performance</th>
              <th className="p-4">SEO</th>
              <th className="p-4">Accessibility</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs">
            {filteredAudits.map((audit) => (
              <tr key={audit.id} className="hover:bg-surface/30 transition-colors">
                <td className="p-4 font-semibold text-text-primary">{audit.url}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-brand/10 text-brand font-bold">
                    {audit.overall} / 100
                  </span>
                </td>
                <td className="p-4 text-text-muted">{audit.perf}</td>
                <td className="p-4 text-text-muted">{audit.seo}</td>
                <td className="p-4 text-text-muted">{audit.a11y}</td>
                <td className="p-4 text-text-muted">{audit.date}</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/audits/${audit.id}?url=${encodeURIComponent(audit.url)}`}
                    className="px-3 py-1.5 rounded-md bg-brand text-white font-semibold hover:bg-brand-hover inline-block"
                  >
                    View Report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QuickAuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
