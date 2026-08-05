---
title: "AuditAI — API Specification (Expanded, Zod Schemas)"
version: 0.1
---

This file expands `docs/api-spec.md` into full Zod schemas (TypeScript) for core endpoints. Use these schemas as the canonical request/response validation for the API.

Note: Import `z` from `zod` in implementation. These snippets are intended to be copy/paste-ready.

Common types
```ts
import { z } from 'zod'

export const IdSchema = z.string().uuid()
export const ISODateString = z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: 'Invalid ISO date' })

export const ErrorShape = z.object({
  success: z.literal(false),
  error: z.object({ code: z.string(), message: z.string(), details: z.any().optional() })
})

export const SuccessEnvelope = <T extends z.ZodTypeAny>(schema: T) => z.object({ success: z.literal(true), data: schema })
```

1) POST /api/audits (create + enqueue)
```ts
export const CreateAuditBody = z.object({
  website_id: IdSchema.optional(),
  organization_id: IdSchema.optional(),
  url: z.string().url(),
  requested_by: IdSchema.optional(),
  run_options: z.object({ pagespeed: z.boolean().optional(), lighthouse: z.boolean().optional(), accessibility: z.boolean().optional() }).optional()
})

export const AuditSummary = z.object({
  id: IdSchema,
  website_id: IdSchema.optional(),
  organization_id: IdSchema.optional(),
  url: z.string().url(),
  status: z.enum(['queued','running','completed','failed']),
  score: z.number().nullable().optional(),
  created_at: ISODateString,
  finished_at: ISODateString.optional()
})

export const CreateAuditResponse = SuccessEnvelope(AuditSummary)
```

2) GET /api/audits/:id (full report)
```ts
export const PagespeedReport = z.object({ payload: z.any(), metrics: z.record(z.number()).optional(), created_at: ISODateString })
export const LighthouseReport = z.object({ payload: z.any(), opportunities: z.any().optional(), diagnostics: z.any().optional(), created_at: ISODateString })
export const AccessibilityReport = z.object({ issues: z.any(), passed_count: z.number().optional(), created_at: ISODateString })
export const SEOReport = z.object({ meta: z.any().optional(), headings: z.any().optional(), created_at: ISODateString })
export const AIReport = z.object({ summary: z.string().optional(), recommendations: z.any().optional(), created_at: ISODateString })

export const FullAuditResponse = SuccessEnvelope(z.object({
  audit: AuditSummary,
  reports: z.object({ pagespeed: PagespeedReport.optional(), lighthouse: LighthouseReport.optional(), accessibility: AccessibilityReport.optional(), seo: SEOReport.optional(), ai: AIReport.optional() })
}))
```

3) GET /api/audits?org=&limit=&offset=
```ts
export const ListAuditsQuery = z.object({ org: IdSchema.optional(), limit: z.number().int().min(1).max(100).optional(), offset: z.number().int().min(0).optional() })

export const PaginatedAudits = SuccessEnvelope(z.object({ data: z.array(AuditSummary), total: z.number().int() }))
```

4) POST /api/leads
```ts
export const CreateLeadBody = z.object({
  source: z.enum(['manual','csv','places','api']).default('manual'),
  website: z.string().url().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  organization_id: IdSchema.optional()
})

export const LeadSummary = z.object({ id: IdSchema, website: z.string().url().optional(), name: z.string().optional(), email: z.string().optional(), phone: z.string().optional(), status: z.string(), score: z.number().optional(), created_at: ISODateString })

export const CreateLeadResponse = SuccessEnvelope(LeadSummary)
```

5) GET /api/leads/:id
```ts
export const LeadDetail = z.object({
  lead: LeadSummary,
  audit: AuditSummary.optional(),
  timeline: z.array(z.object({ event: z.string(), meta: z.any().optional(), created_at: ISODateString }))
})

export const GetLeadResponse = SuccessEnvelope(LeadDetail)
```

6) POST /api/ai/analyze
```ts
export const AiAnalyzeBody = z.object({ audit_id: IdSchema, prompt_name: z.string(), data: z.any(), route: z.string().optional() })
export const AiAnalyzeResponse = SuccessEnvelope(z.object({ analysis_id: IdSchema, status: z.enum(['queued','completed']), result: z.any().optional() }))
```

7) POST /api/proposals
```ts
export const CreateProposalBody = z.object({ lead_id: IdSchema, title: z.string().optional(), items: z.array(z.object({ description: z.string(), price_cents: z.number().int() })), currency: z.string().default('USD'), notes: z.string().optional() })
export const ProposalSummary = z.object({ id: IdSchema, lead_id: IdSchema, price_cents: z.number().int(), status: z.string(), created_at: ISODateString })
export const CreateProposalResponse = SuccessEnvelope(ProposalSummary)
```

8) Internal worker endpoints (require service token header `x-service-token`)
```ts
export const PagespeedWorkerSchema = z.object({ audit_id: IdSchema, pagespeed_payload: z.any(), metrics: z.record(z.number()).optional() })
export const WorkerGenericResponse = z.object({ success: z.literal(true) })
```

Auth & Middleware
- Protect public APIs with Supabase JWT middleware or next-auth backed by Supabase.
- Internal worker endpoints must verify an `x-service-token` and check origin IP / rate-limit.
- Enforce RLS using `organization_id` where appropriate.

Implementation notes
- Use the same Zod schemas for both runtime validation and TypeScript types (via `z.infer<typeof Schema>`).
- All handlers should return either `SuccessEnvelope(schema)` or `ErrorShape`.
- Use paginated responses and include `total` for lists.

Next steps
- If this expansion looks correct I will produce ready-to-copy TypeScript files under `packages/api-schemas/src/` exporting these Zod schemas for immediate use.
