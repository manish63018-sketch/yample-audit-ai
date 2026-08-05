'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GrowthRoadmapModal } from './GrowthRoadmapModal'

interface Props {
  reportId: string
  url: string
  issueCount: number
  onDismiss: () => void
}

export function AIRecommendationPopup({ reportId, url, issueCount, onDismiss }: Props) {
  const [showRoadmap, setShowRoadmap] = useState(false)

  if (showRoadmap) {
    return <GrowthRoadmapModal url={url} reportId={reportId} onClose={onDismiss} />
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-6 md:items-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-violet-500/20 bg-[#0d0d14] shadow-2xl overflow-hidden animate-slide-up" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}>
        {/* Header gradient strip */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-2xl shrink-0">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-violet-300">AI Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/30">Online</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Based on your audit, I found <span className="text-violet-300 font-semibold">{issueCount} opportunities</span> to improve your website&apos;s performance, user experience, and lead generation.
              </p>
            </div>
          </div>

          <div className="bg-white/3 rounded-xl border border-white/5 p-4 mb-5">
            <p className="text-sm text-white/60 leading-relaxed">
              Would you like me to prepare a personalized <span className="text-white font-medium">30-60-90 day Business Growth Roadmap</span> with recommended services, investment breakdown, and timeline?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRoadmap(true)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              🗺️ Generate Growth Roadmap
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-3 rounded-xl border border-white/5 bg-white/3 text-white/40 hover:text-white/60 transition-colors text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
