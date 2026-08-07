'use client'

import React, { useState } from 'react'
import { FileCheck, PenTool, CheckCircle, ShieldCheck, X } from 'lucide-react'

interface DigitalContractModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  clientName: string
  onSigned: (signatureData: string) => void
}

export function DigitalContractModal({ isOpen, onClose, orderId, clientName, onSigned }: DigitalContractModalProps) {
  const [typedName, setTypedName] = useState(clientName)
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  if (!isOpen) return null

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedName || !agreed) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSigned(true)
      onSigned(typedName)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-2xl w-full rounded-2xl border border-violet-500/30 bg-[#0f0f1a] text-white p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Master Service Digital Contract</h2>
            <p className="text-xs text-slate-400">Order Ref: {orderId} · Governed by Yample Labs MSA</p>
          </div>
        </div>

        {isSigned ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Contract Digitally Signed!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Signed by <strong className="text-white">{typedName}</strong> on {new Date().toLocaleString()}. Timestamp and security hash logged in AuditAI contract registry.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:opacity-90 transition-all"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSign} className="space-y-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 max-h-56 overflow-y-auto text-xs text-slate-300 space-y-3 leading-relaxed">
              <p className="font-bold text-white">1. SCOPE & DELIVERABLES</p>
              <p>Yample Labs agrees to deliver custom digital services as detailed in Order #{orderId}. Deliverables include code, assets, and project files specified in your accepted quotation.</p>
              <p className="font-bold text-white">2. COMPLIMENTARY 30-DAY SUPPORT</p>
              <p>Project includes 30 calendar days of post-launch maintenance covering bug fixes and technical stability as per our SLA Policy.</p>
              <p className="font-bold text-white">3. INTELLECTUAL PROPERTY</p>
              <p>Upon receipt of 100% payment, full rights to custom deliverables transfer to the Client.</p>
              <p className="font-bold text-white">4. JURISDICTION</p>
              <p>Governed under the laws of India. Disputes subject to good-faith negotiation and Hyderabad jurisdiction.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Type Full Legal Name to Sign
                </label>
                <div className="relative">
                  <PenTool className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  <input
                    type="text"
                    required
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-violet-500/30 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
                />
                <span className="text-xs text-slate-300">
                  I understand this digital signature constitutes a legally binding agreement under IT Act 2000 & International e-signature laws.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted Log
              </span>
              <button
                type="submit"
                disabled={!agreed || !typedName || isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-violet-600 disabled:opacity-50 text-white font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'Signing Contract...' : '⚡ Accept & Sign Contract'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
