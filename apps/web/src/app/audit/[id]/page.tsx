'use client'

import { useState, useEffect, useRef, Suspense, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ── Loading steps ────────────────────────────────────────────────── */
const STEPS = [
  { id: 'validate',     label: 'Validating Website',           icon: '1', color: '#6366f1' },
  { id: 'availability', label: 'Checking Availability',         icon: '2', color: '#8b5cf6' },
  { id: 'screenshot',   label: 'Capturing Screenshot',          icon: '3', color: '#a855f7' },
  { id: 'performance',  label: 'Running Performance Analysis',  icon: '4', color: '#10b981' },
  { id: 'seo',          label: 'Running SEO Analysis',          icon: '5', color: '#6366f1' },
  { id: 'accessibility',label: 'Running Accessibility Checks',  icon: '6', color: '#3b82f6' },
  { id: 'security',     label: 'Running Security Checks',       icon: '7', color: '#f59e0b' },
  { id: 'ai',           label: 'AI Business Analysis',          icon: '8', color: '#ec4899' },
  { id: 'report',       label: 'Generating Report',             icon: '9', color: '#14b8a6' },
  { id: 'dashboard',    label: 'Preparing Dashboard',           icon: '10', color: '#f97316' },
]

const POLL_INTERVAL_MS = 2000

interface AuditLoadingProps {
  auditId: string
  url: string
  businessCategory: string
  country: string
  businessGoal: string
}

function AuditLoadingContent({ auditId, url, businessCategory, country, businessGoal }: AuditLoadingProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(5)
  const [statusLabel, setStatusLabel] = useState('Starting audit...')
  const [auditStatus, setAuditStatus] = useState<'queued' | 'running' | 'completed' | 'failed'>('queued')
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const processStarted = useRef(false)
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const displayUrl = (url || 'website.com').replace(/^https?:\/\//, '')

  /* ── Start the audit process once ──────────────────────────────── */
  useEffect(() => {
    if (!auditId || processStarted.current) return
    processStarted.current = true

    const runAudit = async () => {
      try {
        const res = await fetch(`/api/audits/${auditId}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, businessCategory, country, businessGoal }),
        })
        const data = await res.json()

        if (data.success && data.data) {
          // Store full result in sessionStorage for instant report rendering
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(`audit_data_${auditId}`, JSON.stringify(data.data))
          }
          setProgress(100)
          setCurrentStep(9)
          setStatusLabel('Preparing Dashboard')
          setAuditStatus('completed')

          // Small delay for the "completed" animation to show
          setTimeout(() => {
            router.push(`/report/${auditId}`)
          }, 1200)
        } else {
          setError(data.error?.message || 'Audit failed. Please try again.')
          setAuditStatus('failed')
        }
      } catch (err) {
        console.error('Audit process error:', err)
        setError('Connection error during audit. Please check your network and retry.')
        setAuditStatus('failed')
      }
    }

    runAudit()
  }, [auditId, url, businessCategory, country, businessGoal, router])

  /* ── Animate progress independently of DB polling ──────────────── */
  useEffect(() => {
    if (auditStatus === 'completed' || auditStatus === 'failed') return

    // Smoothly advance progress bar
    const progTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 92) return 92 // Cap at 92 until real completion
        return p + (p < 30 ? 3 : p < 60 ? 1.5 : p < 80 ? 0.8 : 0.3)
      })
    }, 200)

    // Cycle through step labels to show activity
    const stepTimer = setInterval(() => {
      setCurrentStep(s => {
        const next = s + 1
        if (next >= STEPS.length - 1) return s
        return next
      })
    }, 4500)

    return () => {
      clearInterval(progTimer)
      clearInterval(stepTimer)
    }
  }, [auditStatus])

  /* ── Poll DB status every 2s ────────────────────────────────────── */
  useEffect(() => {
    if (!auditId || auditStatus === 'completed' || auditStatus === 'failed') {
      if (pollTimer.current) clearInterval(pollTimer.current)
      return
    }

    const poll = async () => {
      try {
        const res = await fetch(`/api/audits/${auditId}/status`)
        const data = await res.json()
        if (!data.success) return

        const { status, progress: dbProgress, step, label } = data.data

        if (typeof step === 'number' && step >= 0) {
          setCurrentStep(s => Math.max(s, step))
        }
        if (typeof dbProgress === 'number') {
          setProgress(p => Math.max(p, dbProgress))
        }
        if (label) setStatusLabel(label)

        if (status === 'completed') {
          setAuditStatus('completed')
          setProgress(100)
          setCurrentStep(9)
          setTimeout(() => {
            router.push(`/report/${auditId}`)
          }, 1000)
        } else if (status === 'failed') {
          setAuditStatus('failed')
          setError('Audit encountered an error. Please retry.')
        }
      } catch {
        // Silently ignore poll errors
      }
    }

    poll()
    pollTimer.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current)
    }
  }, [auditId, auditStatus, router])

  const handleRetry = () => {
    setError('')
    setAuditStatus('queued')
    setProgress(5)
    setCurrentStep(0)
    setRetryCount(r => r + 1)
    processStarted.current = false
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <span>🔍</span>
          <span className="font-semibold text-sm">AuditAI</span>
          <span className="text-[10px] text-violet-400 font-normal">by Yample Labs</span>
        </Link>
        <div className="text-xs text-slate-500 font-mono hidden md:block truncate max-w-xs">
          Audit ID: <span className="text-violet-400">{auditId?.slice(0, 14)}...</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {auditStatus === 'failed' ? (
          /* ── Error State ──────────────────────────────────────────── */
          <div className="w-full max-w-md text-center">
            <div className="text-5xl mb-6 animate-bounce">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-3">Audit Encountered an Issue</h2>
            <p className="text-white/50 text-sm mb-2">{error}</p>
            <p className="text-white/30 text-xs mb-8">
              Target: <span className="text-violet-300 font-mono">{displayUrl}</span>
            </p>
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={handleRetry}
                id="retry-audit-button"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/25"
              >
                🔄 Retry Audit — {displayUrl}
              </button>
              <Link
                href="/"
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        ) : (
          /* ── Loading State ────────────────────────────────────────── */
          <div className="w-full max-w-xl">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl" />
              <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-600/6 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  AI-Powered Enterprise Audit Running
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Analyzing Your Website
                </h1>
                <p className="text-white/40 text-sm font-mono">
                  {displayUrl}
                </p>
                <p className="text-white/30 text-xs mt-1">
                  {businessCategory} · {businessGoal}
                </p>
              </div>

              {/* Steps List */}
              <div className="space-y-2 mb-8">
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentStep
                  const isActive = idx === currentStep
                  const isPending = idx > currentStep

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                        isActive
                          ? 'bg-white/[0.06] border border-white/10'
                          : isDone
                          ? 'opacity-60'
                          : 'opacity-25'
                      }`}
                      style={isActive ? { borderColor: `${step.color}30` } : {}}
                    >
                      {/* Status icon */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500/20 border border-emerald-500/40'
                            : isActive
                            ? 'border border-white/20 bg-white/5'
                            : 'border border-white/8'
                        }`}
                      >
                        {isDone ? (
                          <span className="text-emerald-400 text-xs font-bold">✓</span>
                        ) : isActive ? (
                          <span className="text-xs animate-spin inline-block">⟳</span>
                        ) : (
                          <span className="text-[10px] text-white/30">{idx + 1}</span>
                        )}
                      </div>

                      {/* Step icon */}
                      <span
                        className="text-base"
                        style={{ filter: isPending ? 'grayscale(1)' : 'none' }}
                      >
                        {step.icon}
                      </span>

                      {/* Label */}
                      <span
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isDone
                            ? 'text-white/50'
                            : isActive
                            ? 'text-white'
                            : 'text-white/25'
                        }`}
                      >
                        {step.label}
                      </span>

                      {/* Active pulse dot */}
                      {isActive && (
                        <span
                          className="ml-auto w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                          style={{ background: step.color }}
                        />
                      )}
                      {isDone && (
                        <span className="ml-auto text-emerald-400/60 text-xs">done</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Progress Bar */}
              <div className="glass-card p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-xs">
                    {auditStatus === 'completed' ? '✅ Complete!' : statusLabel}
                  </span>
                  <span className="text-violet-400 font-bold font-mono text-sm">
                    {Math.min(Math.floor(progress), 100)}%
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                      boxShadow: '0 0 12px rgba(99,102,241,0.6)',
                    }}
                  />
                </div>

                <p className="text-white/25 text-[11px] mt-3 text-center">
                  This usually takes 15–45 seconds · Do not close this tab
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page — unwraps params Promise for Next.js 15 ──── */
export default function AuditIdPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = (typeof (params as any)?.then === 'function' ? use(params as Promise<{ id: string }>) : params) as { id: string }
  const auditId = resolvedParams.id

  const [meta, setMeta] = useState<{
    url: string
    businessCategory: string
    country: string
    businessGoal: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !auditId) return

    const loadMeta = async () => {
      // 1. Check localStorage
      const stored = localStorage.getItem(`audit_meta_${auditId}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.url) {
            setMeta(parsed)
            setLoading(false)
            return
          }
        } catch {}
      }

      // 2. Fallback: fetch status or full report from API
      try {
        const res = await fetch(`/api/audits/${auditId}`)
        const data = await res.json()
        if (data.success && data.data) {
          setMeta({
            url: data.data.url || 'website.com',
            businessCategory: data.data.business?.detectedCategory || 'General Business',
            country: 'US',
            businessGoal: 'More Leads',
          })
          setLoading(false)
          return
        }
      } catch {}

      // Fallback
      setMeta({ url: 'website.com', businessCategory: 'General Business', country: 'US', businessGoal: 'More Leads' })
      setLoading(false)
    }

    loadMeta()
  }, [auditId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
        <div className="text-white/40 text-sm">Starting audit engine...</div>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
          <div className="text-white/40 text-sm">Loading audit engine...</div>
        </div>
      }
    >
      <AuditLoadingContent
        auditId={auditId}
        url={meta?.url || 'website.com'}
        businessCategory={meta?.businessCategory || 'General Business'}
        country={meta?.country || 'US'}
        businessGoal={meta?.businessGoal || 'More Leads'}
      />
    </Suspense>
  )
}
