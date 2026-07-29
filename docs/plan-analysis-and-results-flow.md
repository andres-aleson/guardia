# Execution Plan: Analysis & Result Flow (C1–C3)

**Status: Phase 1 (backend) built, verified, and committed. Phase 2 (C1–C3 UI) not started.**

Turns [Mini-PRD: Analysis & Result Flow](./prd-analysis-and-results-flow.md) into buildable steps. Keep this file current as we go — check off items, update the Status line, and fill in the Decisions Log — so the work can be picked back up cold in a later session.

## How to read this file

- `- [ ]` / `- [x]` — check items off as they're finished.
- 🧪 **Test checkpoint** — there's a real interface to look at. Stop and verify before moving on.
- 🤔 **Decision point** — something here affects what comes next. Stop and decide together, then log it below.
- 📦 **Commit checkpoint** — a natural point to commit to git.

## Already in place

(Context for resuming cold — see [PRD.md](../PRD.md) and the mini-PRD for full detail.)

- B1 (Input), B2 (Checking), B3 (Analysis Failed) built, verified, and committed — see [plan-input-and-checking-flow.md](./plan-input-and-checking-flow.md).
- B2 currently runs a fixed-delay stub (`runStubCheck` in `check-form.tsx`), not a real analysis call.
- `.env*` is already gitignored — safe to add `.env.local` with the real API key without risk of committing it.
- Design tokens (colors, type scale, spacing) already in `globals.css` — reuse as-is for C1–C3.
- PRD decisions already locked in (`PRD.md` §3): Gemini 2.5 Flash via free-tier Google AI Studio, stateless server-side handling, model self-reports the verdict (no external confidence threshold).
- No SQLite persistence in this feature either — same as B1–B3, per the mini-PRD.

## Phase 1 — Backend: real analysis endpoint ✅ (built, verified, committed)

