---
title: "Logging"
---

Purpose: Structured logging guidelines, correlation IDs, PII redaction, and log retention.

Recommendations:
- Use JSON structured logs, include `trace_id` and `user_id` (hashed), redact PII.
- Centralize logs to a hosted provider with retention policy.
