# 03 — Database Architecture (Volume 3)

Purpose: Define the database schema, multi-tenant strategy, and Supabase integration for AuditAI.

## Principles
- Tenant isolation via RLS (row-level security)
- UUID primary keys
- Write migrations and seed data using Supabase CLI
- Index fields used in joins and filters

## Core Entities
- `users` — authentication + profile
- `organizations` — tenant metadata
- `teams` — optional team mapping
- `websites` — tracked domains
- `audits` — audit runs
- `reports` — consolidated report metadata
- `pagespeed_reports`, `lighthouse_reports`, `accessibility_reports`, `seo_reports`, `ai_reports`
- `competitors`, `invoices`, `proposals`, `crm`, `leads`, `subscriptions`, `payments`, `notifications`, `activity_logs`

## Multi-tenant
- Each table includes `organization_id UUID` where applicable.
- Use Supabase RLS policies (e.g., `request.jwt.claims.org_id`) to enforce isolation.

## Migrations
- Use `supabase migration new` and `supabase db push` during CI.

## Backups & Retention
- Daily DB backups via Supabase; long-term retention for invoices and audit logs.

## Next steps
- Add `database/schema.sql` for core tables and `docs/03-Auth-RBAC.md` for auth policies.
