import type { ProposalOptions, ProposalResult, ProposalScopeItem } from './types'

/**
 * Proposal Generator
 * Builds client-ready agency proposals with pricing tiers, timelines, and deliverables.
 */
export class ProposalGenerator {
  static generate(options: ProposalOptions, auditScore: number): ProposalResult {
    const { clientName, clientWebsite, targetBudgetCents } = options

    const scope: ProposalScopeItem[] = [
      {
        feature: 'Core Web Vitals & PageSpeed Acceleration',
        description: 'Eliminate render-blocking CSS/JS, optimize images to WebP/AVIF, enable HTTP/3 and asset caching.',
        timelineDays: 7,
        priceCents: 150000, // $1,500
      },
      {
        feature: 'WCAG AA Accessibility Remediation',
        description: 'Fix contrast ratios, aria-labels, screen reader navigation, and keyboard focus states.',
        timelineDays: 5,
        priceCents: 120000, // $1,200
      },
      {
        feature: 'Technical & On-Page SEO Overhaul',
        description: 'Correct title tags, meta descriptions, heading hierarchy, canonicals, robots.txt, and sitemap.xml.',
        timelineDays: 5,
        priceCents: 130000, // $1,300
      },
      {
        feature: 'Security Hardening & SSL Audit',
        description: 'Implement CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy headers.',
        timelineDays: 3,
        priceCents: 90000, // $900
      },
    ]

    const calculatedTotal = scope.reduce((sum, item) => sum + item.priceCents, 0)
    const totalPriceCents = targetBudgetCents || calculatedTotal

    const formattedPrice = (totalPriceCents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })

    return {
      title: `Website Optimization & Growth Proposal for ${clientName}`,
      overview: `Based on AuditAI's technical analysis of ${clientWebsite} (Health Score: ${auditScore}/100), this proposal outlines the complete engineering roadmap to resolve performance bottlenecks, achieve WCAG AA compliance, and boost organic search rankings.`,
      scope,
      totalPriceCents,
      estimatedTimeline: '2-3 Weeks',
      projectedRoi: `Estimated +18-35% conversion rate improvement within 60 days of deployment.`,
      paymentTerms: '50% deposit upon kickoff, 50% upon client signoff and deployment.',
      validityDays: 30,
    }
  }
}
