# Mini-PRD: Escalation & Remediation Flow (D1)

Scoped sub-feature of [PRD.md](../PRD.md) — covers the real D1 screen, replacing the bare placeholder built alongside C1 in the [analysis-and-results feature](./prd-analysis-and-results-flow.md). D2 (in-app trusted-contact notification) has been cut from this flow entirely — see the note below.

## What it is

The screen for someone who already clicked, entered information, or sent something in response to a scam — reached from C1's "I've already clicked or responded to this" button. Modeled on the FTC's IdentityTheft.gov recovery tool: a short, low-friction triage question about what happened, followed by a calm, ordered sequence of static, pre-written remediation steps shown one at a time, ending with a supportive reminder that it's okay to tell someone you trust — no in-app mechanism for that, just the suggestion. **Decision:** an earlier pass of this screen included a "Notify a trusted contact" button leading to a D2 placeholder. That button was removed — contacting a family member or friend directly (call, text) doesn't need an in-app feature to do it for them, and building one risks an unearned, patronizing assumption about this persona's capability. The closing screen keeps its supportive message; it just doesn't try to do the contacting itself.

## Screens touched

| Screen | Role in this feature |
|---|---|
| **D1 — Escalation / Remediation** | New: the real screen, replacing the `EscalationPlaceholder` built earlier. |
| **C1 — Result: Risky/Scam** | Modified: its escalation button now links to real D1 instead of the placeholder. |

## User flow

1. User is on C1 and clicks "I've already clicked or responded to this."
2. Lands on D1's triage step: a reassuring, non-judgmental intro, then a single multi-select question — "What did you share or do? Select all that apply" — with options: entered a password, shared financial or SSN info, sent money or a gift card code, clicked a link but didn't enter anything, downloaded a file or app, not sure.
3. User selects any that apply (or "not sure," which shows the full step set) and continues.
4. D1 assembles the relevant static remediation steps, ordered by urgency (money/gift cards → passwords/credentials → device safety → monitor & report), and shows them one at a time with Next/Back — same "one thing at a time" pattern as the rest of the app, not a checklist wall.
5. After the last step, a closing screen offers a supportive reminder that it's okay to tell someone you trust what happened — text only, no button or in-app action.
6. A single "Done" action returns to a fresh B1, consistent with "Got it" elsewhere in the app.

## What data needs to be saved, and where

**Nothing persists to SQLite in this feature**, consistent with every other pass so far — there's still no history UI (E1/E2) to show it against.

What *does* need to be held, and where:
- Triage selections and current step index — transient, in-memory client state for the duration of the D1 flow only. Cleared on returning to B1.
- Nothing else. No record of which steps were shown, completed, or skipped.

## In scope

- The triage question: a single multi-select screen, low friction, "not sure" defaults to the full step sequence rather than blocking progress.
- A small library of static, hand-written, pre-reviewed remediation steps — one per category (password/credentials, financial/SSN, money sent or gift card, device safety, general monitor & report) — covering standard, stable guidance (e.g., change your password, call your bank using the number on your card or statement, report at reportfraud.ftc.gov). No LLM calls anywhere in this screen.
- Branching logic that selects and orders only the steps relevant to the triage answers, by urgency.
- The one-step-at-a-time wizard UI (Next/Back), reusing existing design tokens and the calm, judgment-free tone already established.
- A closing step with a supportive, text-only reminder that it's okay to tell someone you trust — no button, no in-app trusted-contact mechanism.
- Wiring C1's escalation button to the real D1 instead of the existing placeholder.

## Explicitly out of scope

- **LLM-generated or personalized remediation text.** Decided against per industry practice (IdentityTheft.gov assembles fixed, vetted content via branching, not free text) and hallucination risk on safety-critical specifics — same reasoning that ruled out an LLM-generated "safe alternative" link on C1.
- **D2 / in-app trusted-contact notification, entirely.** Cut, not deferred — see the note above. Someone who wants to tell a family member or friend can already do that themselves; there's no gap here that an in-app feature needs to fill.
- **Persisting escalation history** — which steps were shown, completed, or skipped. No SQLite writes, same as every pass so far.
- **Resuming an interrupted D1 flow.** If the user leaves mid-wizard, it doesn't resume from where they left off — transient state only, consistent with the rest of the app.
- **Automated reporting or contact on the user's behalf** — no auto-submitting an FTC report, no auto-emailing a bank. D1 gives the user information and links to act on themselves.
- **Reachable from C2 or C3.** D1 stays reachable only from C1, matching the master PRD.
- **Editing triage answers via a dedicated "change my answers" control** — only simple Back navigation through the wizard.

---
*No code has been written. This is a planning document for review.*
