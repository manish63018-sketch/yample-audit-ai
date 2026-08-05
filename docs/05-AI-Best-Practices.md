# AI Best Practices (AuditAI)

This document captures the operational and safety best practices for AuditAI's AI Engine.

## Prompting
- Always include measured data and clearly mark which values are inferred.
- Provide an explicit output schema and require the model to respond in JSON (when machine-readable output is needed).
- Use role-based instructions (e.g., "You are a Senior Business Consultant...").
- Avoid single-shot prompts for complex analysis; provide context bundles (master prompt + data + rules).

## Safety
- Never ask the model to guarantee outcomes (rankings, revenue, conversions).
- Do not expose private keys or credentials in prompts.
- Validate numeric outputs against measured data; flag large discrepancies.

## Tone & Style
- Use concise, professional, and evidence-based language for business summaries.
- For developer reports, prefer actionable, numbered steps and code snippets.

## Validation
- All AI outputs must pass a schema check and a hallucination heuristic before being stored.
- Include a `confidence` field and an explanation for any estimate.

## Provider Selection
- Route business writing to Claude where available.
- Route vision/screenshot tasks to Gemini Vision.
- Route structured JSON, code, or function outputs to OpenAI (GPT).
- Use local models for offline/private deployments; degrade gracefully when they are unavailable.

## Audit Trail
- Store the prompt, model, raw response, validated JSON, and final formatted output for traceability.

## Rate Limits & Quotas
- Enforce per-organization quotas and provider-specific rate limits in the AI router layer.

## Human-in-the-loop
- For high-impact proposals or estimations, require human review before publication.
