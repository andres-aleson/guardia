# Execution Plan: Input & Checking Flow (B1–B3)

**Status: Phase 1 (B1) and Phase 2 (B2) built and browser-verified. Awaiting approval to commit Phase 2.**

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

## Phase 1 — B1: Input Screen ✅

- [x] Static UI: single textarea, "Check This" button, minimal plain-language copy — matches the Stitch `input_screen` mockup minus the attach-file affordance (text-only, per our decision). Lives at `/check` (`src/app/check/page.tsx` + `src/components/check-form.tsx`).
- [x] Empty-input validation: inline shake state, no navigation (ported the mockup's shake behavior to React state). Also added a `role="alert"` screen-reader announcement on the invalid-submit path, since the shake/red-border is a visual-only signal otherwise.
- [x] Hold submitted text in transient client state and carry it forward — implemented as an in-component `stage` state machine (`input` → `submitted`). On valid submit it shows a temporary confirmation panel that echoes the captured text back, proving the hand-off works, with a "Start over" reset. This confirmation panel is a placeholder — it gets replaced by real navigation into B2 in Phase 2, not additional B1 scope.
- [x] Extracted `SiteFooter` out of the landing page into its own component so `/check` can reuse it, and wired the landing page's header/hero/CTA buttons to link to `/check` (they were inert `#` placeholders before) so the new screen is actually reachable.

🧪 **Test checkpoint — done:** Verified in the browser (both direct navigation to `/check` and via the landing page's CTAs). Empty submit → shake + red border + screen-reader alert fires. Valid submit → confirmation panel shows the exact captured text. "Start over" clears back to a blank input. No console errors; `tsc --noEmit`, `next lint`, and `next build` all clean.

📦 **Commit checkpoint:** B1 complete — see commit for this phase.

## Phase 2 — B2: Checking / Loading Screen ✅ (built, verified — commit pending your approval)

- [x] Static UI: rotating calm status messages + a progress indicator that reads as advancing (not purely decorative) — matches the Stitch `checking_screen` mockup's tone (calm icon, "Taking a look for you…", secure-analysis label).
- [x] Stub check: a fixed 4s delay per attempt standing in for a real API call (`CHECK_DELAY_MS` in `check-form.tsx` — easy to retune once real latency is known).
- [x] A way to force success vs. failure in the stub: a visible, clearly-marked "Dev preview" toggle (dashed border, distinct from real UI) with three buttons — Success / Fail once (auto-retries) / Always fail — shown on the input screen. Chose a visible toggle over a URL query param so it's trivially testable by hand, not just from a browser address bar.
- [x] One silent automatic retry on simulated failure before falling through to a failure state — confirmed the user never sees an error UI on a single transient blip; the checking screen just keeps going.

🤔 **Decision point — resolved:** went with option (a), bare placeholder screens, for *both* ends of B2 (not just success) — since B3 doesn't exist until Phase 3 either, a stub "checking failed" fall-through had nowhere real to go, same problem as the success side. Both placeholders are visually marked as temporary (dashed border, "(Placeholder)" in the heading) so they're unmistakable for finished design. Full reasoning logged below.

🧪 **Test checkpoint — done:** Verified all three simulate modes in the browser. Success → checking screen (rotating messages, advancing progress bar) → success placeholder. Fail once → checking screen runs a full attempt, silently retries with no visible error state, then lands on the success placeholder. Always fail → runs two full attempts, then lands on the failed placeholder. No console errors; `tsc --noEmit`, `next lint`, and `next build` all clean.

📦 **Commit checkpoint:** B2 complete — holding for your review/approval before committing.

## Phase 3 — B3: Analysis Failed Screen

Replaces the "(Placeholder) Checking failed after retry" state from Phase 2 with the real screen. (The success-path placeholder is out of scope here — it gets replaced separately whenever the C1–C3 Result screens are built, which is a different feature per the mini-PRD.)

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

_(Anything decided during execution that isn't already captured in the mini-PRD.)_

**Phase 1 (B1):**
- **Route:** the Input Screen lives at `/check`.
- **Dropped the mockup's toolbar icon buttons** (attach-file and an inert "info" icon) entirely, keeping only the "Encrypted & Private Analysis" reassurance line under the textarea. Attach-file doesn't apply (text-only decision); the info icon had no defined behavior in our scoping conversation. This follows the "get to the point, no incidental copy" FTC guidance we surfaced earlier.
- **Dropped the mockup's 3-column trust-badges grid** (Expert Analysis / Human-First / Real-time Updates) below the button. It's marketing chrome carried over from the fuller mockup, not called for in the mini-PRD's description of B1, and competes with the single primary action.
- **B1's "carry forward" requirement, concretely:** since B2 doesn't exist yet, valid submission transitions to a temporary in-page confirmation panel that echoes the captured text back (with a "Start over" reset), rather than navigating anywhere. This proves the state hand-off works without building throwaway B2 UI ahead of Phase 2 — the panel gets replaced, not extended, when B2 lands.
- **Reused the mockup's original validation threshold** (minimum 5 trimmed characters) rather than picking a new number.

**Phase 2 (B2):**
- **Resolved the B2-success decision point:** built a bare placeholder screen for stub success (option (a) from the plan), and — since it turned out to be the same underlying problem — did the same for the stub-exhausted-retries failure state, rather than leaving either unwired. Both are clearly marked "(Placeholder)" with a dashed border so they read as obviously temporary, not finished design.
- **Dev-only simulate toggle is a visible UI control, not a URL query param.** More convenient for hand-testing (no need to know or type param syntax), and it sidesteps a Next.js complication: `useSearchParams()` in a client component requires a `<Suspense>` boundary to avoid de-opting the route from static rendering, which a plain `useState` toggle doesn't need.
- **Stub delay set to 4s per attempt** (`CHECK_DELAY_MS`), with a 0.9s pause before the silent retry. Placeholder numbers — retune once real backend latency is known, per the mini-PRD's note that this affects whether the progress bar needs to show true percent-done (NN/g's >10s guidance) or a simpler animation suffices.
- **Progress bar animates 0% → 92%** over the stub delay (a determinate CSS animation, not an indeterminate shimmer), intentionally stopping short of 100% so it never visually claims "done" before the stage actually transitions.
- **Silent retry is truly silent:** no "retrying…" copy or visual state change is shown — the checking screen just keeps rotating its status messages and restarts the progress-bar fill. Only two outcomes are ever user-visible: success or (after both attempts fail) the failed state.

## Related docs

- [Mini-PRD: Input & Checking Flow](./prd-input-and-checking-flow.md)
- [Master PRD](../PRD.md)
