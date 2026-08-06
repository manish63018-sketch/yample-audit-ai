'use client'

import { useState } from 'react'
import { Download, FileText, CheckCircle2 } from 'lucide-react'

export function PDFGenerator({ auditData, targetRefId }: { auditData: any; targetRefId: string }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      // Use window.print() as native, crisp, zero-dependency PDF generator
      window.print()
    } catch (err) {
      console.error('PDF print error:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 font-semibold text-xs transition-all shadow-md"
    >
      <Download className="w-4 h-4" />
      <span>{downloading ? 'Preparing PDF...' : 'Download PDF Report'}</span>
    </button>
  )
}
