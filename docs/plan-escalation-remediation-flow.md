# Execution Plan: Escalation & Remediation Flow (D1)

**Status: Feature complete. All four phases (content/logic, triage screen, wizard + closing, wire to C1 + end-to-end pass) built, verified, and committed.**

Turns [Mini-PRD: Escalation & Remediation Flow](./prd-escalation-remediation-flow.md) into buildable steps. Keep this file current as we go — check off items, update the Status line, and fill in the Decisions Log — so the work can be picked back up cold in a later session.

## How to read this file

- `- [ ]` / `- [x]` — check items off as they're finished.
- 🧪 **Test checkpoint** — there's a real interface to look at. Stop and verify before moving on.
- 🤔 **Decision point** — something here affects what comes next. Stop and decide together, then log it below.
- 📦 **Commit checkpoint** — a natural point to commit to git.

## Already in place

(Context for resuming cold — see [PRD.md](../PRD.md) and the mini-PRD for full detail.)

- B1–B3 and C1–C3 built, verified, and committed — see [plan-input-and-checking-flow.md](./plan-input-and-checking-flow.md) and [plan-analysis-and-results-flow.md](./plan-analysis-and-results-flow.md).
- C1's escalation button currently links to `EscalationPlaceholder` (`src/components/escalation-placeholder.tsx`) — bare, dashed-border, "(Placeholder)" copy that explicitly says D1 isn't built yet. This feature replaces it with the real thing.
- `/dev/results` (dev-only preview route) has an "Escalation placeholder" mode that also renders this same placeholder — will need updating once D1 is real, so it isn't showing stale copy.
- No SQLite persistence anywhere in the app yet — this feature doesn't change that either, per the mini-PRD.
- Design tokens, calm/judgment-free tone, and the "one thing at a time" wizard-style pattern are already established (B2's checking screen, B3, C1–C3) — reuse as-is.

## Phase 1 — Static remediation content + branching logic (no UI yet) ✅ (built, verified, committed)

- [x] Wrote the static, pre-reviewed step content as data (`src/lib/remediation-steps.ts`, not JSX) for each category: money sent/gift card, financial/SSN info, passwords/credentials, device safety, general monitor & report.
- [x] Wrote the selection/ordering function (`getRemediationSteps`): given a set of triage answers (or "not sure"/empty), returns the relevant steps in urgency order. Slotted financial/SSN in right after money/gift-card in the ordering (the mini-PRD didn't pin down exactly where it goes) — see Decisions Log.
- [x] Wrote the closing step's content (`CLOSING_STEP`) — the nudge toward telling a trusted contact / D2.

🤔 **Decision point — resolved:** reviewed the actual step wording together before wiring anything into a screen. Approved as-is.

🧪 **Verified (by me):** ran the branching logic against six scenarios (single selection, multiple selections, "not sure", empty selection, and both device-safety-triggering options individually) — ordering, deduplication, and the always-included closing "monitor & report" step all behaved correctly. `tsc --noEmit` and `eslint` both clean.

📦 **Commit checkpoint:** content + branching logic — committed.

## Phase 2 — Build the triage question screen ✅ (built, verified, committed)

- [x] Built the multi-select triage screen (`src/components/escalation-triage.tsx`): reassuring intro copy, checkboxes (entered a password / shared financial or SSN info / sent money or a gift card code / clicked a link but entered nothing / downloaded a file or app / not sure), "Continue" button.
- [x] "Not sure" is mutually exclusive with the other five — selecting it clears everything else, and selecting anything else clears "not sure" — so the state can never be contradictory.
- [x] Added focus management on arrival (heading gets programmatic focus, `tabIndex={-1}`, same pattern as B3/ResultScreen) — added now rather than deferred to the Phase 4 audit, since it's the same one-line pattern already proven elsewhere.
- [x] Added a dev-only preview route (`/dev/escalation`, `src/app/dev/escalation/page.tsx` + `src/components/dev-escalation-preview.tsx`) — same purpose and visual pattern as `/dev/results`, with a temporary placeholder echo of whatever was selected (Phase 3 doesn't exist yet).

🧪 **Test checkpoint — done (by me, holding for your review):** see the "How to check this yourself" note below for exact steps. I verified: checkbox toggling works individually and in combination; selecting "not sure" clears other selections and vice versa; "Continue" with zero selections doesn't block (shows "treated as not sure" on the placeholder echo); keyboard tab order is clean with the heading correctly excluded (`tabIndex -1`, focus-only); text contrast on the new cards is strong (15.6–17.2:1); no console errors on `/dev/escalation` or regression on `/check`; clean `tsc`/`lint`/`build`, with `/dev/escalation` showing up correctly as a route.

📦 **Commit checkpoint:** triage screen — committed.

## Phase 3 — Build the step wizard + closing screen ✅ (built, verified, committed)

- [x] Built the one-step-at-a-time wizard (`RemediationWizard`, Next/Back), driven by Phase 1's content and ordering function and Phase 2's triage answers. Shows "Step N of M"; "Back" only appears after the first step; the button reads "Continue" instead of "Next" on the final step.
- [x] Built the closing screen (`EscalationClosing`): the "you don't have to handle this alone" message with a single primary "Done" button. (Originally also had a "Notify a trusted contact" button leading to a D2 placeholder — removed per your feedback partway through this phase; see Decisions Log.)
- [x] Built `EscalationFlow`, an orchestrator component composing triage → wizard → closing behind a single `onDone` callback — built so Phase 4 can drop it straight into `check-form.tsx` in place of `EscalationPlaceholder` with no restructuring.
- [x] Replaced `/dev/escalation`'s temporary placeholder-echo with the real `EscalationFlow`, so the whole flow can be reviewed end to end with different answer combinations.

🧪 **Test checkpoint — done (by me):** walked the full flow at `/dev/escalation` twice — once with two selections (money + password, correctly assembled as 3 steps in urgency order: money → password → monitor), once with "not sure" (correctly assembled as all 5 steps, money first). Confirmed Back/Next navigate correctly and preserve position, the final step's button reads "Continue," and "Done" completes the flow. Keyboard tab order is clean with each step's heading correctly excluded (focus-only, same pattern as everywhere else). No console errors on `/dev/escalation` or regression on `/check`; clean `tsc`/`lint`/`build`.

**Post-checkpoint change (still Phase 3, before commit):** removed the closing screen's "Notify a trusted contact" button and the D2 placeholder it led to, per your direct feedback — see Decisions Log. The closing screen keeps its supportive message, now with a single primary "Done" button. Re-verified: full flow (money+password and "not sure" cases) still completes correctly end to end, `tsc`/`lint`/`build` clean, no console errors.

📦 **Commit checkpoint:** wizard + closing screen — committed.

## Phase 4 — Wire to C1 + end-to-end pass ✅ (done, verified, committed)

- [x] Replaced `check-form.tsx`'s `"escalation"` stage — was rendering `EscalationPlaceholder` — with the real `EscalationFlow` built in Phases 2–3. One-line swap, as designed.
- [x] Removed the now-unused `EscalationPlaceholder` component entirely (deleted, not left as dead code) and updated `/dev/results`: dropped its stale "Escalation placeholder" mode, pointed its "Escalation" banner note at `/dev/escalation`, and its escalation button now navigates there directly instead of showing a local mock.
- [x] Full click-through with real API calls: landing page → real click into `/check` → real risky verdict (an electric-bill gift-card scam) → C1 → real escalation button → real D1 triage → real wizard (2 steps: money → monitor) → real closing screen (just the "Done" button, no "Notify" leftover) → back to a genuinely empty B1. Ran a second pass selecting "not sure" to confirm the full 5-step sequence and the closing screen's tab order.
- [x] Accessibility pass: keyboard tab order clean at every stage checked (C1, triage, closing) in the *real* assembled flow (not just the isolated dev preview), with each screen's heading correctly excluded from Tab order (focus-only). No new colors introduced in Phases 3–4, so Phase 2's contrast audit still covers everything.
- [x] Regression check: no console errors anywhere across the whole session (landing page, `/check`, `/dev/results`, `/dev/escalation`); clean `tsc`/`lint`/`build`, with the route list showing exactly what's expected (`/`, `/check`, `/api/check`, `/dev/escalation`, `/dev/results` — no stray placeholder routes).

🧪 **Test checkpoint — done (by me, holding for your review):** see above — this exercised the real Gemini backend twice (used 2 of today's 20 free-tier requests).

📦 **Commit checkpoint:** feature complete — committed.

## Decisions log

_(Anything decided during execution that isn't already captured in the mini-PRD.)_

**Phase 1:**
- **Financial/SSN slotted in right after money/gift-card in urgency order**, ahead of passwords/credentials — the mini-PRD's stated order only explicitly covered money → credentials → device → monitor. Reasoning: fraud-alert/credit-freeze urgency for exposed financial or SSN info felt comparably time-sensitive to a gift-card/wire scam, more so than a compromised password.
- **"monitor & report" is always included** as the closing step regardless of which categories were selected, rather than being its own checkbox — it's generic good advice that applies no matter what happened.
- **Empty selection (Continue clicked with nothing checked) is treated identically to "not sure"** — shows the full step set rather than dead-ending or blocking submission, so there's no way to get stuck on the triage screen.
- **Both "clicked a link but entered nothing" and "downloaded a file or app" map to the same single device-safety step**, not two separate steps — the guidance (stop, scan, watch for changes) is the same for both, and duplicating it would pad the sequence without adding anything.

**Phase 2:**
- **"Not sure" is mutually exclusive with the other options**, not additive — selecting it clears everything else and vice versa. Wasn't explicitly specified in the mini-PRD; chosen because "not sure" already means "show me everything" in the branching logic, so letting it coexist with specific selections would just be confusing UI state with no behavioral difference.
- **Checkbox cards use large, full-row touch targets** (the whole card is a `<label>`, not just the small checkbox square) — consistent with the "large touch targets" design principle already applied elsewhere.
- **Added focus-on-arrival now instead of deferring to Phase 4**, since Phase 3 (B1–B3) already established this exact pattern and it costs nothing to apply consistently as each new screen is built, rather than retrofitting it later.

**Phase 4:**
- **`/dev/results`'s escalation button now navigates to `/dev/escalation`** (via `next/navigation`'s `useRouter`) rather than rendering anything inline, since that route already owns reviewing the full D1 flow — avoided building a second, redundant copy of it inside the results-preview page.
- **No new contrast audit needed** — Phases 3–4 introduced no new colors or components beyond what Phase 2 already reused from the existing design tokens, so the Phase 2 computed contrast numbers still stand.

**Phase 3:**
- **Removed the "Notify a trusted contact" button and D2 entirely, per your direct feedback** after the first version of this phase was reviewed: contacting a family member or friend doesn't need an in-app feature to do it for them, and building one risks a patronizing, unearned assumption about this persona's capability (your words: "it's not like older adults don't know how to contact their family members or friends"). The closing screen keeps its supportive text; "Done" is now the only, primary button. `TrustedContactPlaceholder` was deleted rather than left as dead code. Recorded as standing guidance for future features aimed at this persona, not just a one-off tweak — see the project memory this produced.
- **Built `EscalationFlow` as a single self-contained orchestrator now**, rather than leaving the triage/wizard/closing wiring to happen ad hoc in Phase 4 — means Phase 4 is a pure swap (`EscalationPlaceholder` → `EscalationFlow`) inside `check-form.tsx`, not new orchestration logic.
- **`/dev/escalation`'s temporary "Continue" restart uses a `key` prop to remount `EscalationFlow`** rather than adding a reset method to the component itself — keeps `EscalationFlow` simple (no reset concept needed in the real app either, since a fresh check always mounts a fresh instance).

**Phase 4:**
_(pending)_

## Related docs

- [Mini-PRD: Escalation & Remediation Flow](./prd-escalation-remediation-flow.md)
- [Mini-PRD: Analysis & Result Flow](./prd-analysis-and-results-flow.md)
- [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md)
- [Master PRD](../PRD.md)
