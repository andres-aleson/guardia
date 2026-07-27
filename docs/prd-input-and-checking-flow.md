# Mini-PRD: Input & Checking Flow (B1–B3)

Scoped sub-feature of [PRD.md](../PRD.md) — covers the first three screens of the core happy path: paste a message, watch it get checked, handle failure gracefully. Does not cover the Result screens (C1–C3), which land in a later pass along with the real analysis backend.

## What it is

The entry point to the product. A user pastes or types a suspicious message (or describes a suspicious call in their own words), submits it, watches a calm loading state while it's "checked," and — if the check can't complete — lands on a graceful failure state that still leaves them with something to do.

## Screens touched

| Screen | Role in this feature |
|---|---|
| **B1 — Input Screen** | Entry: captures the text to be checked. |
| **B2 — Checking / Loading Screen** | Transition: shows while the (stubbed) analysis runs. |
| **B3 — Analysis Failed Screen** | Exit (failure path only): shown after retries are exhausted. |

Success path exits to a Result screen (C1/C2/C3) — out of scope for this pass; for now B2 can advance to a placeholder/mock result.

## User flow

1. User lands on B1, types or pastes a message — or describes what happened, e.g. for a phone call — into a single textarea.
2. User taps **Check This**.
   - If the textarea is empty: inline shake + validation state, no navigation.
3. App transitions to B2. A stubbed check runs (fixed delay, since no real backend exists yet) with calm rotating status text and a progress indicator that visually advances over that delay.
4. On (stubbed) success: advance to a Result screen (not built yet).
5. On failure: retry automatically, silently, in the background (no B3 shown yet).
   - If a retry succeeds: proceed as normal, user never sees an error.
   - If retries are exhausted: show B3.
6. On B3: user sees one calm, generic message, a fallback safety tip, and a **Retry** button that re-runs the check against the *same* input — no retyping required.

## What data needs to be saved, and where

**Nothing persists to SQLite in this feature.** Per the main PRD, check history (verdict, red flags, etc.) only makes sense once there's a real result to store — that lands with the C screens.

What *does* need to be held, and where:
- **Input text** — kept in transient, in-memory client state (e.g. component/route state) for the duration of the B1→B2→B3 flow only. Must survive a B3 retry without the user re-pasting anything. Cleared once the user leaves the flow (new check, navigates away, or reaches a Result screen).
- Nothing else. No draft-saving, no localStorage, no analytics event log — those are all explicitly out of scope below.

## In scope

- Plain textarea input — paste or type. No structured fields.
- Free-text description as a stand-in for the "I got a call" case (no phone-number field, no call-specific UI).
- Inline empty-input validation (shake state, per mockup) — no separate error screen for this case.
- Holding submitted input in transient state so B3's Retry doesn't lose it.
- Stubbed checking step: fixed delay + rotating calm status messages (reuse mockup's copy, e.g. "Analyzing sender reputation…"), built so the stub is a thin, isolated swap-point for the real analysis call later.
- A progress indicator on B2 that reads as actually advancing (not purely decorative), sized to whatever delay we pick for the stub.
- One silent automatic retry on failure before ever showing B3 (proposed default: retry once after a short delay; exact timing is a placeholder until real backend latency is known — tune later, not blocking to build now).
- B3: single generic, non-jargon failure message + fallback safety tip (e.g. "don't click anything until you can try again") + manual Retry button.
- Visual/accessibility system reused as-is from the already-built landing page (Tailwind theme tokens, fonts, large touch targets, high-contrast, plain language per FTC/AARP guidance).

## Explicitly out of scope

- **Image/screenshot attachment + OCR.** Deferred — OCR reliability and privacy concerns (see main PRD §5).
- **Structured phone-call flow** (phone-number field, call-specific lookup). Deferred — calls are covered only via free-text description for now (see main PRD §5).
- **Real analysis backend / LLM integration.** This pass is a stub only. Real integration — including prompt-injection hardening per OWASP LLM Top 10, since submitted text is attacker-authored by nature — is a requirement for whoever builds the C-screen backend, not this pass.
- **Persisting check history.** No SQLite writes happen in this feature; deferred until there's a real verdict to store.
- **Rate limiting / abuse prevention on submissions.** No real backend yet, so nothing to abuse; revisit once a real endpoint exists.
- **Input length/character limits.** Not needed for a stub; decide before the real backend lands.
- **Differentiated error messaging by failure type on B3.** Deliberately one generic message regardless of cause.
- **Mobile share-sheet / forward-a-text integration.** Already cut from the PRD (was A3).
- **Draft-saving / autosave of in-progress input.** Input only survives within the active flow, not across sessions.

---
*No code has been written. This is a planning document for review.*
