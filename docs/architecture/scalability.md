---
title: "Scalability"
---

Purpose: Define strategies to scale compute, storage, and data for millions of audits.

Architecture:
- Worker horizontal scaling via queues.
- DB: partition large reports (time-based), read replicas, and archival cold storage.

Recommendations:
- Use Redis for ephemeral state; use S3 for large artifacts; shard or partition reports by tenant.

Performance considerations: preload caches, CDN for static assets, and caching of PageSpeed results.
