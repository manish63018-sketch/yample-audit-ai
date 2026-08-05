---
title: "AuditAI — API Specification (Surface & Validation Schemas)"
version: 0.1
---

This document lists the planned HTTP API surface for AuditAI with request/response shapes and recommended Zod validation schemas. All endpoints should implement these schemas server-side and return standardized error shapes.

Standard error response
```
{ success: false, error: { code: string, message: string, details?: any } }
```

1) POST /api/audits
- Description: Create a new audit and enqueue processing.
- Request:
```ts
const body = z.object({
  website_id: z.string().uuid().optional(),
  organization_id: z.string().uuid().optional(),
  url: z.string().url(),
  requested_by: z.string().uuid().optional(),
  run_options: z.object({ pagespeed: z.boolean().optional(), lighthouse: z.boolean().optional() }).optional()
})
```
- Response:
```ts
{ success: true, audit: { id: string, status: 'queued'|'running'|'completed'|'failed', created_at: string } }
```

2) GET /api/audits/:id
- Description: Fetch full audit aggregated report.
- Response:
```ts
{ success: true, audit: { id: string, website_id?: string, organization_id?: string, status: string, score?: number, reports: { pagespeed?: object, lighthouse?: object, accessibility?: object, seo?: object, ai?: object }, created_at: string, finished_at?: string } }
```

3) GET /api/audits?org={orgId}
- Description: List audits for an organization with paging.
- Query params: `org` (uuid), `limit`, `offset`.
- Response: paginated list of audits (id, url, status, score, created_at)

4) POST /api/leads
- Description: Ingest a lead (manual/API/CSV worker will also call service code).
- Request:
```ts
const body = z.object({
  source: z.enum(['manual','csv','places','api']).default('manual'),
  website: z.string().url().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  organization_id: z.string().uuid().optional()
})
```
- Response:
```ts
{ success: true, lead: { id: string, website?: string, status: string, score?: number, created_at: string } }
```

5) GET /api/leads/:id
- Description: Get lead details, linked audit, activity timeline.

6) POST /api/auth/login (or handled by Supabase)
- Description: Authentication endpoints are provided by Supabase; expose token verification and server-side session helpers.

7) GET /api/websites/:id
- Description: Website record and metadata.

8) POST /api/reports/:auditId (internal)
- Description: Workers POST raw reports to these endpoints (or use repository service). Validate payload with JSON schema per report type.

9) POST /api/ai/analyze
- Description: Run AI analysis on provided data (used by pipeline manager).
- Request:
```ts
const body = z.object({ audit_id: z.string().uuid(), prompt_name: z.string(), data: z.any(), route: z.string().optional() })
```
- Response:
```ts
{ success: true, analysis_id: string, status: 'completed'|'queued', result?: any }
```

10) POST /api/proposals
- Description: Create a proposal draft (AI generated or manual). Request includes `lead_id`, `items`, `price_cents`.

11) GET /api/organizations/:id
- Description: Organization settings, billing, limits.

12) Admin endpoints (require admin scope)
- Examples: `GET /api/admin/usage`, `POST /api/admin/seed-data`, `POST /api/admin/run-migrations`

Validation & Auth Notes
- Use Zod for request parsing and responses where possible. Always validate body, query, and path params.
- Protect endpoints with Supabase JWT/auth; enforce RLS for DB queries.
- All internal worker endpoints should require an internal service token (header) and be rate-limited.

Pagination & Filtering
- Standardize on `limit` (default 20) and `offset` pagination for list endpoints; include `total` in responses.

Observability
- All API endpoints must emit events to logs with correlation IDs; include `x-request-id` support.

Next step
- I will expand each endpoint into full Zod schemas and example payloads in `docs/api-spec.md` (detailed) or create `docs/api-spec-expanded.md`. Confirm which you prefer.
