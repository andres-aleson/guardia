# Execution Plan: Input & Checking Flow (B1–B3)

**Status: Not started.**

Turns [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md) into buildable steps. Keep this file current as we go — check off items, update the Status line, and fill in the Decisions Log — so the work can be picked back up cold in a later session.

## How to read this file

- `- [ ]` / `- [x]` — check items off as they're finished.
- 🧪 **Test checkpoint** — there's a real interface to look at. Stop and verify in the browser before moving on.
- 🤔 **Decision point** — something here affects what comes next. Stop and decide together, then log it below.
- 📦 **Commit checkpoint** — a natural point to commit to git.

## Already in place

(Context for resuming cold — see [PRD.md](../PRD.md) and the mini-PRD for full detail.)

- Next.js 16 (App Router) + TypeScript + Tailwind v4, scaffolded and committed.
- Landing page (A1) built to match the Stitch mockup, committed.
- `better-sqlite3` wired up (`src/lib/db.ts`) but unused so far — no schema yet, and per the mini-PRD this feature doesn't persist anything either.
- Design tokens (colors, type scale, spacing) already ported into `globals.css` from the mockup's design system — reuse as-is for B1–B3.
- No analysis backend exists yet. B2 is built against a stub for this whole feature.

## Phase 1 — B1: Input Screen

- [ ] Static UI: single textarea, "Check This" button, minimal plain-language copy — matches the Stitch `input_screen` mockup minus the attach-file affordance (text-only, per our decision).
- [ ] Empty-input validation: inline shake state, no navigation (port the mockup's shake behavior to React state instead of vanilla JS).
- [ ] Hold submitted text in transient client state and carry it forward into the checking step — nothing written to SQLite here.

🧪 **Test checkpoint:** Open it in the browser. Confirm the textarea, button, and copy render correctly and match the mockup's tone. Submit empty and confirm the shake/validation fires. Submit real text and confirm it's captured going into the next screen.

📦 **Commit checkpoint:** B1 complete.

## Phase 2 — B2: Checking / Loading Screen

- [ ] Static UI: rotating calm status messages + a progress indicator that reads as advancing (not purely decorative) — matches the Stitch `checking_screen` mockup.
- [ ] Stub check: a fixed delay standing in for a real API call.
- [ ] A way to force success vs. failure in the stub (temporary dev-only toggle), so both paths are actually testable without a real backend.
- [ ] One silent automatic retry on simulated failure before falling through to B3 — per our discussion, the user shouldn't see an error screen on the first transient blip.

🤔 **Decision point:** B2 needs somewhere to go on stub success, but the real Result screens (C1–C3) don't exist yet. Options: (a) a bare placeholder screen just to prove the wiring works, or (b) leave the success path unwired until C is built. Decide before starting this phase.

🧪 **Test checkpoint:** Confirm the status messages rotate at a reasonable pace and the progress indicator feels like it's advancing. Force a failure and confirm the silent retry kicks in. Force a second failure and confirm it correctly falls through to B3.

📦 **Commit checkpoint:** B2 complete.

## Phase 3 — B3: Analysis Failed Screen

- [ ] Static UI: one generic, calm failure message, a fallback safety tip, and a Retry button — no jargon, no differentiating error types, per the mini-PRD.
- [ ] Wire Retry to re-run the stub check against the *same* held input — no retyping required.

🧪 **Test checkpoint:** Force repeated failures to actually land on B3. Confirm the copy reads calm, not alarming. Confirm Retry re-attempts without losing the original input, and that a subsequent successful retry proceeds correctly.

📦 **Commit checkpoint:** B3 complete.

## Phase 4 — End-to-end pass

- [ ] Full click-through: B1 → B2 → (success or failure) → retry paths → B3 → Retry → back into B2.
- [ ] Accessibility pass: keyboard-only navigation, screen-reader labels on the textarea/buttons/status text, contrast check across all three screens.
- [ ] Confirm no regressions to the landing page (A1) and that build/lint/type-check are still clean.

🧪 **Test checkpoint:** Walk the entire flow start to finish in the browser — both the happy path and the failure path.

📦 **Commit checkpoint:** feature complete.

## Decisions log

_(Fill in as we go — anything decided during execution that isn't already captured in the mini-PRD.)_

## Related docs

- [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md)
- [Master PRD](../PRD.md)
