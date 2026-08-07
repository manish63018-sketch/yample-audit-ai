'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Circle,
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
  Download,
  FileCheck,
  RotateCcw,
} from 'lucide-react'
import { DigitalContractModal } from '@/components/DigitalContractModal'
import { RevisionRequestModal } from '@/components/RevisionRequestModal'

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
  color: string
}

interface StageHistory {
  stage: StageKey
  timestamp: string
  notes?: string
  progress?: number
}

const STAGES: Stage[] = [
  {
    key: 'order_received',
    label: 'Order Received',
    description: 'Your order has been confirmed and is in our queue.',
    icon: Package,
    color: 'emerald',
  },
  {
    key: 'planning',
    label: 'Planning & Strategy',
    description: 'Our team is analyzing your requirements and creating a detailed project plan.',
    icon: ClipboardList,
    color: 'sky',
  },
  {
    key: 'design',
    label: 'UI/UX Design',
    description: 'Crafting premium wireframes and design mockups for your approval.',
    icon: Palette,
    color: 'violet',
  },
  {
    key: 'development',
    label: 'Development',
    description: 'Building your solution with clean, scalable, production-grade code.',
    icon: Code2,
    color: 'indigo',
  },
  {
    key: 'testing',
    label: 'Testing & QA',
    description: 'Rigorous quality checks — performance, security, cross-browser testing.',
    icon: TestTube,
    color: 'amber',
  },
  {
    key: 'review',
    label: 'Client Review',
    description: 'Your project is ready for review. Share feedback for any revisions.',
    icon: Eye,
    color: 'orange',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'All revisions applied. Final deliverables are ready.',
    icon: Trophy,
    color: 'emerald',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Project handed over with full documentation and training.',
    icon: Rocket,
    color: 'violet',
  },
]

const DEMO_ORDER = {
  orderId: 'ORD-202608-9401',
  projectName: 'Website Redesign & AI Assistant',
  customerName: 'Rahul Sharma',
  companyName: 'Acme Growth Labs',
  services: ['Custom Website Redesign', 'AI Support Chatbot', 'On-Page SEO'],
  totalAmount: '$837',
  currentStage: 'design' as StageKey,
  progressPercent: 45,
  createdAt: 'Aug 7, 2026',
  estimatedDelivery: 'Aug 17, 2026',
  stageHistory: [
    {
      stage: 'order_received' as StageKey,
      timestamp: 'Aug 7, 2026 · 10:15 AM',
      notes: 'Payment confirmed via Razorpay. Order queued.',
      progress: 10,
    },
    {
      stage: 'planning' as StageKey,
      timestamp: 'Aug 7, 2026 · 02:30 PM',
      notes: 'Requirements reviewed. Strategy document prepared. Scope confirmed.',
      progress: 25,
    },
    {
      stage: 'design' as StageKey,
      timestamp: 'Aug 8, 2026 · 09:00 AM',
      notes: 'UI/UX design in progress. Framer mockups 75% complete.',
      progress: 45,
    },
  ] as StageHistory[],
}

function getStageStatus(stageKey: StageKey, currentStage: StageKey, history: StageHistory[]) {
  const stageIndex = STAGES.findIndex((s) => s.key === stageKey)
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage)

  if (stageIndex < currentIndex) return 'done'
  if (stageIndex === currentIndex) return 'active'
  return 'pending'
}

export default function OrderTrackerPage({ params }: { params?: { orderId?: string } }) {
  const orderId = params?.orderId || DEMO_ORDER.orderId
  const [expandedStage, setExpandedStage] = useState<StageKey | null>('design')
  const [isContractOpen, setIsContractOpen] = useState(false)
  const [isRevisionOpen, setIsRevisionOpen] = useState(false)
  const [contractSignedBy, setContractSignedBy] = useState<string | null>(null)

  const currentStageObj = STAGES.find((s) => s.key === DEMO_ORDER.currentStage)
  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent(`Hi Yample Labs! I have a question regarding Order ${orderId}`)}`

  return (
    <div className="space-y-8">
      <DigitalContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        orderId={orderId}
        clientName={DEMO_ORDER.customerName}
        onSigned={(name) => setContractSignedBy(name)}
      />
      <RevisionRequestModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        orderId={orderId}
        onSubmitRevision={() => {
          // Revision submitted
        }}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">{DEMO_ORDER.projectName}</h1>
            <span className="px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 font-mono text-xs font-bold">
              {orderId}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Client: <strong className="text-white">{DEMO_ORDER.customerName}</strong> ({DEMO_ORDER.companyName}) · Total: <strong className="text-emerald-400 font-mono">{DEMO_ORDER.totalAmount}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Progress Bar Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Stage</span>
            <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{currentStageObj?.label}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30 font-semibold">
                Stage 3 of 8
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Est. Delivery</span>
            <div className="text-sm font-mono font-bold text-emerald-400">{DEMO_ORDER.estimatedDelivery}</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Overall Progress</span>
            <span className="text-violet-400 font-bold">{DEMO_ORDER.progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 shadow-lg shadow-violet-500/30"
              style={{ width: `${DEMO_ORDER.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">8-Stage Project Lifecycle</h3>
        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-white/10">
          {STAGES.map((stage) => {
            const status = getStageStatus(stage.key, DEMO_ORDER.currentStage, DEMO_ORDER.stageHistory)
            const isDone = status === 'done'
            const isActive = status === 'active'
            const isExpanded = expandedStage === stage.key
            const historyEntry = DEMO_ORDER.stageHistory.find((h) => h.stage === stage.key)
            const Icon = stage.icon

            return (
              <div key={stage.key} className="relative group">
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : isActive
                      ? 'bg-violet-600 border-violet-400 text-white ring-4 ring-violet-500/20 animate-pulse'
                      : 'bg-[#0f0f1a] border-white/20 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3 h-3" />}
                </div>

                <div
                  onClick={() => setExpandedStage(isExpanded ? null : stage.key)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-violet-950/20 border-violet-500/30 shadow-lg'
                      : isDone
                      ? 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                      : 'bg-white/[0.01] border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className={`text-sm font-bold ${isActive ? 'text-violet-300' : isDone ? 'text-white' : 'text-slate-400'}`}>
                        {stage.label}
                      </h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 border border-violet-500/40 text-violet-300">
                          In Progress
                        </span>
                      )}
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    {historyEntry?.timestamp && (
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
                        {historyEntry.timestamp}
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <p className="text-xs text-slate-400">{stage.description}</p>
                      {historyEntry?.notes && (
                        <div className="text-xs text-slate-300 bg-white/5 rounded-lg p-3 border border-white/10">
                          <span className="font-bold text-violet-400">Yample Labs Update: </span>
                          {historyEntry.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Need support or project updates?</h4>
          <p className="text-xs text-slate-400 mt-1">Chat directly with the engineering lead on WhatsApp.</p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all"
        >
          <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}
