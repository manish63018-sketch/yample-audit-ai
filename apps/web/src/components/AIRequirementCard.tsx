'use client'

import { useGeo } from '@/context/GeoContext'

interface AIRequirement {
  summary: string[]
  estimatedCost: number
  budgetFit: 'under' | 'over' | 'match'
  recommendation: string
  translatedText?: string
  detectedLanguage?: string
  originalText?: string
}

interface AIRequirementCardProps {
  data: AIRequirement
  clientBudget: number
  currency: string
}

const languageFlags: Record<string, string> = {
  hi: '🇮🇳', 'hi-IN': '🇮🇳',
  fr: '🇫🇷', 'fr-FR': '🇫🇷',
  es: '🇪🇸', 'es-ES': '🇪🇸',
  ar: '🇸🇦', 'ar-SA': '🇸🇦',
  ja: '🇯🇵', 'ja-JP': '🇯🇵',
  de: '🇩🇪', 'de-DE': '🇩🇪',
  pt: '🇵🇹', zh: '🇨🇳',
  en: '🇺🇸', 'en-US': '🇺🇸', 'en-GB': '🇬🇧',
}

const languageNames: Record<string, string> = {
  hi: 'Hindi', 'hi-IN': 'Hindi',
  fr: 'French', 'fr-FR': 'French',
  es: 'Spanish', 'es-ES': 'Spanish',
  ar: 'Arabic', 'ar-SA': 'Arabic',
  ja: 'Japanese', 'ja-JP': 'Japanese',
  de: 'German', 'de-DE': 'German',
  pt: 'Portuguese', zh: 'Chinese',
  en: 'English', 'en-US': 'English', 'en-GB': 'English',
}

export function AIRequirementCard({ data, clientBudget, currency }: AIRequirementCardProps) {
  const { formatPrice } = useGeo()

  const budgetDiff = data.estimatedCost - clientBudget
  const budgetDiffAbs = Math.abs(budgetDiff)
  const hasTranslation = data.translatedText && data.detectedLanguage &&
    !data.detectedLanguage.startsWith('en')

  const langFlag = data.detectedLanguage ? (languageFlags[data.detectedLanguage] || '🌐') : ''
  const langName = data.detectedLanguage ? (languageNames[data.detectedLanguage] || data.detectedLanguage) : ''

  return (
    <div
      id="ai-requirement-card"
      className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-[#0F172A] to-[#0a0f1c] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg shrink-0">
          🤖
        </div>
        <div>
          <div className="text-sm font-bold text-white">AI Requirement Analysis</div>
          <div className="text-xs text-white/40">Powered by Gemini AI · AuditAI</div>
        </div>
        <div className="ml-auto px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-[10px] font-semibold">
          ✓ Analyzed
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Requirement Summary */}
        <div>
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Client Needs:
          </div>
          <div className="space-y-1.5">
            {data.summary.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="rounded-xl border border-white/5 bg-white/3 p-4 space-y-3">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Budget Analysis
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-white/30 mb-1">Client Budget</div>
              <div className="text-lg font-bold text-white">
                {formatPrice(clientBudget)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 mb-1">AI Estimate</div>
              <div className={`text-lg font-bold ${
                data.budgetFit === 'under' ? 'text-amber-400' :
                data.budgetFit === 'over' ? 'text-green-400' : 'text-violet-400'
              }`}>
                {formatPrice(data.estimatedCost)}
              </div>
            </div>
          </div>

          {/* Budget fit indicator */}
          <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${
            data.budgetFit === 'under'
              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
              : data.budgetFit === 'over'
              ? 'bg-green-500/10 border border-green-500/20 text-green-300'
              : 'bg-violet-500/10 border border-violet-500/20 text-violet-300'
          }`}>
            <span className="text-base shrink-0">
              {data.budgetFit === 'under' ? '⚠️' : data.budgetFit === 'over' ? '✅' : '🎯'}
            </span>
            <p className="leading-relaxed">{data.recommendation}</p>
          </div>

          {data.budgetFit === 'under' && (
            <div className="text-xs text-white/30 flex items-center gap-1">
              <span>Budget gap:</span>
              <span className="text-amber-400 font-semibold">{formatPrice(budgetDiffAbs)}</span>
              <span>· We recommend phased delivery</span>
            </div>
          )}
        </div>

        {/* Translation (if non-English) */}
        {hasTranslation && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{langFlag}</span>
              <div className="text-xs font-semibold text-blue-300">
                Auto-Translated from {langName}
              </div>
              <div className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[9px] font-semibold">
                Gemini AI
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div>
                <div className="text-white/30 mb-1">Original ({langName}):</div>
                <div className="text-white/50 italic bg-white/3 rounded-lg p-2.5">
                  {data.originalText}
                </div>
              </div>
              <div>
                <div className="text-white/30 mb-1">English Translation:</div>
                <div className="text-white/70 bg-white/3 rounded-lg p-2.5">
                  {data.translatedText}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
