---
title: "Claude — Architecture Freeze Review Prompt"
version: 1.0
---

Use this exact prompt when invoking Claude for the automated Architecture Freeze review. Do NOT modify unless you intend to change the review scope.

----- PROMPT START -----
We are officially starting AuditAI by Yample Labs.

This is NOT a demo project.

This is NOT a portfolio project.

This is a real enterprise SaaS that will be deployed to production.

Read the entire /docs directory.

Treat every document as the official specification.

Your role is Principal Software Architect.

Before writing code:

1. Verify the documentation.
2. Detect missing architecture.
3. Detect missing database entities.
4. Detect missing APIs.
5. Detect missing UI screens.
6. Detect missing security requirements.
7. Detect missing AI workflows.
8. Detect missing business workflows.

Then produce an Architecture Review Report.

Do NOT generate code.

When the architecture reaches production quality, create a Master Development Plan with milestones, dependencies, Git commit strategy, testing strategy, deployment strategy, and release roadmap.

Only after I approve the architecture may implementation begin.

Scope: Audit the repository root and the `/docs` directory; focus on the following areas (provide for each: Current Status, Missing Items, Risks, Suggested Improvements, Priority):
- Folder Structure
- Monorepo Architecture
- Design System
- UI Architecture
- Component Architecture
- Backend Architecture
- API Design
- Database Schema
- RBAC
- Authentication
- Security
- AI Engine
- Prompt Engine
- Agent System
- Queue System
- Worker Architecture
- Background Jobs
- Audit Pipeline
- Lighthouse Integration
- PageSpeed Integration
- Accessibility Engine
- SEO Engine
- Business Intelligence Engine
- CRM
- Proposal Generator
- PDF Generator
- Billing
- Multi-tenancy
- Environment Variables
- Deployment
- Docker
- CI/CD
- Git Strategy
- Testing Strategy
- Monitoring
- Logging
- Error Handling
- Performance
- Scalability
- Future Extensibility

For every section provide:
- Current Status
- Missing Items
- Risks
- Suggested Improvements
- Priority (Critical / High / Medium / Low)

At the end generate:
• Architecture Score (/100)
• Security Score
• Scalability Score
• Maintainability Score
• SaaS Readiness Score
• Production Readiness Score

Finally produce:
Architecture Freeze Checklist

Nothing should move into development until all Critical issues are resolved.

Do NOT generate any implementation code.

Think like a Principal Software Architect reviewing a company that expects to scale to millions of audits.

----- PROMPT END -----

Follow-up: When you (Claude) determine the architecture is ready, reply exactly with the phrase: "Architecture Ready" and wait for further instructions.

If Claude replies with "Architecture Ready", then send the following instruction to Claude (exact):

----- START MODULE 1 PROMPT -----
Start Module 1.

Requirements:

- Production Ready
- Enterprise Quality
- No Placeholder Code
- No TODO
- No Mock Data
- No Demo Code
- Every file must compile.
- Every dependency must be correctly configured.
- Every commit must be atomic.

At the end of Module 1 provide:

1. Folder Tree
2. Files Created
3. Commands to Run
4. Expected Output
5. Verification Checklist
6. Git Commit Message

Stop after Module 1.

----- END MODULE 1 PROMPT -----

Operational note: Run Claude in a fresh session with access to the repo ZIP or the `/docs` directory contents. Ensure the model has the full `/docs` context to inspect.
