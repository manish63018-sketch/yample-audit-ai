'use client'

import { useState } from 'react'

interface Lead {
  id: string
  businessName: string
  website: string
  status: 'new' | 'qualified' | 'audit_generated' | 'contacted' | 'proposal_sent' | 'won' | 'lost'
  priority: 'high' | 'medium' | 'low'
  email?: string
}

export default function LeadsPage() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [csvContent, setCsvContent] = useState('')
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const initialLeads: Lead[] = [
    { id: 'lead-1', businessName: 'Acme Dental', website: 'acmedental.com', status: 'new', priority: 'high', email: 'info@acmedental.com' },
    { id: 'lead-2', businessName: 'Apex Legal', website: 'apexlegal.com', status: 'qualified', priority: 'medium', email: 'contact@apexlegal.com' },
    { id: 'lead-3', businessName: 'Zenith E-Commerce', website: 'zenithshop.com', status: 'proposal_sent', priority: 'high', email: 'hello@zenithshop.com' },
    { id: 'lead-4', businessName: 'Starlight Spa', website: 'starlightspa.com', status: 'won', priority: 'medium', email: 'book@starlightspa.com' },
  ]

  const [leads, setLeads] = useState<Lead[]>(initialLeads)

  const columns: { id: Lead['status']; title: string }[] = [
    { id: 'new', title: 'New Ingested' },
    { id: 'qualified', title: 'Qualified' },
    { id: 'proposal_sent', title: 'Proposal Sent' },
    { id: 'won', title: 'Deals Won' },
  ]

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvContent) return

    setImportStatus('Processing CSV import...')

    try {
      const res = await fetch('/api/leads/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: 'org-1', csvText: csvContent }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setImportStatus(`Successfully imported ${data.data.importedCount} leads!`)
        setTimeout(() => {
          setIsImportModalOpen(false)
          setImportStatus(null)
          setCsvContent('')
        }, 1200)
      } else {
        setImportStatus(data.error?.message || 'Import failed.')
      }
    } catch {
      setImportStatus('Import failed.')
    }
  }

  const moveStatus = (id: string, newStatus: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Agency Lead CRM</h1>
          <p className="text-sm text-text-muted mt-1">
            Convert website audits into high-value clients across the sales pipeline.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface/80 transition-all flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Import Leads (CSV)</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          return (
            <div key={col.id} className="p-4 rounded-xl border border-border bg-card/60 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-2">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">{col.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-text-muted font-mono font-bold">
                  {colLeads.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colLeads.map((lead) => (
                  <div key={lead.id} className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-2 hover:border-brand/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">{lead.businessName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          lead.priority === 'high'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </div>

                    <div className="text-xs text-text-muted font-mono">{lead.website}</div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                      <span className="text-text-muted">{lead.email}</span>
                      <select
                        value={lead.status}
                        onChange={(e) => moveStatus(lead.id, e.target.value as Lead['status'])}
                        className="bg-surface border border-border rounded px-1.5 py-0.5 text-[10px] text-text-primary focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="won">Won</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-base font-bold text-text-primary">Import Leads via CSV</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-text-muted hover:text-text-primary">
                ✕
              </button>
            </div>

            {importStatus && (
              <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-brand text-xs">
                {importStatus}
              </div>
            )}

            <form onSubmit={handleImportCSV} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Paste CSV Raw Text</label>
                <textarea
                  rows={6}
                  required
                  placeholder={`Business Name,Website,Email,Phone,Industry,City\nAcme Dental,https://acmedental.com,info@acmedental.com,555-0192,Dental,Austin`}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface p-3 text-xs font-mono text-text-primary placeholder:text-text-muted/60 focus:border-brand focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover"
                >
                  Import Leads
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
