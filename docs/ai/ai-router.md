---
title: "AI Router"
---

Purpose: Describe routing logic to choose AI providers, failover rules, and cost controls.

Architecture:
- Router evaluates `route` config, model capability, latency, cost, and provider health.

Rules:
- Prefer provider with lowest cost meeting capability; fallback to secondary provider on errors.

Security: redact PII and log prompt hashes, not raw content.
