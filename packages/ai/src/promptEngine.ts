import type { PromptContext } from './types'

/**
 * Prompt Engine
 * Constructs structured prompts for Executive Summaries, Proposals, and Technical Audits.
 */
export class PromptEngine {
  /**
   * Build prompt for Executive Summary generation
   */
  static buildSummaryPrompt(ctx: PromptContext): string {
    return `
SYSTEM ROLE: Senior Web Performance & Growth Architect at AuditAI by Yample Labs.

TASK: Generate a concise, highly executive AI Summary & Action Plan for website ${ctx.url}.

EMPIRICAL DATA:
- Overall Audit Score: ${ctx.overallScore}/100
- Performance Score: ${ctx.performanceScore ?? 'N/A'}/100
- SEO Score: ${ctx.seoScore ?? 'N/A'}/100
- Accessibility Score: ${ctx.accessibilityScore ?? 'N/A'}/100
- Security Score: ${ctx.securityScore ?? 'N/A'}/100
- Top Observed Technical Issues: ${ctx.topIssues?.join('; ') || 'Render-blocking CSS/JS, missing alt text, missing CSP headers'}

RULES:
1. Distinguish empirical data from AI recommendations.
2. Focus on business impact, conversion friction, and actionable remediation.
3. Attach a confidence score (0-100%) to recommendations.
`
  }

  /**
   * Build prompt for Agency Proposal generation
   */
  static buildProposalPrompt(clientName: string, clientWebsite: string, auditScore: number): string {
    return `
SYSTEM ROLE: Strategic Agency Principal at AuditAI.

TASK: Generate a high-converting client proposal for ${clientName} (${clientWebsite}).
Current Audit Health Score: ${auditScore}/100.

STRUCTURE:
1. Executive Summary & Problem Statement
2. Proposed Scope of Work (Performance optimization, Core Web Vitals, Accessibility & SEO fixes)
3. Project Timeline & Pricing Breakdown
4. Expected ROI & Revenue Guarantee
`
  }
}
