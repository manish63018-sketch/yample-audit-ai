'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGeo } from '@/context/GeoContext';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Rocket,
  Receipt,
  MessageSquare,
  User,
  LogOut,
  ExternalLink,
  Inbox,
  CreditCard,
  Download,
  Send,
} from 'lucide-react';

type TabType =
  | 'audits'
  | 'quotes'
  | 'orders'
  | 'projects'
  | 'invoices'
  | 'tickets'
  | 'profile'
  | 'messages'
  | 'payments'
  | 'downloads';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { formatPrice } = useGeo();
  const [activeTab, setActiveTab] = useState<TabType>('audits');
  const [user, setUser] = useState<any>(null);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [activeQuote, setActiveQuote] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUser = localStorage.getItem('auditai_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    } else {
      setUser({
        fullName: 'Client Partner',
        email: 'client@yamplelabs.com',
        phone: '+1 234 567 8900',
        country: 'United States',
        companyName: 'Acme Growth Labs',
        websiteUrl: 'acme.com',
      });
    }

    const storedQuote = localStorage.getItem('auditai_active_quote');
    if (storedQuote) {
      try {
        setActiveQuote(JSON.parse(storedQuote));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auditai_user');
    }
    router.push('/login');
  };

  // Demo Project Milestones Data
  const MILESTONES = [
    { id: 1, title: 'Order & Scope Confirmed', done: true, time: 'Aug 7, 10:15 AM' },
    { id: 2, title: 'Strategy & Wireframing', done: true, time: 'Aug 7, 02:30 PM' },
    { id: 3, title: 'UI/UX Framer Design', done: false, active: true, time: 'In Progress (75%)' },
    { id: 4, title: 'Next.js 16 Development', done: false, time: 'Pending' },
    { id: 5, title: 'Core Web Vitals & Security QA', done: false, time: 'Pending' },
    { id: 6, title: 'Live Vercel Edge Launch', done: false, time: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Portal &amp; Projects</h1>
          <p className="text-xs text-slate-400">
            Welcome back,{' '}
            <span className="text-violet-300 font-bold">
              {user?.fullName || user?.name || 'Customer'}
            </span>
            !
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:opacity-90 transition-all"
          >
            + Run New Audit
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-3 space-y-2">
          {[
            { id: 'audits', label: 'My Audits', icon: LayoutDashboard, count: 2 },
            { id: 'quotes', label: 'My Quotes', icon: FileText, count: activeQuote ? 1 : 0 },
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: 1 },
            { id: 'projects', label: 'My Projects', icon: Rocket, count: 1, badge: 'Active' },
            { id: 'invoices', label: 'My Invoices', icon: Receipt, count: 1 },
            { id: 'payments', label: 'Payment History', icon: CreditCard, count: 1 },
            { id: 'downloads', label: 'Download Reports', icon: Download, count: 3 },
            { id: 'tickets', label: 'Support Tickets', icon: MessageSquare, count: 0 },
            { id: 'messages', label: 'Messages', icon: Inbox, count: 1, badge: 'New' },
            { id: 'profile', label: 'Profile Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-violet-600/20 border border-violet-500/40 text-violet-300 shadow-lg shadow-violet-500/10'
                    : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === 'number' && !tab.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Main Content */}
        <div className="md:col-span-9 space-y-6">
          {/* TAB 1: MY AUDITS */}
          {activeTab === 'audits' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">My Website Audits</h2>
                  <p className="text-xs text-slate-400">
                    View and download historical technical website scans.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">github.com</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        Score: 70/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Scanned on Aug 7, 2026 · Performance 40 · SEO 69 · Security 100
                    </p>
                  </div>
                  <Link
                    href="/audit"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-violet-300 transition-all flex items-center gap-1.5"
                  >
                    View Full Report <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">Your Website</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        Score: 92/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Scanned on Aug 7, 2026 · Performance 96 · SEO 92 · Security 90
                    </p>
                  </div>
                  <Link
                    href="/audit"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-violet-300 transition-all flex items-center gap-1.5"
                  >
                    View Full Report <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">My Custom Quotations</h2>
                <p className="text-xs text-slate-400">
                  Itemized quotes generated based on your requirement inputs.
                </p>
              </div>

              {activeQuote ? (
                <div className="glass-card p-6 rounded-2xl border border-violet-500/30 bg-violet-950/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-violet-400 font-bold">
                        Quote #{activeQuote.quoteId}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Custom Growth Bundle ({activeQuote.customer?.businessName || 'Business'})
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      Locked Price: {formatPrice(activeQuote.totalUSD)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div>
                      <strong>Features Included:</strong> {activeQuote.selectedFeatures?.join(', ')}
                    </div>
                    <div>
                      <strong>Target Timeline:</strong>{' '}
                      {activeQuote.customer?.deadline || '7-10 Days'}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <Link
                      href="/checkout"
                      className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:opacity-90 transition-all"
                    >
                      Proceed to Checkout →
                    </Link>
                    <button
                      onClick={() =>
                        window.open(
                          `/api/pdf/generate?type=quote&id=${
                            activeQuote.quoteId
                          }&name=${encodeURIComponent(
                            activeQuote.customer?.name || 'Valued Client'
                          )}&amount=${encodeURIComponent(
                            activeQuote.pricing?.totalUSD || '$837.00'
                          )}&autoprint=true`,
                          '_blank'
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-all"
                    >
                      📄 Download PDF Quote
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-3">
                  <p className="text-slate-400 text-xs">No active quotes found.</p>
                  <Link
                    href="/requirements"
                    className="inline-block px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold"
                  >
                    + Fill Requirement Form for Instant Quote
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY PROJECTS & MILESTONE TRACKER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  Active Project &amp; Milestone Tracker
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time status of your custom website redesign project.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                      Project ID: PRJ-2026-9042
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      Website &amp; AI Assistant Redesign
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Overall Progress</div>
                    <div className="text-2xl font-black text-violet-400 font-mono">45%</div>
                  </div>
                </div>

                {/* Milestones list */}
                <div className="space-y-4">
                  {MILESTONES.map((m, idx) => (
                    <div key={m.id} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          m.done
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : m.active
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500 animate-pulse'
                            : 'bg-white/5 text-slate-500 border border-white/10'
                        }`}
                      >
                        {m.done ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{m.title}</div>
                        <div className="text-xs text-slate-400">{m.time}</div>
                      </div>
                      {m.active && (
                        <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & INVOICES */}
          {(activeTab === 'orders' || activeTab === 'invoices') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Orders &amp; Invoices</h2>
                <p className="text-xs text-slate-400">Billing receipts and official invoices.</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Invoice #INV-2026-4401</div>
                  <div className="text-slate-400">Paid via Razorpay on Aug 7, 2026</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400 font-mono">{formatPrice(837)}</div>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    PAID
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Messages</h2>
                <p className="text-xs text-slate-400">
                  Communication from Yample Labs team about your projects.
                </p>
              </div>
              <div className="space-y-3">
                <div className="glass-card p-5 rounded-2xl border border-violet-500/30 bg-violet-950/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
                        YL
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Yample Labs Team</div>
                        <div className="text-[10px] text-slate-500">Aug 8, 2026 · 11:30 AM</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-11">
                    Hi! Your design phase is progressing well. We&apos;ve completed 75% of the UI
                    mockups for your website. Can you please review the color palette we shared and
                    confirm your approval? We&apos;ll move to development once confirmed.
                  </p>
                  <div className="pl-11">
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                      />
                      <button className="px-3 py-2 rounded-lg bg-violet-600 text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1">
                        <Send className="w-3 h-3" /> Send
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
                      YL
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Yample Labs Team</div>
                      <div className="text-[10px] text-slate-500">Aug 7, 2026 · 02:15 PM</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-11">
                    Your order ORD-2026-9401 has been confirmed. Our team will begin the planning
                    phase within the next 4 business hours. Thank you for choosing Yample Labs!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Payment History</h2>
                <p className="text-xs text-slate-400">
                  All transactions processed through Razorpay and other channels.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="glass-card">
                      <td className="py-3.5 px-4 text-slate-400">Aug 7, 2026</td>
                      <td className="py-3.5 px-4 text-white font-medium">
                        Website Redesign + AI Bot
                      </td>
                      <td className="py-3.5 px-4 font-mono text-violet-400">ORD-2026-9401</td>
                      <td className="py-3.5 px-4 text-slate-300">Razorpay · UPI</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                        {formatPrice(837)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          PAID
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: DOWNLOAD REPORTS */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Download Reports</h2>
                <p className="text-xs text-slate-400">
                  PDF reports, invoices, and project deliverables available for download.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: 'Audit Report — github.com',
                    date: 'Aug 7, 2026',
                    type: 'Audit PDF',
                    icon: '📊',
                    size: '2.4 MB',
                  },
                  {
                    name: 'Audit Report — Your Website',
                    date: 'Aug 7, 2026',
                    type: 'Audit PDF',
                    icon: '📊',
                    size: '3.1 MB',
                  },
                  {
                    name: 'Invoice #INV-2026-4401',
                    date: 'Aug 7, 2026',
                    type: 'Invoice PDF',
                    icon: '🧾',
                    size: '156 KB',
                  },
                ].map((file) => (
                  <div
                    key={file.name}
                    className="glass-card p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{file.icon}</span>
                      <div className="space-y-1">
                        <div className="font-semibold text-white text-sm">{file.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {file.type} · {file.size} · Generated {file.date}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          `/api/pdf/generate?type=${
                            file.type.includes('Invoice') ? 'invoice' : 'audit'
                          }&id=${file.name.replace(
                            /[^a-zA-Z0-9-]/g,
                            '_'
                          )}&name=${encodeURIComponent(
                            user?.fullName || 'Valued Client'
                          )}&autoprint=true`,
                          '_blank'
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-600/30 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Support Tickets</h2>
                  <p className="text-xs text-slate-400">
                    Get help with your orders, projects, or billing questions.
                  </p>
                </div>
                <button
                  onClick={() => setTicketSuccess(true)}
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:opacity-90 transition-all"
                >
                  + New Ticket
                </button>
              </div>
              {ticketSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center justify-between">
                  <span>
                    ✅ Support Ticket form initialized. Our agent will connect with you via email
                    within 2 hours.
                  </span>
                  <button
                    onClick={() => setTicketSuccess(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-3">
                <div className="text-3xl">🎫</div>
                <p className="text-slate-400 text-sm">No open support tickets.</p>
                <p className="text-xs text-slate-500">
                  For urgent issues, use the Chat on WhatsApp button.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Profile Settings</h2>
                <p className="text-xs text-slate-400">
                  Update your contact details and account preferences.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.fullName || user?.name || ''}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Mobile / WhatsApp
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.phone || user?.mobile || ''}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.country || ''}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.companyName || ''}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    defaultValue={user?.websiteUrl || ''}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm"
                  />
                </div>
                {profileSaved && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300">
                    ✅ Profile settings saved successfully!
                  </div>
                )}
                <button
                  onClick={() => setProfileSaved(true)}
                  className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-xs hover:opacity-90 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
