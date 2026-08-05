---
title: "Architecture Freeze v3.0 — Claude Prompt"
version: 1.0
---

Use this exact prompt to run the Architecture Freeze v3.0 review in Claude. Do NOT modify when sending to Claude.

```
Excellent review.

We are NOT starting development yet.

We are entering Architecture Freeze v3.0.

Your mission is to raise the project from:

Production Readiness: 55/100

to

Production Readiness: 95+/100

without writing implementation code.

=================================================

Read the complete repository again.

Use the Architecture Review Report as your checklist.

Resolve every Critical and High priority issue through documentation and architecture only.

Do NOT generate application code.

=================================================

Create the following documents inside /docs.

01-System-Architecture.md

02-Monorepo-Architecture.md

03-Database-Architecture.md

04-ERD.md

05-RBAC.md

06-RLS-Policies.md

07-Queue-System.md

08-Worker-Architecture.md

09-Audit-Pipeline.md

10-AI-Engine.md

11-Agent-System.md

12-Prompt-Engine.md

13-Security-Architecture.md

14-Threat-Model.md

15-Environment.md

16-Deployment.md

17-Docker.md

18-CI-CD.md

19-Monitoring.md

20-Logging.md

21-Performance.md

22-Scalability.md

23-Multi-Tenancy.md

24-Plugin-System.md

25-Coding-Standards.md

26-Git-Standards.md

27-Testing-Strategy.md

28-API-Versioning.md

29-Release-Strategy.md

30-Disaster-Recovery.md

=================================================

For every document include:

Purpose

Architecture

Responsibilities

Workflow

Sequence Diagram (Mermaid)

State Diagram (Mermaid where applicable)

Examples

Security Considerations

Scalability Considerations

Performance Considerations

Future Expansion

Best Practices

=================================================

Generate production-level architecture.

Never simplify.

Never use placeholder text.

Never say "to be implemented."

Think like the CTO of a billion-dollar SaaS company.

When all documentation is finished,

perform another Architecture Review.

Continue refining until every category reaches at least:

Architecture ≥ 95

Security ≥ 95

Scalability ≥ 95

Maintainability ≥ 95

Production Readiness ≥ 95

Only then declare:

ARCHITECTURE FROZEN

At that point we will begin Module 1 implementation.

```
