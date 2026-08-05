# AUDITAI BY YAMPLE LABS — CONSTITUTION

**Master Blueprint v1.0**

- **Version:** 1.0.0
- **Product Name:** AuditAI
- **Company:** Yample Labs
- **Product Category:** AI Powered Website Intelligence Platform

---

## 1. Vision

AuditAI is an enterprise-grade AI Website Intelligence Platform designed to help businesses, software agencies, freelancers, developers, and marketing teams identify technical issues, business opportunities, conversion problems, SEO weaknesses, accessibility issues, performance bottlenecks, and revenue growth opportunities from any public website.

AuditAI is not just a Lighthouse wrapper. It combines technical analysis, business intelligence, AI reasoning, and agency workflows into one unified platform.

---

## 2. Mission

Help businesses grow by transforming complex technical website audits into clear business recommendations.

Instead of telling users "LCP is 5.2s", AuditAI explains: "Your homepage loads slower than recommended, increasing the chance that potential customers leave before placing an order."

---

## 3. Product Goals

### Primary Goal
Become the world's smartest AI Website Auditor.

### Secondary Goals
- Generate professional PDF reports.
- Generate business reports and AI recommendations.
- Generate proposals, quotations, cold emails.
- Generate competitor reports and revenue opportunity reports.

---

## 4. Target Users

### Agencies
- Needs: Professional reports, lead generation, client proposals

### Freelancers
- Needs: Fast audits, professional PDFs, sales material

### Businesses
- Needs: Website health, business insights, performance, SEO

### Developers
- Needs: Technical issues, performance optimization, accessibility, security

### Marketing Teams
- Needs: SEO, conversion, UX, competitor insights

---

## 5. Business Model

**Free Plan**
- 3 audits/day
- Basic Lighthouse metrics: Performance, SEO, Accessibility
- PDF exports with watermark

**Pro Plan**
- Unlimited audits
- AI Reports and Revenue Analysis
- Competitor Analysis, PDF Export, White Label
- Team Collaboration and API Access

**Agency Plan**
- Unlimited everything
- CRM, Proposal Generator, Lead Management
- Client Dashboard, Priority Support

---

## 6. Core Features

### Website Intelligence
- Website Audit → Performance → Accessibility → SEO → Security → Business Analysis → Revenue Analysis → Recommendations

### AI Intelligence
- Model support: Claude, Gemini, OpenAI, Local Models (Ollama)
- Generated outputs: Executive Summary, Business Report, Technical Report, Developer Report, Client Report

---

## 7. Brand Identity

- **Name:** AuditAI
- **Tagline:** AI-Powered Website Intelligence Platform
- **Tone:** Professional, Modern, Premium, Enterprise, Minimal, Fast, Reliable

---

## 8. Design Philosophy

Inspired by Apple, Stripe, Linear, Vercel, Notion, GitHub, OpenAI.

Rules:
- Minimal UI, no unnecessary animations
- Glassmorphism only where useful
- Excellent spacing and readable typography
- WCAG AA compliant
- Fast loading and Dark Mode first

---

## 9. Technology Stack

**Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion

**Backend**: Next.js API, Supabase, PostgreSQL, Redis (optional)

**AI**: Claude, Gemini, OpenAI, Ollama (optional)

**Analysis**: Google PageSpeed API, Lighthouse, Security Headers, Wappalyzer, Axe

**Storage**: Supabase Storage

**Deployment**: Vercel, Cloudflare

---

## 10. Folder Architecture

```
audit-ai/

├── apps/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── lib/
├── api/
├── database/
├── scripts/
├── types/
├── utils/
├── styles/
├── docs/
├── public/
├── tests/
└── middleware.ts
```

---

## 11. Engineering Rules

Claude must NEVER:
- Generate placeholder code
- Use dummy APIs
- Skip error handling
- Ignore TypeScript errors
- Create duplicated components
- Use inline styles unnecessarily
- Create unoptimized code

Claude MUST:
- Build production-ready code
- Use reusable components
- Follow SOLID principles and Clean Architecture
- Use strict TypeScript
- Write scalable, performant, accessible, and SEO-optimized code
- Document functions and flows

---

## 12. Final Objective

AuditAI should feel like a premium SaaS product.

A user should be able to enter any website URL and receive within minutes:
- Technical Website Audit
- Business Analysis
- AI Recommendations
- Competitor Comparison
- Revenue Opportunity Report
- PDF Export and Executive Summary
- Client Proposal and Action Plan

---

## Next: Volume 2 (UI/UX Blueprint)

This Constitution is Volume 1 of the Master Blueprint. Volume 2 will include pixel-level UI/UX blueprints: Landing, Dashboard, Audit Flow, Reports, Admin Panel, Client Portal, Pricing, Settings, responsive layouts, components, design tokens, and animation specifications.
