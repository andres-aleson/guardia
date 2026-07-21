# PRD: Guardia — Safe Message Checker

*Working title "Guardia" taken from the Stitch mockups (`stitch_safe_message_checker/`). Not yet confirmed as final product name.*

## 1. Problem & Persona

**Primary persona: the Vulnerable Decision-Maker.** Someone (often older, or less confident with technology) who receives a suspicious email, text, or call and needs to decide what to do — without technical knowledge, without feeling judged, and ideally without having to ask a family member every time.

**Core need:** paste/forward a suspicious message → get a plain-language verdict → get one clear next step → act independently.

**Design principles** (derived from your mockups' `DESIGN.md`):
- Calm over alarming — no red klaxons, no jargon, no shame.
- One recommendation at a time, never a wall of options.
- Judgment-free tone even when the user already made a mistake (e.g., already clicked a link).
- Plain language throughout; large touch targets; high legibility (Atkinson Hyperlegible Next).

## 2. Screen Inventory

Screens are grouped by when the user encounters them. Screens marked **(mockup)** exist as Stitch samples already; **(new)** are implied by the happy path / user stories but not yet mocked.

### A. First contact

| # | Screen | Purpose |
|---|--------|---------|
| A1 | **Landing / Home** (mockup, *needs simplifying*) | Entry point. Mockup is a full marketing site (hero, feature grid, trust badges, footer). Your happy-path spec wants something much calmer: one headline + one button. **Recommendation:** use a simplified variant for the actual product surface (esp. for a user arriving mid-panic from a forwarded text); keep the fuller marketing content only for a separate public/pre-download marketing page if one exists. |
| A2 | **Onboarding (1–2 screens) (new)** | First-launch only. Explains in one or two lines what the app does and reassures on privacy ("we don't store or share your messages") before asking the user to paste anything sensitive. Skippable. Sets `onboarding_completed` flag. |
| A3 | **Mobile Share/Forward Setup (new)** | Explains how to enable "Share to [App]" from Messages/Mail so a user can forward a suspicious text/email directly instead of copy-pasting. Needed because the Input screen's spec explicitly offers "forward an email/text directly if on mobile" — that requires OS share-sheet integration, which the user won't discover without a short explainer. |

### B. Core happy path

| # | Screen | Purpose |
|---|--------|---------|
| B1 | **Input Screen** (mockup) | Paste/type a message, or attach a screenshot, or arrive here pre-filled via the OS share sheet (from A3). Single "Check This" button. Inline validation state if empty (mockup already shows a shake animation — keep as inline state, not a separate screen). |
| B2 | **Checking / Loading Screen** (mockup) | Calm rotating status text ("Checking sender…", "Looking at the link…"). No countdown pressure. Auto-advances to a Result screen. |
| B3 | **Analysis Failed Screen (new)** | Needed for when the check can't complete — no network, service error, unreadable attachment. Plain-language message ("We couldn't check this right now") + Retry button + a fallback tip ("If you're worried, don't click anything until you can try again"). Without this, a failed API call has nowhere to go. |

### C. Result — three verdict variants

The mockup only shows the "risky" case. The happy path implies at least two more outcomes:

| # | Screen | Purpose |
|---|--------|---------|
| C1 | **Result: Risky/Scam** (mockup) | Warning-style (amber, not red) verdict, explanation, red-flag list, one Guided Next Step, "I've already clicked/responded" escalation button, a "Safe Alternative" action (e.g. official site/number), "Got it" to confirm. |
| C2 | **Result: Looks Safe (new)** | Green/reassuring verdict ("This looks fine"), brief plain-language reason why, single "Got it" button. Deliberately lighter-weight than C1 — no red-flag panel needed. |
| C3 | **Result: Not Sure / Needs a Human Check (new)** | For ambiguous cases where the app shouldn't guess. Recommends a manual verification step (e.g., "Call the company using the number on your card or statement — not any number in this message"). Important for trust: an app for this persona must be able to say "I don't know" rather than force a binary verdict. |

### D. Escalation (from C1)

| # | Screen | Purpose |
|---|--------|---------|
| D1 | **"I Already Clicked/Responded" Screen (new)** | Triggered from the Result screen's escalation button. Same calm, judgment-free tone. Step-by-step remediation (e.g., change the password, call the bank, watch statements) — one step visible at a time, not a checklist wall. This is the single most important screen for a Vulnerable Decision-Maker who has already been scammed and is now anxious/ashamed — it must not exist only as a dead-end button in the mockup. |
| D2 | **Notify a Trusted Contact (optional, new — needs a decision, see §5)** | Only reachable from D1. Lets the user optionally loop in a pre-configured family member/trusted contact after something has already gone wrong (not for routine checks — that would undercut the "without handing the decision to someone else" goal from your user stories). |

### E. History

The mockup's Result screen has a "Back to dashboard" link, implying persistence.

| # | Screen | Purpose |
|---|--------|---------|
| E1 | **History / Past Checks Dashboard (new)** | List of past checks: date, short verdict chip (Safe/Risky/Not Sure), snippet. Lets a user or a family member helping them later confirm "did I already deal with that text from 'my bank'?" |
| E2 | **History Detail (new)** | Reopens a past check in the same Result screen layout (C1/C2/C3), read-only where relevant (e.g., "Got it" already confirmed). |

### F. Settings, help, and legal

| # | Screen | Purpose |
|---|--------|---------|
| F1 | **Settings (new)** | Text size / high-contrast toggle, manage/clear history, manage trusted contact (if in scope), notification prefs. |
| F2 | **How It Works (new — nav link exists in mockup)** | Static explainer, builds trust before first use. |
| F3 | **Security Tips (new — nav link exists in mockup)** | Static general scam-awareness content, addresses the "develop a sixth sense" goal from the mockup copy. |
| F4 | **Support / Contact (new — nav link exists in mockup)** | How to reach a human, and ideally a pointer to real elder-fraud helplines — this audience sometimes needs more than an app. |
| F5 | **Privacy Policy (new — footer link exists in mockup)** | Required; especially important given the "Zero-Data Logging" claim in the marketing copy (see §5 — this claim needs to be true or removed). |
| F6 | **Terms of Service (new — footer link exists in mockup)** | Required. |

## 3. Data: what's saved, and where

**Recommendation: local-first, no account required for v1.** This matches the marketing copy's privacy claims and avoids the trust/onboarding friction of a signup for an anxious user who just wants an answer.

**On-device storage:**
- Check history entries: id, timestamp, raw input (text and/or reference to attached image), content type (text/email/sms/link/screenshot), verdict (safe / risky / not-sure), red flags detected, recommended action shown, whether escalation (D1) was triggered, whether "Got it" was confirmed.
- Settings: text size, contrast/theme, onboarding-completed flag, trusted contact info if the user opts in (name + phone/email).
- Static content for F2/F3 can simply be bundled with the app, not per-user data.

**Server-side (only what's needed to run the check):**
- The message content must be sent to a backend/LLM to be analyzed. **Decision needed:** is that request processed statelessly (not persisted after the response), or logged for abuse-prevention/model-improvement? The mockup's own copy claims "Zero-Data Logging" — if any server-side retention happens, that claim needs to change or the retention needs to be minimized/anonymized and disclosed in F5.
- No account system in v1 means no server-side history — history lives only on the user's device (lost on uninstall/device loss unless a future version adds optional encrypted sync).
- Optional, aggregated, content-free analytics (e.g., count of checks run, verdict distribution) for product metrics — never raw message content.

## 4. Open questions / decisions needed before build

1. **Accounts vs. fully anonymous.** Local-only history is simpler and more private but disappears if the user gets a new phone. Is that acceptable for v1, or does cross-device history matter enough to justify a login screen (which adds friction for this persona)?
2. **Trusted Contact feature (D2).** In scope for v1, or deferred? Your user stories emphasize *not* needing to ask family for routine checks — D2 as proposed only appears after an escalation, which preserves that. Confirm this framing before building it.
3. **Backend retention policy for analyzed messages.** Needs an explicit answer to write accurate copy for F5/Privacy Policy and to honor the "Zero-Data Logging" claim already sitting in the marketing mockup.
4. **Verdict thresholds for C3 ("Not Sure").** Product/ML question: what confidence range routes to "Not Sure" instead of forcing Safe/Risky? Affects both the analysis logic and how often users see a non-committal answer (too often erodes trust in the tool).
5. **Landing screen (A1):** keep the mockup's full marketing layout, or simplify to match the calmer one-button version described in your happy path? They currently conflict.

## 5. Out of scope for v1 (candidates to defer)

- Server-side account sync of history across devices.
- Automated "report incorrect verdict" feedback loop.
- Any in-app action that directly blocks/reports a sender (out of scope until there's a clear provider integration, e.g., carrier-level blocking).

---
*No code has been written. This is a planning document for review.*
