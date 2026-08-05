---
title: "AuditAI — Folder Tree (Monorepo)"
version: 0.1
---

This document lists the proposed monorepo directory tree for AuditAI. It is an architectural artifact only — no implementation code is included here.

Root
/
├─ apps/
│  ├─ web/                      # Next.js frontend (Next 15 + React 19)
│  │  ├─ public/
│  │  ├─ src/
│  │  │  ├─ pages/
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ _app.tsx
│  │  │  │  └─ api/ (frontend-only API proxies)
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ styles/
│  │  │  └─ design/ (tokens + generated CSS)
│  │  ├─ next.config.js
│  │  └─ package.json
│  └─ api/                      # Next.js API (server) and light backend
│     ├─ src/
│     │  ├─ pages/api/
│     │  │  ├─ audits/
│     │  │  │  ├─ index.ts
│     │  │  │  └─ [id].ts
│     │  │  ├─ leads/
│     │  │  │  └─ index.ts
│     │  │  └─ auth/
│     │  ├─ services/
│     │  └─ workers/ (queue consumers that may run separately)
│     ├─ Dockerfile
│     └─ package.json

├─ packages/
│  ├─ ui/                       # Shared UI primitives (shadcn + custom components)
│  │  ├─ src/components/
│  │  ├─ src/tokens/
│  │  └─ package.json
│  ├─ ai/                       # Prompt engine, router, adapters, validator, formatter
│  │  ├─ src/
│  │  │  ├─ promptEngine.ts
│  │  │  ├─ aiRouter.ts
│  │  │  ├─ adapters/
│  │  │  ├─ validator/
│  │  │  └─ memory/
│  │  └─ package.json
│  ├─ db/                       # Migrations, seeds, schema files
│  │  ├─ migrations/
│  │  ├─ schema.sql
│  │  └─ package.json
│  ├─ workers/                  # Shared worker utilities (queue, utils)
│  │  └─ package.json
│  └─ shared/                   # Shared types, utils, hooks across apps
│     ├─ src/types/
│     ├─ src/utils/
│     └─ package.json

├─ modules/                     # High-level modules (runnable service code for API/workers)
│  ├─ audit/                     # Audit orchestration modules
│  │  ├─ pagespeedRunner.ts
│  │  ├─ lighthouseRunner.ts
│  │  └─ accessibilityRunner.ts
│  ├─ lead-ingest/               # CSV importer, Places API connector
│  └─ ai-modules/                # Business analysis, proposal generator

├─ docs/
│  ├─ Architecture-Spec-v2.md
│  ├─ folder-tree.md
│  ├─ 01-Constitution.md
│  ├─ 02-Architecture.md
│  └─ (all other docs...)

├─ database/
│  ├─ migrations/
│  │  ├─ 0001_init.sql
│  │  └─ 0002_volume3_tables.sql
│  └─ schema.sql

├─ tools/                       # Developer tools and CLIs
│  ├─ runPrompt.ts
│  └─ importCsvLeads.ts

├─ .github/
│  └─ workflows/
│     └─ ci.yml

├─ .vscode/
├─ .husky/
├─ package.json                  # workspace root (scripts for monorepo tasks)
├─ tsconfig.json
└─ README.md

Notes & Conventions
- Each `apps/*` project is a deployable unit (Vercel/app platform) with its own package.json.
- `packages/*` are workspace packages consumable via local package references.
- `modules/*` contain domain runners that may be executed inside `apps/api` workers or separate worker processes.
- All TypeScript types live in `packages/shared/src/types` and are published as a workspace package.
- Design tokens are the single source of truth: `apps/web/src/design` should be generated from `packages/ui/src/tokens`.
- CI pipeline runs tests for `packages/*` and `apps/*` plus lints and builds before deploy.

Next deliverable (upon approval)
- Expand this tree into `docs/api-spec.md` listing every REST/HTTP RPC endpoint, request/response schema (Zod), and auth guards.
