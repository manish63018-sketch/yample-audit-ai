---
title: "API"
---

Purpose: Canonical API design, versioning, contract testing, and SDK generation.

Architecture:
- Use Zod schemas as source-of-truth and generate OpenAPI and TypeScript SDKs.

Responsibilities: maintain `docs/api-spec-expanded.md`, implement validation middleware, and enforce response envelopes.

Versioning: use `/v1/` prefix and migrate to `/v2/` when breaking changes are needed.

Security: authentication via Supabase JWT, rate limiting, and API keys for internal workers.
