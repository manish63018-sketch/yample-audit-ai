---
title: "AuditAI Architecture Specification v2.0 (Outline)"
version: 0.1
---

# AuditAI — Architecture Specification v2.0 (Outline)

Purpose
- Produce a frozen, enterprise-grade architecture before implementation.
- This document is the top-level specification: folder trees, APIs, DB schemas, UI screens, AI agents, workflows, permission matrices, and deployment steps.

Scope
- Deliver a complete architecture package suitable for handoff to engineering: design, infra, security, release.
- Target deliverable: phased set of documents (iterative). Final goal: full spec suitable to generate production-ready modules.

Deliverables (phased)
1. Project Overview & Goals
2. Folder Tree & Package Layout (monorepo recommendation)
3. Full Module List (Founder+CTO order)
4. Design System tokens and component inventory
5. API surface: all endpoints (request/response + validation schemas)
6. Database schemas + ER diagrams + migrations
7. UI screens list + route map + wireframes (textual)
8. AI Agents definitions & per-agent prompt templates
9. Workflows and sequence diagrams (audit, lead ingestion, sales funnel)
10. Permissions & RLS matrix
11. CI/CD, infra, deployment runbooks
12. Testing matrix: unit/e2e/security/accessibility/perf

Module Order (Founder + CTO mindset)
1 Foundation (repo, README, infra overview, CI basics)
2 Design System (tokens, components, icons, theme)
3 Landing & Marketing (static pages, SEO, analytics)
4 Authentication & Org model (Supabase auth & RLS)
5 Dashboard Shell & Layout (responsive, accessible)
6 Audit Engine Core (audits table, enqueue, basic runner)
7 AI Engine Core (prompt engine, router, validator)
8 Pagespeed + Screenshot Runners
9 Lighthouse + Accessibility (axe) runners
10 Lead Intelligence & CRM (ingestion, scoring, pipeline)
11 Proposal Generator & Sales Automation
12 Billing & Invoicing
13 Projects & Delivery Manager
14 Integrations & Webhooks
15 Observability & Security Hardening

Design System (Module 2) — Minimum Scope
- Design tokens: colors, typography, spacing, radii, z-index, motion
- Component inventory: Button, Input, Select, Modal, Drawer, Tooltip, Card, Table, Badge, Avatar, Toast, Spinner, Skeleton
- Layout primitives: Grid, Stack, Container
- Data visualizations: Chart primitives + design tokens for charts
- Accessibility: keyboard/ARIA rules for each component
- Theming API (light/dark + brand overrides)
- Icon system and icon build pipeline

AI Agents (core list & intent)
- CEO Agent — high-level investment & strategy recommendations
- Business Consultant — revenue/opportunity analysis
- Website Auditor — orchestrates audit modules
- SEO Expert — on-page & structured data recommendations
- Accessibility Expert — AXE-driven fixes
- Security Expert — OWASP & headers
- Performance Engineer — code-level perf suggestions
- Sales Consultant — client pitch & pricing
- Proposal Writer — generates proposal PDFs/Markdown
- Email Writer — cold and follow-up sequences
- CRM Manager — lead scoring & prioritization
- Project Manager — milestones & timelines
- Code Reviewer — linting, security, architecture checks
- Architect — enforces system constraints
- DevOps Engineer — deployment/runbook generation

Architecture Delivery Rules (must follow exactly)
- All API endpoints must include request validation (Zod/OpenAPI) and standardized error shapes.
- All data models must include created_at, updated_at, created_by (nullable), organization_id for multi-tenancy.
- Use repository/service pattern; avoid business logic in controllers/routes.
- Use strict TypeScript types for every exported surface.
- Use feature flags for large or experimental features.

Prompt to send to Claude (System Prompt)
```
You are the Lead Software Architect, CTO, Principal Full Stack Engineer, Senior UI/UX Designer, DevOps Engineer, AI Engineer, Security Engineer and Product Designer for AuditAI by Yample Labs.

You are NOT an AI assistant.

You are a permanent senior engineer working at Yample Labs.

Your responsibility is to build AuditAI into an enterprise-grade SaaS platform.

You MUST follow the documentation inside the /docs folder as the single source of truth.

Never ignore the documentation.

Never redesign features unless documentation explicitly says so.

Never invent architecture.

Never skip files.

Never create placeholder code.

Never use TODO comments.

Never simplify architecture.

Always think like a senior engineer building a billion-dollar SaaS product.

Rules

• Follow Clean Architecture.
• Follow SOLID principles.
• Use reusable components.
• Use strict TypeScript.
• Never duplicate code.
• Every feature must be production-ready.
• Every API must include validation.
• Every database query must be optimized.
• Every page must be responsive.
• Every component must be accessible.
• Every function must include proper error handling.
• Never hardcode secrets.
• Never expose API keys.
• Always use environment variables.
• Always document your code.

Workflow

Before writing code:

1. Read the relevant documentation from /docs.
2. Explain your implementation plan.
3. List files you will create.
4. Wait for confirmation if architecture changes are required.
5. Then generate production-ready code.

Never generate 100 files in one response.

Build only one module at a time.

Every module must compile successfully before moving to the next module.

You are expected to write code that could immediately be pushed into production.

Quality is more important than speed.
```

Architecture Request Prompt (before writing ANY code)
```
Before writing ANY code,

Create the complete directory tree.

Create every folder.

Create every route.

Create every package.

Create every shared component.

Create every design token.

Create every TypeScript interface.

Create every database schema.

Create every environment variable.

Create every API endpoint.

Create every service.

Create every hook.

Create every provider.

Create every middleware.

Create every utility.

Return ONLY the architecture.

Do NOT write business logic.

Do NOT implement features.

Do NOT write placeholder code.

I want to review the architecture before implementation begins.
```

How we'll proceed (proposal)
1. Produce a fully detailed folder tree (files and paths) for the monorepo. — deliverable: `docs/folder-tree.md`
2. Produce all API endpoints & validation schemas — deliverable: `docs/api-spec.md`
3. Produce DB schema + ER diagrams and migrations — deliverable: `database/schema-full.sql` and diagrams
4. Produce UI route map and screen specs — deliverable: `docs/ui-screens.md`
5. Produce AI Agents spec with prompts — deliverable: `docs/ai-agents.md`

Next action (I will perform now if you confirm)
- Create `docs/folder-tree.md` with the full monorepo tree (no code), then wait for your approval.
