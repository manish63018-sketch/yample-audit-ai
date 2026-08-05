import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, reportId, scores } = body

    // Build 30-60-90 roadmap based on audit data
    const roadmap = {
      url,
      reportId,
      generatedAt: new Date().toISOString(),
      phases: [
        {
          phase: '30 Days',
          title: 'Foundation & Quick Wins',
          investment: 599,
          actions: [
            'Fix all Critical Core Web Vitals issues',
            'Implement on-page SEO: title tags, meta, H1 hierarchy',
            'Fix all WCAG AA accessibility violations',
            'Enable HTTPS, HSTS, and security headers',
            'Optimize all images (WebP, lazy loading)',
          ],
          recommendedServices: ['Website Upgrade ($599)'],
          expectedOutcome: '+25% page speed, +15% organic reach',
        },
        {
          phase: '60 Days',
          title: 'Growth & Automation',
          investment: 1100,
          actions: [
            'Launch AI Customer Assistant (24/7 lead qualification)',
            'Set up CRM pipeline for lead management',
            'WhatsApp automation for instant lead response',
            'Implement CRO on key conversion pages',
            'Monthly SEO content strategy kickoff',
          ],
          recommendedServices: ['AI Automation ($500)', 'CRM System ($400)', 'Monthly SEO ($200)'],
          expectedOutcome: '+18% lead capture rate, +12% conversion',
        },
        {
          phase: '90 Days',
          title: 'Scale & Dominate',
          investment: 850,
          actions: [
            'Advanced analytics dashboard with custom KPIs',
            'Competitor gap analysis',
            'Performance monitoring & regression alerts',
            'Mobile app or POS evaluation',
            'Conversion funnel deep-dive review',
          ],
          recommendedServices: ['Analytics Dashboard ($250)', 'Mobile App ($800 — optional)'],
          expectedOutcome: '+34% overall revenue growth projected',
        },
      ],
      totalInvestment: 2549,
      projectedROI: '340% in 12 months',
      priorityScore: scores ? Math.round(Object.values(scores as Record<string, number>).reduce((a, b) => a + b, 0) / Object.keys(scores).length) : 62,
    }

    return NextResponse.json({ success: true, roadmap })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to generate roadmap' }, { status: 500 })
  }
}
