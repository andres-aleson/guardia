# Execution Plan: Analysis & Result Flow (C1–C3)

**Status: Phase 1-3 built, verified, and committed. Phase 4 (end-to-end pass) not started.**

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

## Phase 2 — Build C1, C2, C3 (static UI, mock data) ✅ (built, verified, committed)

- [x] Built C1 (Risky): verdict, explanation, red-flag list, one guided-next-step card, "Got it," escalation link — see 🤔 note below on the "safe-alternative action" bullet from the mini-PRD.
- [x] Built C2 (Safe): reassuring verdict, brief plain-language reason, "Got it" — deliberately lightweight, no red-flag panel or card treatment.
- [x] Built C3 (Not Sure): manual-verification recommendation in a highlighted card in place of a verdict, "Got it," no red-flag panel or escalation link.
- [x] Built the placeholder screen C1's escalation button links to (`EscalationPlaceholder`) — same bare, dashed-border, "(Placeholder)" pattern already used for B2's original success stub.
- [x] Built a dev-only preview route (`/dev/results`, not linked from anywhere in the real app) with a toggle bar — same visual pattern as B1/B2's "Dev preview" box — so all three verdicts plus the escalation placeholder can be reviewed with mock data before Phase 3 wires up anything real.
- [x] Added the same focus-management pattern from B3 (`ResultScreen`'s heading gets programmatic focus whenever the verdict changes), since this is a same-page state transition that would otherwise go unannounced to screen readers.

🤔 **Decision point — resolved:** the master PRD's C1 description calls for a distinct "Safe Alternative" action (e.g. "official site/number"). Our backend schema doesn't return a separate structured field for that — only a single `recommendedAction` string — and in testing during Phase 1, the model already naturally folds safe-alternative-style guidance into that one field (e.g. "contact your bank directly using a number from your card"). I didn't add a second, separate CTA/button for this: having Gemini generate a specific clickable "official" link or phone number as its own actionable UI element carries real hallucination risk — a wrong-but-confident official-looking link or number would be actively harmful to hand to this persona, which is the same reasoning that ruled out OCR earlier. One unified "What to do next" card covers the same guidance more safely. Flagging this in case you want it revisited, since it's a deliberate deviation from the PRD's literal wording, not an oversight.

🧪 **Test checkpoint — done (by me, holding for your review):** viewed all three verdicts plus the escalation placeholder at `/dev/results` in the browser. Confirmed: C1 shows the amber warning icon, explanation, red-flag list, and guided-next-step card, and its own "I've already clicked or responded to this" link correctly hands off to the placeholder (not just the dev toggle bar's separate button). C2 renders as the lighter-weight reassurance screen. C3 shows its "How to check for sure" card. Heading focus-on-arrival confirmed via `document.activeElement`. Computed WCAG contrast on every new color pairing (red-flag card text, warning icon, guided-next-step card) — all comfortably pass AA (lowest ratio 6.1:1 against a 4.5:1 minimum). No console errors on the preview page or the landing page (regression check). `tsc --noEmit`, `next lint`, and `next build` all clean; `/dev/results` and `/api/check` both show up correctly in the build's route list.

📦 **Commit checkpoint:** C1–C3 UI — committed.

## Phase 3 — Wire B2 to the real backend ✅ (built, verified, committed)

- [x] Replaced B2's stub call with a real `fetch` to `/api/check`, kept inside the same one-silent-retry-then-B3 structure the stub already used.
- [x] Added a `stage: "result"` holding the returned `AnalysisResult`, rendering `ResultScreen` (built in Phase 2) — routes to C1/C2/C3 automatically based on the verdict field, no separate routing logic needed. Added a `stage: "escalation"` wired to C1's button, same `EscalationPlaceholder` from Phase 2.
- [x] Confirmed B3 still catches every real failure mode — see the test checkpoint below, which hit this by accident (in a good way).
- [x] Removed the dev-only "simulate result" toggle and its supporting code (`SimulateMode` type, `runStubCheck`) per your answer to the 🤔 decision point below — resolved in favor of removing it entirely.
- [x] Renamed the stub's fixed check delay to `PROGRESS_ANIMATION_MS`, repurposed as just an estimate for how long the progress bar's fill animation runs — it's a reassurance cue, not tied to real request time, and holds at 92% (doesn't reset or look broken) if the real call runs longer.

🤔 **Decision point — resolved:** asked directly; you chose to remove the simulate toggle entirely rather than repurpose it as a quota-free bypass. Input screen now always reflects real backend behavior.

🧪 **Test checkpoint — done (by me, holding for your review):** full click-through in the browser with real API calls.
- A phishing message (fake bank suspension) → correctly routed to **C1 (Risky)**, with real red flags and guidance. Confirmed "Got it" clears the textarea and resets to a fresh B1, and C1's own "I've already clicked or responded to this" link correctly hands off to the escalation placeholder, whose "Back" button correctly returns to the *same* held result (not a reset).
- A benign appointment-reminder message → correctly routed to **C2 (Safe)**.
- **Unplanned bonus test:** partway through, Gemini's free tier genuinely returned a 503 ("model experiencing high demand") on both the first attempt and the automatic retry — a real, unscripted instance of exactly the failure mode Phase 3 was supposed to guard against. The app correctly landed on B3 both times this happened, with no crash and no confusing error surfaced to the user. Confirmed via server logs it was a genuine upstream 503, not an app bug, by re-testing directly against `/api/check` once the overload cleared (succeeded immediately after).
- No console errors on `/check` or the landing page (regression check). `tsc --noEmit`, `next lint`, and `next build` all clean.

📦 **Commit checkpoint:** real backend wired end-to-end — committed.

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
- **Made "Got it" the primary button on C1, and "I've already clicked or responded" a smaller secondary text link beneath it** — the opposite visual hierarchy from the original mockup, which gave the escalation button equal or greater prominence. Most users land on C1 without having acted on the message yet, so the primary path should be the one that applies to most people, consistent with the "one recommendation at a time" design principle and the same primary/secondary pattern already used on B3 ("Try again" / "Start over instead").
- **`/dev/results` will likely be removed or repurposed once Phase 3 wires the real flow into `check-form.tsx`**, at which point the real C1–C3 screens become reachable through the actual app and this standalone preview route stops pulling its weight. Not deleting it yet since it's still useful for isolated review; revisit at the end of Phase 3.
- **No decorative stock photo**, unlike the original Stitch mockup (which included a hosted background image in C1's sidebar) — matches the precedent already set on the landing page and B1 of dropping marketing chrome that doesn't serve the single primary action, and avoids a build-time dependency on an external image host.

**Phase 3:**
- **Removed the simulate toggle entirely** (per your direct answer to the decision point), rather than repurposing it as a quota-free bypass — simpler code, and the input screen now always reflects real behavior.
- **Kept the exact same one-silent-retry-then-B3 structure** the stub used, just swapping what happens inside `attempt()` — this meant Phase 3 needed no changes to the retry/failure logic itself, only to what it calls.
- **Progress bar duration is now a rough estimate (3s), not a real countdown**, since actual Gemini latency varies — the animation approaches 92% and holds there via `animation-fill-mode: forwards` if the real call runs long, so it never looks broken or falsely claims completion.

**Phase 4:**
_(pending)_

## Related docs

- [Mini-PRD: Analysis & Result Flow](./prd-analysis-and-results-flow.md)
- [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md)
- [Master PRD](../PRD.md)
