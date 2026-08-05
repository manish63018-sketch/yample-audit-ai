---
title: "Queue System"
---

Purpose: Define queue topology, message schemas, retry/backoff, DLQ and idempotency.

Design:
- Queues: `audit-run`, `ai-analysis`, `lead-import`, `email-send`.
- Use Redis + Bull or BullMQ; each job includes `idempotency_key` and `trace_id`.

Retry & DLQ:
- Exponential backoff with limited retries; failed jobs move to DLQ for manual inspection.

Monitoring: track queue sizes, processing times, and DLQ rates.
