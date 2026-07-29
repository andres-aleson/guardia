# Mini-PRD: Analysis & Result Flow (C1–C3)

Scoped sub-feature of [PRD.md](../PRD.md) — covers replacing the B2 stub with a real analysis call, and the three Result screens it routes to. Builds directly on [prd-input-and-checking-flow.md](prd-input-and-checking-flow.md) (B1–B3), which this feature does not change except to swap B2's fake delay for a real API call.

## What it is

The moment the product actually delivers on its promise: the submitted text is sent to an LLM (Gemini 2.5 Flash, free tier), analyzed, and the user lands on one of three calm, plain-language verdict screens — Risky, Looks Safe, or Not Sure — instead of the current placeholder.

## Screens touched

| Screen | Role in this feature |
|---|---|
| **B2 — Checking / Loading Screen** | Modified: now awaits a real API call instead of a fixed stub delay. No visual changes. |
| **B3 — Analysis Failed Screen** | Reused as-is: any failure of the real call (network, timeout, quota, malformed response) routes here exactly like a stubbed failure did. No changes needed. |
| **C1 — Result: Risky/Scam** | New: verdict, explanation, red-flag list, one guided next step, safe-alternative action, "Got it." |
| **C2 — Result: Looks Safe** | New: reassuring verdict, brief plain-language reason, "Got it." |
| **C3 — Result: Not Sure** | New: manual-verification recommendation in place of a verdict, "Got it." |

## User flow

1. User submits on B1 as before; B2 shows the same calm loading state.
2. B2 calls a server-side API route, which calls Gemini 2.5 Flash with the submitted text and a system prompt that (a) treats the text strictly as data to analyze, never as instructions — guarding against prompt injection from attacker-authored input — and (b) requires a structured JSON response: verdict (`safe` / `risky` / `not-sure`), explanation, red flags (if risky), recommended next step.
3. On a valid response: B2 advances to C1, C2, or C3 based on the verdict the model chose. There is no separate confidence-threshold step — the model's own three-way answer is the routing key.
4. On any failure (network error, timeout, quota exceeded, response that fails schema validation): same silent-retry-once-then-B3 behavior already built for B2. No new failure UI.
5. On C1/C2/C3, "Got it" returns the user to a fresh B1 (same reset behavior as B3's "Start over").
6. C1's "I've already clicked/responded" escalation button is visible (per mockup) but — since D1 doesn't exist yet — links to a bare, clearly-labeled placeholder screen, the same pattern already used for B2's success stub before this pass existed.

## What data needs to be saved, and where

**Still nothing persists to SQLite in this feature.** History (E1/E2) is a separate, not-yet-scoped screen set — persisting a verdict with nowhere to display it later would just be dead writes. Revisit when E1/E2 are actually built.

What *does* need to be held, and where:
- **Verdict + explanation + red flags + recommended action** — held in transient, in-memory client state for the duration of viewing the Result screen only. Cleared when the user hits "Got it" or otherwise leaves the flow.
- The submitted input text continues to live in the same transient state already built for B1–B3 (needed if the user retries after a B3 failure).
- Nothing else — no draft data, no client-side logging of the raw API response.

**Server-side:** the request to Gemini is stateless — nothing about the submitted text or the returned verdict is persisted after the response is sent back to the client. The API key lives server-side only (env var), never sent to or readable by the client.

## In scope

- A Next.js API route that calls Gemini 2.5 Flash (`@google/genai`), reading the API key from a server-side env var.
- A system prompt that (a) frames the user's submitted text as data, not instructions, and (b) enforces a structured JSON output (verdict + explanation + red flags + recommended action) via `responseSchema` — not free-text parsing.
- A small set of adversarial test inputs (basic prompt-injection attempts) exercised against the real prompt before calling this done, per OWASP LLM Top 10 #1.
- Wiring B2 to call this route instead of the stub, preserving its existing loading UI, rotating status text, and progress bar exactly as-is.
- Building C1, C2, and C3 to match the main PRD's descriptions, using the existing design-token system (no new visual language).
- Routing logic: model's self-reported verdict maps directly to C1/C2/C3, no external thresholding.
- Reusing B3 for every failure mode of the real call (network, timeout, quota, schema-validation failure) — one generic message regardless of cause, same as today.
- "Got it" on all three Result screens resets to a fresh B1, same pattern as B3's "Start over."
- C1's escalation button as a placeholder link (see flow step 6) rather than a dead/disabled control.

## Explicitly out of scope

- **Persisting check history to SQLite.** No history UI (E1/E2) exists yet to show it; this pass computes and displays a verdict but doesn't save one.
- **D1 (remediation flow) and D2 (trusted contact).** C1's escalation button exists only as a labeled placeholder this pass; the real flow is separate, unscoped work.
- **Rate limiting / abuse prevention on the new endpoint.** Free-tier quota is the only real backstop for now; revisit if usage or cost pressure ever makes this necessary.
- **Input length/character limits.** Not addressed this pass.
- **Differentiated error messaging by failure type.** B3 stays one generic message; the real call's failure modes (quota vs. network vs. bad response) are not surfaced differently to the user.
- **Streaming or partial results.** Single request/response; Gemini 2.5 Flash is fast enough that this isn't needed.
- **Any client-side exposure of the API key.** All calls happen server-side; this is a hard boundary, not a judgment call.
- **Model/provider swap tooling.** Gemini 2.5 Flash is hardcoded as today's choice; making the provider pluggable is not part of this pass.
- **Multi-turn follow-up ("ask why" chat about the verdict).** Each check is a single request/response; no conversational follow-up.

---
*No code has been written. This is a planning document for review.*
