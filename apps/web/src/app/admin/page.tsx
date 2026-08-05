'use client'

import { useState } from 'react'
import Link from 'next/link'

type Status = 'new' | 'contacted' | 'proposal_sent' | 'converted' | 'lost'

interface Lead {
  id: string
  name: string
  business: string
  email: string
  phone: string
  instagram: string
  website: string
  services: string
  total: number
  discount: number
  auditScore: number
  status: Status
  proposalUrl: string
  createdAt: string
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Alex Vance',
    business: 'TechMart Solutions',
    email: 'alex@techmart.com',
    phone: '+1 555 234 5678',
    instagram: '@alexvance',
    website: 'techmart.com',
    services: 'Website Upgrade, AI Customer Assistant',
    total: 1099,
    discount: 110,
    auditScore: 54,
    status: 'new',
    proposalUrl: '/api/reports/download',
    createdAt: '2025-08-05',
  },
  {
    id: '2',
    name: 'Priya Mehta',
    business: 'Bloom Bakery',
    email: 'priya@bloombakery.com',
    phone: '+1 555 012 3456',
    instagram: '@bloombakery',
    website: 'bloombakery.com',
    services: 'Business Website, CRM System, Booking System',
    total: 1649,
    discount: 0,
    auditScore: 41,
    status: 'contacted',
    proposalUrl: '/api/reports/download',
    createdAt: '2025-08-04',
  },
  {
    id: '3',
    name: 'Ahmed Al-Rashid',
    business: 'Gulf Logistics',
    email: 'ahmed@gulflogistics.ae',
    phone: '+971 50 123 4567',
    instagram: '@gulflogistics',
    website: 'gulflogistics.ae',
    services: 'Website Upgrade, Monthly SEO',
    total: 799,
    discount: 80,
    auditScore: 67,
    status: 'proposal_sent',
    proposalUrl: '/api/reports/download',
    createdAt: '2025-08-03',
  },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#6366f1', bg: '#6366f115' },
  contacted: { label: 'Contacted', color: '#f59e0b', bg: '#f59e0b15' },
  proposal_sent: { label: 'Proposal Sent', color: '#3b82f6', bg: '#3b82f615' },
  converted: { label: '✅ Converted', color: '#10b981', bg: '#10b98115' },
  lost: { label: 'Lost', color: '#ef4444', bg: '#ef444415' },
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [selected, setSelected] = useState<Lead | null>(null)

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  const updateStatus = (id: string, status: Status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const totalRevenue = leads.filter(l => l.status === 'converted').reduce((s, l) => s + l.total, 0)
  const pipeline = leads.filter(l => ['new', 'contacted', 'proposal_sent'].includes(l.status)).reduce((s, l) => s + l.total, 0)

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">← Home</Link>
          <div className="w-px h-4 bg-white/10" />
          <h1 className="text-lg font-bold text-white">🏢 Admin Panel</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">Private</span>
        </div>
        <div className="text-xs text-white/30">{leads.length} total leads</div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: leads.length, color: '#6366f1' },
            { label: 'Pipeline Value', value: `$${pipeline.toLocaleString()}`, color: '#f59e0b' },
            { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: '#10b981' },
            { label: 'Revenue Won', value: `$${totalRevenue.toLocaleString()}`, color: '#ec4899' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl border border-white/5 bg-white/2">
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'new', 'contacted', 'proposal_sent', 'converted', 'lost'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filter === s ? 'bg-violet-600 text-white border-violet-500' : 'bg-white/3 text-white/40 border-white/5 hover:bg-white/5 hover:text-white/60'}`}
            >
              {s === 'all' ? 'All Leads' : STATUS_CONFIG[s as Status].label}
              {' '}({s === 'all' ? leads.length : leads.filter(l => l.status === s).length})
            </button>
          ))}
        </div>

        {/* Leads table */}
        <div className="rounded-2xl border border-white/5 bg-white/2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/3">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Lead</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Website</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider hidden lg:table-cell">Services</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider hidden sm:table-cell">Score</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const sc = STATUS_CONFIG[lead.status]
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-white/3 hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-xs text-white/40">{lead.business} · {lead.email}</div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="text-xs text-white/50 font-mono">{lead.website}</div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="text-xs text-white/40 max-w-[180px] truncate">{lead.services}</div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="font-semibold text-violet-300">${lead.total.toLocaleString()}</div>
                        {lead.discount > 0 && <div className="text-[10px] text-green-400">-${lead.discount} disc.</div>}
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        <div className={`text-sm font-bold ${lead.auditScore < 60 ? 'text-red-400' : lead.auditScore < 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {lead.auditScore}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <select
                          value={lead.status}
                          onChange={e => { e.stopPropagation(); updateStatus(lead.id, e.target.value as Status) }}
                          onClick={e => e.stopPropagation()}
                          className="text-xs px-2 py-1 rounded-lg border focus:outline-none cursor-pointer bg-transparent"
                          style={{ color: sc.color, borderColor: `${sc.color}33`, background: sc.bg }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k} style={{ background: '#0d0d14', color: '#fff' }}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} title="Call" className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs hover:bg-green-500/20 transition-all">📞</a>
                          <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} title="Email" className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs hover:bg-blue-500/20 transition-all">📧</a>
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} title="WhatsApp" className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs hover:bg-green-500/20 transition-all">💬</a>
                          <button onClick={e => { e.stopPropagation(); updateStatus(lead.id, 'converted') }} title="Convert" className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs hover:bg-violet-500/20 transition-all">✅</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/30">
                <div className="text-3xl mb-2">📭</div>
                <div className="text-sm">No leads in this category</div>
              </div>
            )}
          </div>
        </div>

        {/* Lead detail expandable */}
        {selected && (
          <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{selected.name} — Full Details</h3>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors">✕</button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {[
                ['Phone', selected.phone],
                ['Email', selected.email],
                ['Instagram', selected.instagram],
                ['Business', selected.business],
                ['Website', selected.website],
                ['Date', selected.createdAt],
                ['Services', selected.services],
                ['Investment', `$${selected.total} (disc: $${selected.discount})`],
                ['Audit Score', String(selected.auditScore)],
              ].map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl border border-white/5 bg-white/3">
                  <div className="text-xs text-white/30 mb-0.5">{k}</div>
                  <div className="text-white/80 text-xs font-medium truncate">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
