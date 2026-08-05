---
title: "Disaster Recovery"
---

Purpose: Recovery objectives, backup strategy, RTO/RPO, and runbooks.

Strategy:
- Daily logical backups of Postgres to object storage, continuous WAL shipping for PITR.
- Snapshotting of critical services and periodic DR drills.

Runbook (high level):
1. Detect incident via monitoring/alerts.
2. Failover read replica as primary if needed.
3. Restore from backup for data corruption scenarios.
