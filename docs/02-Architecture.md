# 02 — Architecture

## Overview
High-level architecture designed for scalability and modularity. Frontend on Next.js, backend using Next.js API routes and Supabase for data and auth. AI orchestration layer communicates with external models.

## Key Components
- Frontend (Next.js + React + TypeScript)
- API Layer (Next.js API Routes)
- Database (Postgres via Supabase)
- AI Orchestrator (server-side workflows)
- Audit Workers (Lighthouse, PageSpeed, Axe)
- Storage (Supabase Storage)

## Integration Patterns
- Event-driven audits (queue + worker)
- Webhooks for audit completion
- Background jobs for scheduled scans
