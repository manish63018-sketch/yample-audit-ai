---
title: "Architecture Freeze v3.0 — Instruction for Claude"
version: 1.0
---

Use this exact instruction when running Architecture Freeze v3.0 in Claude. Do not modify the text.

```
Good.

Do NOT simulate anything.

Do NOT assume the architecture is complete.

We are now entering Architecture Freeze v3.0.

Your only responsibility is to improve the documentation until it reaches enterprise production quality.

You are forbidden from writing application code.

Your job is documentation, architecture, diagrams, workflows, specifications, and engineering standards only.

====================================================

Review every document.

Review every API.

Review every database table.

Review every workflow.

Review every folder.

Review every architecture decision.

Review every security decision.

Review every AI workflow.

Review every queue.

Review every background worker.

Review every deployment strategy.

Review every monitoring strategy.

Review every testing strategy.

====================================================

Whenever you find something missing,

DO NOT mention it only.

Immediately create the corresponding documentation file.

====================================================

Generate:

• Mermaid ER Diagrams
• Sequence Diagrams
• Flow Diagrams
• State Diagrams
• Component Diagrams
• Deployment Diagrams

====================================================

Every architecture decision must include:

Purpose

Advantages

Disadvantages

Trade-offs

Future scalability

Security implications

Performance implications

Failure scenarios

Recovery strategy

====================================================

Continue expanding the documentation until there are no Critical architecture gaps remaining.

At the end generate:

Architecture Completion Report

including

Overall Completion %

Architecture Score

Security Score

Scalability Score

Maintainability Score

Production Readiness Score

====================================================

Only when every score is above 95/100 may you output:

ARCHITECTURE FREEZE COMPLETE

Until then,

continue improving the documentation.

Never generate implementation code.
```
