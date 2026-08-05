# 05 — AI Engine (Volume 5)

Version 1.0

## Philosophy
AuditAI is an AI Decision Engine — not a chatbot. Every AI response must help users make better business decisions, distinguish measured data from AI reasoning, and include confidence levels.

## Architecture

AI Layer:

User → Prompt Engine → AI Router → [Claude | Gemini | OpenAI | Local] → Response Validator → Business Formatter → Database → Dashboard

## Multi-AI Strategy
- Use specialized providers for their strengths: Claude for business writing and analysis, Gemini for vision tasks, OpenAI for structured/function outputs and code.
- Local models for offline or private deployments.

## Components

- AI Router (`services/aiRouter.ts`): selects provider by task and enforces routing rules.
- Prompt Engine (`services/promptEngine.ts`): builds prompts from master templates + context + role + rules + output schema.
- Adapter Layer (`adapters/*`): provider-specific call wrappers and rate-limit handling.
- Response Validator (`services/aiValidator.ts`): checks hallucinations, output schema, and confidence.
- Formatter (`services/aiFormatter.ts`): converts raw model output to Markdown, JSON, and React-friendly structures.
- Memory Layer (`services/memoryLayer.ts`): stores org/user preferences, previous audits, tones, and templates.
- Prompt Templates (`services/promptTemplates.json`): canonical templates for audits, proposals, emails, and reports.

## Prompting Rules
- Always include: role, task, measured data, constraints, output schema, and validation instructions.
- Never ask model to invent measurable metrics. Ask to state assumptions and confidence.

## Validation
- Validate outputs for required keys and data types.
- Detect and remove hallucinations by cross-checking against measured data.
- Attach a `confidence` field to every recommendation.

## Output Formats
- Executive summary (one page Markdown)
- Structured JSON (for dashboard and database)
- PDF-ready Markdown (for report generator)

## Memory
- Persist: company profile, industry, previous audits, tone, brand rules, proposal history.
- Use memory to seed prompts and maintain consistent voice across reports.

## Safety & Compliance
- Apply a validator to reject outputs containing unverified numbers, fake quotes, or guarantees.
- Keep audit evidence (screenshots, PageSpeed JSON) alongside AI outputs for traceability.

## Example Flow
- Audit completed → pipeline pushes aggregated measured data → `promptEngine` builds audit prompt → `aiRouter` sends to Claude for business summary and to Gemini Vision for screenshot analysis → `aiValidator` checks fields and attaches confidence → `aiFormatter` creates Markdown + JSON → `reportGenerator` builds PDF and stores `ai_reports`

## Deliverables
- `services/aiRouter.ts`, `services/promptEngine.ts`, `services/aiValidator.ts`, `services/aiFormatter.ts`
- `adapters/openaiAdapter.ts`, `adapters/claudeAdapter.ts`, `adapters/geminiAdapter.ts`
- `services/memoryLayer.ts`, `services/promptTemplates.json`
- Docs and examples for prompt templates
