export interface PDFReportData {
  auditId: string
  url: string
  overallScore: number
  performanceScore: number
  seoScore: number
  accessibilityScore: number
  securityScore: number
  date: string
  clientName?: string
  topIssues?: string[]
}

export class ReportPDFGenerator {
  /**
   * Generate branded HTML document ready for PDF rendering or download
   */
  static generateHTML(data: PDFReportData): string {
    const {
      auditId,
      url,
      overallScore,
      performanceScore,
      seoScore,
      accessibilityScore,
      securityScore,
      date,
      clientName = 'Valued Client',
    } = data

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AuditAI Report — ${url}</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #09090B; color: #FAFAFA; margin: 0; padding: 40px; }
    .cover { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 40px; margin-bottom: 40px; }
    .logo { font-size: 32px; font-weight: bold; color: #2563EB; letter-spacing: -1px; }
    .sublogo { font-size: 14px; color: #A1A1AA; text-transform: uppercase; tracking: 2px; }
    .title { font-size: 28px; margin-top: 24px; font-weight: 800; }
    .meta { font-size: 14px; color: #A1A1AA; margin-top: 8px; }
    .score-badge { display: inline-block; background: rgba(37,99,235,0.15); color: #2563EB; border: 1px solid rgba(37,99,235,0.3); font-size: 48px; font-weight: 800; padding: 20px 40px; rounded-radius: 16px; margin-top: 24px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 40px 0; }
    .card { background: #18181B; border: 1px solid #27272A; padding: 20px; border-radius: 12px; text-align: center; }
    .card-num { font-size: 24px; font-weight: 700; color: #2563EB; margin-top: 8px; }
    .card-title { font-size: 12px; color: #A1A1AA; text-transform: uppercase; }
    .section { background: #18181B; border: 1px solid #27272A; border-radius: 12px; padding: 28px; margin-bottom: 24px; }
    .section-title { font-size: 18px; font-weight: 700; color: #FAFAFA; border-bottom: 1px solid #27272A; padding-bottom: 12px; margin-bottom: 16px; }
    .footer { text-align: center; font-size: 12px; color: #A1A1AA; margin-top: 60px; border-top: 1px solid #27272A; padding-top: 24px; }
  </style>
</head>
<body>
  <div class="cover">
    <div class="logo">AuditAI</div>
    <div class="sublogo">by Yample Labs</div>
    <div class="title">Website Intelligence & Engineering Audit Report</div>
    <div class="meta">Prepared for: <strong>${clientName}</strong> (${url}) • Audit ID: ${auditId} • Date: ${date}</div>
    <div class="score-badge">${overallScore} / 100</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Performance</div>
      <div class="card-num">${performanceScore}</div>
    </div>
    <div class="card">
      <div class="card-title">SEO</div>
      <div class="card-num">${seoScore}</div>
    </div>
    <div class="card">
      <div class="card-title">Accessibility</div>
      <div class="card-num">${accessibilityScore}</div>
    </div>
    <div class="card">
      <div class="card-title">Security</div>
      <div class="card-num">${securityScore}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Executive Summary</div>
    <p style="font-size: 14px; line-height: 1.7; color: #A1A1AA;">
      AuditAI by Yample Labs conducted a comprehensive technical analysis of ${url}. The target site achieved a composite health score of ${overallScore}/100. Key bottlenecks were identified in mobile load times and missing security headers. Remediating these areas will improve conversion rates and search rankings.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Recommended Solution & Package</div>
    <p style="font-size: 14px; line-height: 1.7; color: #A1A1AA;">
      We recommend Yample Labs' <strong>Professional Upgrade Package ($1,999)</strong> including Core Web Vitals acceleration, WCAG AA compliance fixes, technical SEO overhaul, and 24/7 AI Assistant integration.
    </p>
  </div>

  <div class="footer">
    AuditAI by Yample Labs • yamplelabs@gmail.com • Instagram: @yamplelabs • Support: @mannish_2323 • GitHub: manish63018-sketch
  </div>
</body>
</html>`
  }
}
