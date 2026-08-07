'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  Search,
  FileText,
  ShoppingBag,
  Rocket,
  Users,
  Receipt,
  Ticket,
  Mail,
  ShieldCheck,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  UserCheck,
  Send,
  Trash2,
} from 'lucide-react'

type AdminTab =
  | 'overview'
  | 'audits'
  | 'quotes'
  | 'orders'
  | 'projects'
  | 'crm'
  | 'invoices'
  | 'coupons'
  | 'tickets'
  | 'email_logs'

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Coupon state
  const [coupons, setCoupons] = useState([
    { code: 'YAMPLE10', discount: '10%', type: 'percentage', uses: 42, maxUses: 100, active: true },
    { code: 'LAUNCH50', discount: '$50 OFF', type: 'fixed', uses: 18, maxUses: 50, active: true },
  ])
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponDiscount, setNewCouponDiscount] = useState('')

  // CRM client notes state
  const [clientNotes, setClientNotes] = useState<Record<string, string>>({
    'c1': 'Requested rush delivery for upcoming launch on Aug 20. Interested in SEO retainer.',
  })

  // Export CSV handler
  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(','))
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCouponCode || !newCouponDiscount) return
    setCoupons((prev) => [
      ...prev,
      {
        code: newCouponCode.toUpperCase(),
        discount: newCouponDiscount,
        type: newCouponDiscount.includes('%') ? 'percentage' : 'fixed',
        uses: 0,
        maxUses: 100,
        active: true,
      },
    ])
    setNewCouponCode('')
    setNewCouponDiscount('')
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Top Header Bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-black text-lg text-white">
            Audit<span className="text-violet-400">AI</span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-wider">
            Admin Command Center
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Operator: <strong className="text-emerald-400 font-bold">Yample Labs Team</strong>
          </span>
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px]">
            v2.4 Production
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">

        {/* Global Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'Platform Analytics', icon: TrendingUp },
            { id: 'orders', label: 'Client Orders', icon: ShoppingBag, count: 12 },
            { id: 'projects', label: 'Active Projects', icon: Rocket, count: 5 },
            { id: 'crm', label: 'Lead & Client CRM', icon: Users, count: 64 },
            { id: 'audits', label: 'Scans & Audits', icon: Search, count: 142 },
            { id: 'quotes', label: 'Generated Quotes', icon: FileText, count: 18 },
            { id: 'invoices', label: 'Invoices & Tax', icon: Receipt, count: 12 },
            { id: 'coupons', label: 'Promo Coupons', icon: Ticket, count: coupons.length },
            { id: 'tickets', label: 'Support Queue', icon: UserCheck, count: 2 },
            { id: 'email_logs', label: 'Email Logs', icon: Mail, count: 25 },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">{tab.count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Monthly Recurring Revenue</div>
                <div className="text-3xl font-black text-emerald-400 font-mono">$18,450</div>
                <div className="text-[11px] text-emerald-300 mt-1">↑ +28% vs last month</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Active Client Projects</div>
                <div className="text-3xl font-black text-violet-400 font-mono">5</div>
                <div className="text-[11px] text-violet-300 mt-1">Avg delivery: 7.4 days</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Audits Run This Month</div>
                <div className="text-3xl font-black text-indigo-400 font-mono">142</div>
                <div className="text-[11px] text-indigo-300 mt-1">100% Real scans executed</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Quote Conversion Rate</div>
                <div className="text-3xl font-black text-amber-400 font-mono">36.8%</div>
                <div className="text-[11px] text-amber-300 mt-1">WhatsApp &amp; Online checkout</div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Orders & Milestones</h3>
                  <button
                    onClick={() =>
                      exportCSV(
                        [
                          { OrderID: 'ORD-2026-9401', Client: 'Acme Corp', Amount: '$837', Stage: 'UI Design' },
                          { OrderID: 'ORD-2026-9388', Client: 'Apex Healthcare', Amount: '$748', Stage: 'Testing' },
                        ],
                        'orders_export'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-bold uppercase">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-3 px-3 font-mono font-bold text-violet-400">ORD-2026-9401</td>
                        <td className="py-3 px-3 text-white font-semibold">Acme Corp (John)</td>
                        <td className="py-3 px-3 text-slate-300">Custom Redesign + AI Bot</td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-bold">$837</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold">
                            UI Design Phase
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-mono font-bold text-violet-400">ORD-2026-9388</td>
                        <td className="py-3 px-3 text-white font-semibold">Apex Healthcare</td>
                        <td className="py-3 px-3 text-slate-300">Core Web Vitals + SEO</td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-bold">$748</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                            Testing &amp; QA
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security & System Status */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Platform Security Status
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">Supabase RLS Status</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">Resend.com Email Delivery</span>
                    <span className="text-emerald-400 font-bold">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">Razorpay Payment Gateway</span>
                    <span className="text-emerald-400 font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">CSRF &amp; Rate Limiter</span>
                    <span className="text-emerald-400 font-bold">ENABLED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LEAD & CLIENT CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Lead &amp; Client CRM</h2>
                <p className="text-xs text-slate-400">Manage client profiles, add internal notes, and track sales pipeline.</p>
              </div>
              <button
                onClick={() =>
                  exportCSV(
                    [
                      { Name: 'John Doe', Email: 'john@acme.com', Country: 'United States', Status: 'Active Client' },
                      { Name: 'Priya Sharma', Email: 'priya@techcorp.in', Country: 'India', Status: 'Lead' },
                    ],
                    'clients_crm_export'
                  )
                }
                className="px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs flex items-center gap-2 hover:opacity-90"
              >
                <Download className="w-4 h-4" /> Export CRM Data
              </button>
            </div>

            <div className="space-y-4">
              {[
                { id: 'c1', name: 'John Doe', company: 'Acme Growth Corp', email: 'john@acme.com', phone: '+1 555 0192', country: 'United States', status: 'Active Client', spent: '$837' },
                { id: 'c2', name: 'Priya Sharma', company: 'TechCorp India', email: 'priya@techcorp.in', phone: '+91 98765 43210', country: 'India', status: 'Quote Sent', spent: '$0' },
              ].map((client) => (
                <div key={client.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{client.name}</span>
                        <span className="text-xs text-slate-400">({client.company})</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        📧 {client.email} · 📱 {client.phone} · 🌍 {client.country}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-emerald-400 font-bold text-sm">Spent: {client.spent}</span>
                      <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold">
                        {client.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Internal CRM Notes</label>
                    <textarea
                      rows={2}
                      defaultValue={clientNotes[client.id] || ''}
                      onChange={(e) => setClientNotes({ ...clientNotes, [client.id]: e.target.value })}
                      placeholder="Add private note for sales team..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROMO COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Promo &amp; Discount Coupons</h2>
                <p className="text-xs text-slate-400">Create discount codes for checkout promotions.</p>
              </div>
            </div>

            {/* Create Coupon Form */}
            <form onSubmit={handleAddCoupon} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono uppercase focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Discount Value (e.g. 20% or $50)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% or $50"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:opacity-90 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Coupon
              </button>
            </form>

            {/* Coupon List Table */}
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Redemptions</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {coupons.map((c) => (
                    <tr key={c.code}>
                      <td className="py-3.5 px-4 font-mono font-bold text-violet-400">{c.code}</td>
                      <td className="py-3.5 px-4 text-white font-semibold">{c.discount}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{c.uses} / {c.maxUses}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setCoupons(coupons.filter((item) => item.code !== c.code))}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SUPPORT QUEUE */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Support Ticket Queue</h2>
              <p className="text-xs text-slate-400">Incoming customer support queries requiring assistance.</p>
            </div>
            <div className="space-y-3">
              <div className="glass-card p-5 rounded-2xl border border-violet-500/30 bg-violet-950/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs font-bold text-violet-300">Ticket #TCK-1049 · High Priority</span>
                    <div className="text-sm font-bold text-white mt-0.5">Need help setting up custom domain DNS</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    PENDING REPLY
                  </span>
                </div>
                <p className="text-xs text-slate-300">Client: Rahul Sharma (Acme Corp) · rahul@acme.com</p>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type official admin reply..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                  <button className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
