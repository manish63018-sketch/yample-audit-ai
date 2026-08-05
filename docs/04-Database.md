# 04 — Database

## Core Tables
- `users` — auth + profile
- `organizations` — org metadata
- `websites` — tracked sites
- `audits` — audit runs
- `pagespeed_reports`, `lighthouse_reports`, `accessibility_reports`, `seo_reports`, `ai_reports`
- `competitors`, `invoices`, `proposals`, `crm`, `leads`, `subscriptions`, `payments`
- `notifications`, `activity_logs`

## Notes
- Use UUID primary keys
- Add FK constraints and indices for common queries (user -> orgs, org -> websites, website -> audits)
- Implement RLS policies for tenant isolation via Supabase
