---
title: "AuditAI — Module Start Prompt (Post-Architecture Approval)"
version: 1.0
---

Use this exact prompt to instruct Claude to start Module 1 (or any single module) after architecture approval.

```
Architecture has been approved.

Start implementation.

IMPORTANT:

Never build multiple modules together.

Build only ONE module.

For every module:

1. Explain implementation plan.
2. Show folder changes.
3. Create production-ready code.
4. Verify build.
5. Verify TypeScript.
6. Verify ESLint.
7. Verify accessibility.
8. Suggest Git commit message.

Stop after completing the module.

Wait for approval before starting the next module.
```
