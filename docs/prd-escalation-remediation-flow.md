# Mini-PRD: Escalation & Remediation Flow (D1)

Scoped sub-feature of [PRD.md](../PRD.md) — covers the real D1 screen, replacing the bare placeholder built alongside C1 in the [analysis-and-results feature](./prd-analysis-and-results-flow.md). D2 (trusted contact) remains out of scope and stays a placeholder, same as D1 was until now.

## What it is

The screen for someone who already clicked, entered information, or sent something in response to a scam — reached from C1's "I've already clicked or responded to this" button. Modeled on the FTC's IdentityTheft.gov recovery tool: a short, low-friction triage question about what happened, followed by a calm, ordered sequence of static, pre-written remediation steps shown one at a time, ending with a nudge toward telling a trusted contact (D2, still a placeholder).

## Screens touched

| Screen | Role in this feature |
|---|---|
| **D1 — Escalation / Remediation** | New: the real screen, replacing the `EscalationPlaceholder` built earlier. |
| **C1 — Result: Risky/Scam** | Modified: its escalation button now links to real D1 instead of the placeholder. |
| **D2 — Notify a Trusted Contact** | Still a placeholder, same bare pattern D1 used to be — reached from D1's closing step. |

## User flow

1. User is on C1 and clicks "I've already clicked or responded to this."
2. Lands on D1's triage step: a reassuring, non-judgmental intro, then a single multi-select question — "What did you share or do? Select all that apply" — with options: entered a password, shared financial or SSN info, sent money or a gift card code, clicked a link but didn't enter anything, downloaded a file or app, not sure.
3. User selects any that apply (or "not sure," which shows the full step set) and continues.
4. D1 assembles the relevant static remediation steps, ordered by urgency (money/gift cards → passwords/credentials → device safety → monitor & report), and shows them one at a time with Next/Back — same "one thing at a time" pattern as the rest of the app, not a checklist wall.
5. After the last step, a closing screen nudges toward telling a trusted contact, with a button to D2 (placeholder).
6. A final "Done" action returns to a fresh B1, consistent with "Got it" elsewhere in the app.

## What data needs to be saved, and where

**Nothing persists to SQLite in this feature**, consistent with every other pass so far — there's still no history UI (E1/E2) to show it against.

What *does* need to be held, and where:
- Triage selections and current step index — transient, in-memory client state for the duration of the D1 flow only. Cleared on reaching D2's placeholder or returning to B1.
- Nothing else. No record of which steps were shown, completed, or skipped.

## In scope

- The triage question: a single multi-select screen, low friction, "not sure" defaults to the full step sequence rather than blocking progress.
- A small library of static, hand-written, pre-reviewed remediation steps — one per category (password/credentials, financial/SSN, money sent or gift card, device safety, general monitor & report) — covering standard, stable guidance (e.g., change your password, call your bank using the number on your card or statement, report at reportfraud.ftc.gov). No LLM calls anywhere in this screen.
- Branching logic that selects and orders only the steps relevant to the triage answers, by urgency.
- The one-step-at-a-time wizard UI (Next/Back), reusing existing design tokens and the calm, judgment-free tone already established.
- A closing step nudging toward D2, linking to a bare placeholder (same pattern `EscalationPlaceholder` used for D1 itself, until now).
- Wiring C1's escalation button to the real D1 instead of the existing placeholder.

## Explicitly out of scope

- **LLM-generated or personalized remediation text.** Decided against per industry practice (IdentityTheft.gov assembles fixed, vetted content via branching, not free text) and hallucination risk on safety-critical specifics — same reasoning that ruled out an LLM-generated "safe alternative" link on C1.
- **D2 itself.** Stays a placeholder; trusted-contact functionality is separate, unscoped work.
- **Persisting escalation history** — which steps were shown, completed, or skipped. No SQLite writes, same as every pass so far.
- **Resuming an interrupted D1 flow.** If the user leaves mid-wizard, it doesn't resume from where they left off — transient state only, consistent with the rest of the app.
- **Automated reporting or contact on the user's behalf** — no auto-submitting an FTC report, no auto-emailing a bank. D1 gives the user information and links to act on themselves.
- **Reachable from C2 or C3.** D1 stays reachable only from C1, matching the master PRD.
- **Editing triage answers via a dedicated "change my answers" control** — only simple Back navigation through the wizard.

---
*No code has been written. This is a planning document for review.*
