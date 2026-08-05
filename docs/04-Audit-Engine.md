# 04 — Audit Engine (Volume 4)

Version 1.0

## Core Philosophy
AuditAI is an AI Website Intelligence Engine. Every audit must answer:
- What's wrong?
- Why does it matter?
- Business impact?
- How to fix it?
- Estimated effort?
- Estimated ROI?
- Priority?

## Audit Flow

1. User enters URL
2. Validate URL
3. DNS Lookup
4. SSL Check
5. Website Screenshot
6. Technology Detection
7. PageSpeed API
8. Lighthouse
9. Accessibility Scan
10. SEO Scan
11. Security Scan
12. Performance Scan
13. Business Analysis
14. Competitor Analysis (optional)
15. AI Analysis
16. Revenue Opportunity
17. Generate PDF
18. Save Report

## Modules

This volume defines each module's responsibility, inputs, outputs, and expected storage.

- URL Validation — ensure reachable, HTTPS, robots/sitemap found
- Performance Engine — PageSpeed + Lighthouse metrics and issues
- Accessibility Engine — Axe + Lighthouse accessibility results
- SEO Engine — meta, headings, links, sitemap, robots
- Security Engine — SSL, headers, CSP, mixed content
- Technology Detection — frameworks, CMS, analytics, CDN
- UI Analysis — screenshot + vision analysis
- UX Analysis — journey, forms, checkout flow
- Business Intelligence — industry mapping and missed features
- Revenue Opportunity — conservative revenue uplift estimates
- Competitor Intelligence — nearby/related competitors and comparison
- AI Executive Summary & Proposal — generated outputs
- Priority Engine — assign priority, impact, effort, timeline

## Scoring

Weights:
- Performance 25%
- Accessibility 15%
- SEO 20%
- Security 10%
- UX 10%
- Business 10%
- Mobile 10%

Final report aggregates measured metrics and AI analysis into the report structure.

## AI Rules

- Distinguish measured data vs AI in outputs.
- Never guarantee revenue or rankings.
- Provide confidence and cite sources when possible.

## Implementation Notes

- Run heavy analysis in isolated workers (Docker) for Lighthouse.
- Use queues for orchestration (Bull or Supabase Tasks).
- Persist intermediate artifacts (screenshots, JSON payloads).
- Provide webhooks and notifications on audit completion.

## Deliverables

- Module implementations (stubs) in `modules/`
- Orchestrator in `services/pipelineManager.ts`
- Report generation in `services/reportGenerator.ts`
- Documentation of data shapes and retention
