'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Package,
  ClipboardList,
  Palette,
  Code2,
  TestTube,
  Eye,
  Trophy,
  Rocket,
  ArrowLeft,
  MessageSquare,
  FileCheck,
  RotateCcw,
  ShoppingBag,
  Download,
} from 'lucide-react'
import { DigitalContractModal } from '@/components/DigitalContractModal'
import { RevisionRequestModal } from '@/components/RevisionRequestModal'
import { CurrencyToggle } from '@/components/CurrencyToggle'

type StageKey =
  | 'order_received'
  | 'planning'
  | 'design'
  | 'development'
  | 'testing'
  | 'review'
  | 'completed'
  | 'delivered'

interface Stage {
  key: StageKey
  label: string
  description: string
  icon: React.ElementType
}

const STAGES: Stage[] = [
  { key: 'order_received', label: 'Order Received', description: 'Your order has been confirmed and is in our queue.', icon: Package },
  { key: 'planning', label: 'Planning & Strategy', description: 'Our team is analyzing your requirements and creating a detailed project plan.', icon: ClipboardList },
  { key: 'design', label: 'UI/UX Design', description: 'Crafting premium wireframes and design mockups for your approval.', icon: Palette },
  { key: 'development', label: 'Development', description: 'Building your solution with clean, scalable, production-grade code.', icon: Code2 },
  { key: 'testing', label: 'Testing & QA', description: 'Rigorous quality checks — performance, security, cross-browser testing.', icon: TestTube },
  { key: 'review', label: 'Client Review', description: 'Your project is ready for review. Share feedback for any revisions.', icon: Eye },
  { key: 'completed', label: 'Completed', description: 'All revisions applied. Final deliverables are ready.', icon: Trophy },
  { key: 'delivered', label: 'Delivered', description: 'Project handed over with full documentation and training.', icon: Rocket },
]

export default function OrderTrackerPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params)
  const orderId = resolvedParams.orderId || 'YPL-ORD-DEMO'

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedStage, setExpandedStage] = useState<StageKey | null>('design')
  const [isContractOpen, setIsContractOpen] = useState(false)
  const [isRevisionOpen, setIsRevisionOpen] = useState(false)
  const [contractSignedBy, setContractSignedBy] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !orderId) return

    const loadOrder = async () => {
      // 1. Try sessionStorage
      const stored = sessionStorage.getItem(`verified_order_${orderId}`)
      if (stored) {
        try {
          setOrder(JSON.parse(stored))
          setLoading(false)
          return
        } catch {}
      }

      // 2. Fetch from DB
      try {
        const res = await fetch(`/api/orders?id=${orderId}`)
        const data = await res.json()
        if (data.success && data.data) {
          setOrder(data.data)
        }
      } catch {}

      setLoading(false)
    }

    loadOrder()
  }, [orderId])

  const customerName = order?.customerName || order?.customer_name || 'Valued Client'
  const customerEmail = order?.customerEmail || order?.customer_email || 'client@yamplelabs.com'
  const customerId = order?.customerId || order?.customer_id || 'YPL-CUST-VERIFIED'
  const quoteId = order?.quoteId || order?.quote_id || 'YPL-QT-VERIFIED'
  const rewardId = order?.rewardId || order?.reward_id || (order?.rewardItem ? order.rewardItem.id : null)
  const rewardItem = order?.rewardItem || (order?.items ? order.items.find((i: any) => i.isReward) : null)
  const currentStatus = order?.orderStatus || order?.status || 'Quote Requested'
  const paymentStatus = order?.paymentStatus || order?.payment_status || 'Unpaid'
  const summary = order?.summary || {
    finalTotalFormatted: '$1,258',
    subtotalFormatted: '$1,398',
    currencyCode: 'USD',
  }
  const items = order?.items || order?.line_items || [
    { name: 'Custom Website Redesign & SEO Overhaul', price: 799, category: 'Engineering' },
    { name: 'AI Support Chatbot Integration', price: 599, category: 'AI Suite' },
  ]

  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent(
    `Hello Yample Labs! Checking status for Customer ID ${customerId}, Order ID ${orderId}`
  )}`

  const handleDownloadInvoice = () => {
    const text = `YAMPLE LABS — OFFICIAL ORDER & TRACKING INVOICE
------------------------------------------------------------
Customer Account ID: ${customerId}
Quote Reference ID: ${quoteId}
Order Reference ID: ${orderId}
Reward ID: ${rewardId || 'N/A'}
Issued To: ${customerName} (${customerEmail})
Date: ${new Date().toLocaleDateString()}
Current Status: ${currentStatus}
Payment Status: ${paymentStatus}

ORDER ITEMS:
${items.map((i: any) => `- ${i.name} (${i.isReward ? '100% FREE' : i.price || 'Included'})`).join('\n')}

INVESTMENT SUMMARY:
Total Investment: ${summary.finalTotalFormatted || '$1,258'}

Thank you for choosing Yample Labs.`

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${orderId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      <DigitalContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        orderId={orderId}
        clientName={customerName}
        onSigned={(name) => setContractSignedBy(name)}
      />
      <RevisionRequestModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        orderId={orderId}
        onSubmitRevision={() => {}}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-white">Order Tracking</h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              {orderId}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Client: <strong className="text-white">{customerName}</strong> · Customer ID: <strong className="text-violet-300 font-mono">{customerId}</strong> · Quote ID: <strong className="text-violet-300 font-mono">{quoteId}</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CurrencyToggle />
          <button
            onClick={() => setIsContractOpen(true)}
            className="px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-600/30 transition-all flex items-center gap-2"
          >
            <FileCheck className="w-3.5 h-3.5" /> {contractSignedBy ? 'Signed Contract' : 'Digital Contract'}
          </button>
          <button
            onClick={() => setIsRevisionOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Request Revision
          </button>
        </div>
      </div>

      {/* Overview Progress Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 bg-gradient-to-br from-violet-950/20 via-slate-900 to-slate-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Order Status</span>
            <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{currentStatus}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30 font-semibold">
                Verified
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Investment</span>
            <div className="text-lg font-mono font-black text-emerald-400">
              {summary.finalTotalFormatted}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items & Reward List */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-violet-400" /> Services &amp; Promotional Rewards
          </h3>

          <div className="space-y-3">
            {items.map((item: any) => (
              <div
                key={item.id || item.name}
                className={`p-4 rounded-2xl border ${
                  item.isReward
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-white/10 bg-white/5'
                } space-y-2`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {item.isReward ? '🎁 Promotional Reward' : item.category || 'Service'}
                      </span>
                      {(item.rewardId || rewardId) && item.isReward && (
                        <span className="text-[10px] text-violet-300 font-mono">
                          ID: {item.rewardId || rewardId}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{item.name}</h4>
                  </div>
                  <div className="text-sm font-black font-mono">
                    {item.isReward ? (
                      <span className="text-emerald-400">100% FREE ($0)</span>
                    ) : (
                      <span className="text-violet-300">${item.price || 'Included'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Actions &amp; Export</h3>

            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Download Official Invoice
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Engineering Lead
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
