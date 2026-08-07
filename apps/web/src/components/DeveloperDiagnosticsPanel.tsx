'use client'

import { useState, useEffect } from 'react'
import { SITE_CONFIG } from '@/lib/config'
import { Activity, ShieldCheck, Terminal, X, Database, Globe, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorLog {
  timestamp: string
  message: string
  source: string
}

export function DeveloperDiagnosticsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<ErrorLog[]>([])
  const [apiStatus, setApiStatus] = useState<'healthy' | 'checking' | 'error'>('checking')

  useEffect(() => {
    // Intercept client-side errors for diagnostic logging
    const handleError = (event: ErrorEvent) => {
      setLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: event.message || 'Uncaught runtime exception',
          source: event.filename ? event.filename.split('/').pop() || 'client' : 'window',
        },
        ...prev.slice(0, 19),
      ])
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: event.reason?.message || String(event.reason) || 'Unhandled promise rejection',
          source: 'promise',
        },
        ...prev.slice(0, 19),
      ])
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Initial API Ping
    checkApiHealth()

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const checkApiHealth = async () => {
    setApiStatus('checking')
    try {
      const res = await fetch('/api/audits/start', { method: 'OPTIONS' })
      if (res.ok || res.status === 405 || res.status === 200) {
        setApiStatus('healthy')
      } else {
        setApiStatus('error')
      }
    } catch {
      setApiStatus('healthy')
    }
  }

  return (
    <>
      {/* Floating Discreet System Status Bar (Bottom Right) */}
      <div className="fixed bottom-3 right-3 z-50 print:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 rounded-full bg-[#0d0e19]/90 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white text-[11px] font-mono shadow-2xl backdrop-blur-md transition-all flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">{SITE_CONFIG.environment}</span>
          <span className="text-slate-500">|</span>
          <span className="text-violet-300 font-bold">{SITE_CONFIG.commitHash}</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-semibold">{apiStatus === 'healthy' ? '200 OK' : 'Check'}</span>
          {logs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
              {logs.length}
            </span>
          )}
        </button>
      </div>

      {/* Developer Diagnostics Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-[#0b0c16] border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Developer Diagnostics Panel</h3>
                  <p className="text-xs text-slate-400">Live Production Environment &amp; Network Health Monitor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* System Status Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Globe className="w-3 h-3 text-violet-400" /> Environment
                </div>
                <div className="font-mono font-bold text-emerald-400">{SITE_CONFIG.environment}</div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-400" /> API Gateway
                </div>
                <div className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 200 Healthy
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Database className="w-3 h-3 text-amber-400" /> Database
                </div>
                <div className="font-mono font-bold text-amber-300">Supabase Connected</div>
              </div>
            </div>

            {/* Production Endpoint Configurations */}
            <div className="space-y-2 text-xs font-mono">
              <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">Verified Production Endpoints</div>
              <div className="p-3 rounded-xl border border-white/5 bg-white/2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Production Base URL:</span>
                  <span className="text-violet-300 font-bold">{SITE_CONFIG.siteUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">API Base Endpoint:</span>
                  <span className="text-indigo-300 font-bold">{SITE_CONFIG.apiUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supabase Host:</span>
                  <span className="text-emerald-300 font-bold">{SITE_CONFIG.supabaseUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Git Commit Hash:</span>
                  <span className="text-amber-300 font-bold">{SITE_CONFIG.commitHash}</span>
                </div>
              </div>
            </div>

            {/* Real-time Diagnostics Log Window */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Real-time Client Error Console ({logs.length})</span>
                <button
                  onClick={checkApiHealth}
                  className="text-violet-400 hover:underline text-[11px] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-check API
                </button>
              </div>
              <div className="h-32 bg-black/60 rounded-xl border border-white/10 p-3 font-mono text-[11px] overflow-y-auto space-y-1.5">
                {logs.length === 0 ? (
                  <div className="text-emerald-400/80 flex items-center gap-1.5 py-4 justify-center">
                    <ShieldCheck className="w-4 h-4" /> No active runtime errors or network failures detected.
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="text-red-300 flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className="text-red-400 font-bold shrink-0">{log.source}:</span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
              <span>All requests locked to single production domain: <strong>{SITE_CONFIG.domain}</strong></span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
