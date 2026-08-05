# 03 — API Endpoints (Detailed)

This document lists core API endpoints for AuditAI, expected request/response shapes, auth requirements, and notes about background processing.

Base path: `/api/v1/`

Authentication: Bearer JWT issued by Supabase. Use role-based checks on server.

---

Auth

- POST `/api/v1/auth/signup` — delegated to Supabase Auth; server returns session token
- POST `/api/v1/auth/login` — delegated to Supabase Auth

---

Websites

- GET `/api/v1/websites` — list websites for user's organization
  - Query params: `?page=&limit=`
  - Response: `{ data: [{ id, url, name, created_at }], meta: { total } }`

- POST `/api/v1/websites` — add website
  - Body: `{ url, name? }`
  - Response: `{ success: true, website }`

---

Audits

- POST `/api/v1/audits` — enqueue an audit (async)
  - Body: `{ websiteId, options?: { lighthouse: true, pagespeed: true, accessibility: true } }`
  - Response: `{ success: true, auditId }` (worker will process and update status)

- GET `/api/v1/audits/:id` — get audit details and status
  - Response: `{ id, status, score, started_at, finished_at, summary }`

- GET `/api/v1/audits?websiteId=` — list audits for website

---

Reports

- GET `/api/v1/reports/:id` — fetch report metadata and JSON
  - Response: `{ id, auditId, type, payload }`

- POST `/api/v1/reports/:id/pdf` — generate PDF (async)
  - Response: `{ success: true, jobId }` — worker will produce PDF and update report record with `pdf_url`

---

AI

- POST `/api/v1/ai/generate-summary` — request AI summarization for given auditId
  - Body: `{ auditId, model?: 'claude'|'openai'|'gemini', tone?: 'concise'|'detailed' }`
  - Response: `{ jobId }` (async)

- GET `/api/v1/ai/:jobId` — check AI job status and result

---

Pagespeed / Lighthouse (internal)

- POST `/api/v1/pagespeed/run` — internal endpoint used by workers to run PageSpeed; protected
- POST `/api/v1/lighthouse/run` — internal endpoint used by workers; protected

---

CRM

- GET `/api/v1/crm/leads` — list leads
- POST `/api/v1/crm/leads` — create lead
- PATCH `/api/v1/crm/leads/:id` — update lead status/assignment

---

Proposals & Invoices

- POST `/api/v1/proposals` — create proposal (from AI or manual)
- GET `/api/v1/proposals/:id` — fetch proposal
- POST `/api/v1/invoices` — create invoice (integrate with Stripe)

---

Admin

- GET `/api/v1/admin/metrics` — system metrics (admin only)
- POST `/api/v1/admin/seed-demo` — seed demo data for trial orgs

---

Errors

All errors must follow structured format:

```
{ "success": false, "message": "Human readable message", "errorCode": "AUDIT_TIMEOUT", "details": {...} }
```

---

Rate limiting

- Implement per-org quotas for audit enqueue endpoints; return 429 with `{ success: false, message: 'Rate limit exceeded' }`.

---

Background processing

- APIs that trigger heavy work should enqueue jobs and return job ids.
- Workers update DB on completion and notify via websockets or notifications table.
