# Execution Plan: Escalation & Remediation Flow (D1)

**Status: Phase 1-2 built, verified, and committed. Phase 3 (step wizard + closing screen) not started.**

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

## Phase 3 — Build the step wizard + closing screen

- [ ] Build the one-step-at-a-time wizard (Next / Back) driven by Phase 1's content and ordering function, using Phase 2's triage answers.
- [ ] Build the closing screen: nudge toward D2, with a link to a new bare placeholder (`TrustedContactPlaceholder`) — same pattern `EscalationPlaceholder` used for D1 until now.
- [ ] Wire all of this together behind `/dev/escalation`, so the full triage → steps → closing flow can be reviewed with different answer combinations before touching C1.

🧪 **Test checkpoint:** walk the full flow at `/dev/escalation` a few times with different triage selections — a single selection, multiple selections, and "not sure" — confirming step order and content match each case, Back/Next both work, and the closing screen's D2 link lands on the placeholder.

📦 **Commit checkpoint:** wizard + closing screen, once verified.

## Phase 4 — Wire to C1 + end-to-end pass

- [ ] Replace `check-form.tsx`'s `"escalation"` stage — currently rendering `EscalationPlaceholder` — with the real flow built in Phases 2–3.
- [ ] Remove the now-unused `EscalationPlaceholder` component and the stale "Escalation placeholder" mode in `/dev/results` (superseded by `/dev/escalation`), so nothing in the app still points to placeholder copy claiming D1 isn't built.
- [ ] Full click-through: C1 (real risky verdict) → escalate → triage → steps → closing → D2 placeholder → done → back to a fresh B1.
- [ ] Accessibility pass: keyboard order through checkboxes and Next/Back, focus management on each step transition (same "move focus to heading" pattern already used on B3 and the C-screens), computed WCAG contrast on any new elements.
- [ ] Regression check: landing page, B1–B3, C1–C3 (safe/not-sure verdicts untouched by this feature), clean `tsc`/`lint`/`build`.

🧪 **Test checkpoint:** walk the entire flow start to finish, in one continuous session, then the accessibility/regression pass.

📦 **Commit checkpoint:** feature complete.

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

**Phase 3:**
_(pending)_

**Phase 4:**
_(pending)_

## Related docs

- [Mini-PRD: Escalation & Remediation Flow](./prd-escalation-remediation-flow.md)
- [Mini-PRD: Analysis & Result Flow](./prd-analysis-and-results-flow.md)
- [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md)
- [Master PRD](../PRD.md)
