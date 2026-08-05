---
title: "AuditAI — Architecture Review Prompt (Claude)"
version: 1.0
---

Use this concise Architecture Review Prompt when asking Claude to audit the repo and docs.

```
Read the complete repository.

Review:

- docs/
- README
- Architecture documents
- Folder structure
- API specs
- Database design

Perform a CTO-level architecture review.

Do NOT write code.

Find:

- Missing architecture
- Missing APIs
- Missing tables
- Missing workflows
- Security issues
- Scalability issues
- AI workflow gaps
- CRM gaps
- UX gaps
- Deployment gaps

Return a professional Architecture Review Report.

Give every section:

Status

Risk

Recommendation

Priority

Finally provide:

Architecture Score

Security Score

Scalability Score

Maintainability Score

Production Readiness Score

Do not implement anything.
```
