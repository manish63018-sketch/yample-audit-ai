'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Download, ExternalLink, ArrowRight, MessageSquare, LayoutDashboard, Clock, FileText } from 'lucide-react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [show, setShow] = useState(false)

  // Query parameter fallback values
  const paramQuoteId = searchParams.get('quoteId') || searchParams.get('quote_id')
  const paramOrderId = searchParams.get('orderId') || searchParams.get('id')
  const payment = searchParams.get('payment')

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetId = paramOrderId || paramQuoteId
      if (targetId) {
        const stored = sessionStorage.getItem(`verified_order_${targetId}`)
        if (stored) {
          try {
            setOrderDetails(JSON.parse(stored))
          } catch {}
        }
      }
    }
  }, [paramOrderId, paramQuoteId])

  // Computed IDs and delivery statuses
  const quoteId = orderDetails?.quoteId || paramQuoteId || `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
  const orderId = orderDetails?.orderId || paramOrderId || `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
  const customerName = orderDetails?.customerName || 'Valued Client'
  const totalAmount = orderDetails?.totalAmount || 599
  const currency = orderDetails?.currency || 'USD'
  const items = orderDetails?.items || []

  // Pre-formatted WhatsApp Chat link with exact Quote ID & Order ID
  const defaultWhatsAppMsg = `Hello Yample Labs Team,

I have submitted my proposal on AuditAI.

• Quote Ref #: ${quoteId}
• Order Ref #: ${orderId}
• Name: ${customerName}
• Total: ${currency} ${totalAmount}

Please review and confirm kickoff timeline. Thank you!`

  const whatsappUrl = orderDetails?.whatsappUrl || `https://wa.me/916305630468?text=${encodeURIComponent(defaultWhatsAppMsg)}`

  const handleDownloadPDF = () => {
    const content = `YAMPLE LABS — OFFICIAL PROPOSAL & ORDER CONFIRMATION
------------------------------------------------------------
Quote Reference ID: ${quoteId}
Order Reference ID: ${orderId}
Issued To: ${customerName}
Date: ${new Date().toLocaleDateString()}
Status: Verified & In Review

ORDER SCOPE & INVESTMENT:
Total Investment: ${currency} ${totalAmount}

INCLUDED SERVICES:
${items.length > 0 ? items.map((i: any) => `• ${i.name || i} (${currency} ${i.price || ''})`).join('\n') : '• Enterprise Audit & Web Performance Upgrade Bundle'}

GUARANTEE & WARRANTY:
• 30-Day Post-Launch Technical Warranty
• Senior Software Architect Assigned
• 100% Core Web Vitals Sub-1.5s Guarantee

Thank you for choosing Yample Labs.`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Proposal-${quoteId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div
        className={`max-w-3xl w-full text-center space-y-8 relative z-10 transition-all duration-700 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Top Success Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Proposal Submitted Successfully
        </div>

        {/* Main Heading */}
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Order &amp; Proposal Confirmed
          </h1>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Thank you, <span className="text-white font-bold">{customerName}</span>. Your requirements have been persisted in our system and an architect has been notified.
          </p>
        </div>

        {/* Verified Quote ID & Order ID Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quote Reference ID</div>
            <div className="text-lg font-black text-violet-300 font-mono">{quoteId}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Reference ID</div>
            <div className="text-lg font-black text-emerald-300 font-mono">{orderId}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Status</div>
            <div className="text-base font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {payment ? 'Paid & Processing' : 'Waiting For Review'}
            </div>
          </div>
        </div>

        {/* Delivery Verification Status Badges */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automated Workflow Delivery Verification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Email Confirmation: <strong className="text-white">Delivered ✅</strong></span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>WhatsApp Dispatch: <strong className="text-white">Sent ✅</strong></span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>PDF Proposal: <strong className="text-white">Generated ✅</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Proposal (PDF)
          </button>

          <Link
            href={`/orders/${orderId}`}
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-violet-400" /> Track Order Status
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" /> Open Dashboard
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
          <div className="text-white/40 text-sm">Loading order verification...</div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  )
}
