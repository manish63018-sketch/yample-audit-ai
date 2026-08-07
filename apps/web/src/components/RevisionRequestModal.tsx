'use client'

import React, { useState } from 'react'
import { RotateCcw, CheckCircle, Send, X } from 'lucide-react'

interface RevisionRequestModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  onSubmitRevision: (title: string, details: string) => void
}

export function RevisionRequestModal({ isOpen, onClose, orderId, onSubmitRevision }: RevisionRequestModalProps) {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !details) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      onSubmitRevision(title, details)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-2xl border border-violet-500/30 bg-[#0f0f1a] text-white p-6 space-y-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Submit Revision Request</h2>
            <p className="text-xs text-slate-400">Order Ref: {orderId} · Included in 2-round scope window</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Revision Submitted!</h3>
            <p className="text-xs text-slate-300">
              Our engineering team has received your revision brief. We will review and update within 24 business hours.
            </p>
            <button onClick={onClose} className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Revision Title / Component</label>
              <input
                type="text"
                required
                placeholder="e.g. Header CTA button color change & Mobile spacing fix"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Detailed Revision Feedback</label>
              <textarea
                required
                rows={4}
                placeholder="Please describe exactly what needs to be updated..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold flex items-center gap-2 hover:opacity-90"
              >
                <Send className="w-3.5 h-3.5" /> Submit Revision
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
