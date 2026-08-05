# 03 — API Design (Overview)

Purpose: Outline API surface for AuditAI backend (Next.js API routes / server functions).

## Principles
- Small, composable endpoints
- Use JWT for auth, validate roles on server
- Keep heavy work in background workers; APIs return job ids for audit runs

## Endpoints

Auth
- `POST /api/auth/signup` — sign up (delegated to Supabase)
- `POST /api/auth/login` — login (delegated to Supabase)

Audits
- `POST /api/audits` — enqueue an audit for a website; body: `{ websiteId, options }` → returns `{ auditId }`
- `GET /api/audits/:id` — get audit status and summary
- `GET /api/audits?websiteId=` — list audits for website

Reports
- `GET /api/reports/:id` — download report (JSON) or metadata
- `POST /api/reports/:id/pdf` — generate PDF (async)

Websites
- `GET /api/websites` — list
- `POST /api/websites` — add a website

Admin
- `GET /api/admin/metrics` — site-wide metrics (admin only)

Workers & Webhooks
- Use a job queue (Bull/Redis or Supabase Tasks) for audit workers.
- Workers call back via `POST /api/webhooks/audit-complete` with signed payload.

Error Handling
- Use structured error responses: `{ error: { code, message, details? } }`

Rate Limiting
- Implement per-org rate limits on endpoints that trigger audits

Versioning
- Use header `Accept: application/vnd.auditai.v1+json` or route prefix `/api/v1/`
