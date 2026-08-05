---
title: "Worker Architecture"
---

Purpose: Define worker responsibilities, containerization, scaling, health checks, and resource limits.

Design:
- Workers run in isolated containers with CPU/memory limits, connect to Redis and DB.
- Use job concurrency controls and graceful shutdown handlers.

Failure handling: implement job retries, DLQ and idempotency to avoid duplicate side-effects.