- [x] Added the `@google/genai` dependency (approved its and a couple of transitive packages' postinstall scripts, same pattern as `better-sqlite3` earlier).
- [x] Added `GEMINI_API_KEY` to a new `.env.local` (confirmed `.env*` is already gitignored before writing the key to disk).
- [x] Built `src/lib/analyze.ts` (the Gemini call + validation) and `src/app/api/check/route.ts` (the POST endpoint) — accepts `{ text }`, calls Gemini 2.5 Flash, returns structured JSON: `verdict` (`safe` / `risky` / `not-sure`), `explanation`, `redFlags`, `recommendedAction`.
- [x] System prompt explicitly frames submitted text as data, not instructions, and tells the model to treat injection attempts as a red flag in themselves rather than obeying them.
- [x] Structured output enforced via a Gemini `responseSchema` (JSON mode), plus a manual runtime validation pass in `analyze.ts` before the route ever returns a result — belt-and-suspenders in case the model ever drifts from the schema.
- [x] Route validates the request body (400 on missing/empty `text`) and maps any analysis failure (network, malformed response, etc.) to a 502, so B3 has a single clear failure signal to catch once it's wired up in Phase 3.

🧪 **Test checkpoint — done (by me, holding for your review):** started the dev server and called `/api/check` directly with `curl` (no UI exists yet — that's Phase 2/3). Four cases, all as expected:
- An obvious phishing message (fake bank suspension + link + request for a Social Security number) → `risky`, with four accurate, specific red flags.
- A free-text call description (fake IRS agent demanding gift cards, threatening arrest) → `risky` — confirms the call-description path from B1 feeds this correctly too.
- A prompt-injection attempt (a message that tried to impersonate a system override telling the model to always answer "safe," embedded around a gift-card scam) → correctly still came back `risky`, and — notably — "attempts to override instructions" showed up as one of the red flags itself, exactly the defense the system prompt was written for.
- A short, out-of-context friendly text ("still on for lunch tomorrow?") → `not-sure`, with a reasonable explanation (no way to confirm sender identity) — a good sign the model isn't just pattern-matching for scary keywords.
- Also confirmed the 400 validation path (missing `text` field) and a clean `tsc --noEmit` / `next lint` / `next build`, including seeing `/api/check` show up correctly as a dynamic route in the build output.

📦 **Commit checkpoint:** backend route + schema — committed.

## Phase 2 — Build C1, C2, C3 (static UI, mock data)

- [ ] Build C1 (Risky): verdict, explanation, red-flag list, one guided next step, safe-alternative action, "Got it."
- [ ] Build C2 (Safe): reassuring verdict, brief plain-language reason, "Got it."
- [ ] Build C3 (Not Sure): manual-verification recommendation in place of a verdict, "Got it."
- [ ] Build the placeholder screen C1's escalation button links to (D1 doesn't exist yet) — same bare-placeholder pattern already used for B2's original success stub.
- [ ] Make all three screens reachable with local mock data for now (no backend wiring yet) — extend the existing dev-only preview pattern from B1/B2 so each can be pulled up on demand for review.

🧪 **Test checkpoint:** look at all three screens plus the escalation placeholder in the browser — copy tone, layout, "Got it" resetting back to a fresh B1 — before wiring them to anything real.

📦 **Commit checkpoint:** C1–C3 UI, once verified.

## Phase 3 — Wire B2 to the real backend

- [ ] Replace B2's stub call with a real `fetch` to the Phase 1 API route.
- [ ] Route to C1 / C2 / C3 based on the verdict the route returns.
- [ ] Confirm B3 still catches every failure mode of the real call (network error, timeout, quota exceeded, a response that fails schema validation) with no new UI — same generic message as today.

🤔 **Decision point:** now that a real backend exists, do we keep the dev-only "simulate result" toggle from B2 (useful for demoing without burning free-tier quota) or remove it (it's dead scaffolding once real analysis works)? We'll decide this together when we get here.

🧪 **Test checkpoint:** full click-through with real API calls — a safe message, a risky message, an ambiguous one, and a prompt-injection attempt — confirming each routes to the right Result screen. Also force a failure (e.g. a temporarily invalid key) to confirm B3 still catches it correctly.

📦 **Commit checkpoint:** real backend wired end-to-end, once verified.

## Phase 4 — End-to-end pass

- [ ] Full click-through: B1 → B2 (real call) → C1/C2/C3, and the B2 → B3 → retry path, all in one continuous session.
- [ ] Accessibility pass on C1–C3: focus management on arrival (same pattern as B3), screen-reader labels, contrast check — using the same computed WCAG method as the B1–B3 audit, not eyeballing it.
- [ ] Confirm no regressions to B1–B3 or the landing page, and that build/lint/type-check are still clean.

🧪 **Test checkpoint:** walk the entire flow start to finish, both happy and failure paths, in one continuous session.

📦 **Commit checkpoint:** feature complete.

## Decisions log

_(Anything decided during execution that isn't already captured in the mini-PRD.)_

**Phase 1:**
- **Split the Gemini call into `src/lib/analyze.ts`** separate from the route handler (`src/app/api/check/route.ts`), so Phase 3's wiring of B2 to the backend is a plain function import (`analyzeMessage(text)`), not something that has to go through an HTTP round-trip to itself.
- **Added manual runtime validation of the parsed JSON** on top of Gemini's own `responseSchema` enforcement, rather than trusting the schema alone — schema compliance from the model isn't a hard guarantee, especially on a free-tier flash model, and a malformed response should fail loudly into the 502/B3 path rather than silently reach a Result screen with missing fields.
- **Route returns a generic 502 on any analysis failure** (network error, schema-validation failure, etc.) with no differentiation by cause, deliberately mirroring B3's existing "one generic message" decision rather than inventing new granular error states this early.

**Phase 2:**
_(pending)_

**Phase 3:**
_(pending)_

**Phase 4:**
_(pending)_

## Related docs

- [Mini-PRD: Analysis & Result Flow](./prd-analysis-and-results-flow.md)
- [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md)
- [Master PRD](../PRD.md)
