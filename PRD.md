# PRD: Guardia — Safe Message Checker

*Working title "Guardia" taken from the Stitch mockups (`stitch_safe_message_checker/`). Not yet confirmed as final product name.*

## 1. Problem & Persona

**Primary persona: the Vulnerable Decision-Maker.** Someone (often older, or less confident with technology) who receives a suspicious email, text, or call and needs to decide what to do — without technical knowledge, without feeling judged, and ideally without having to ask a family member every time.

**Core need:** paste a suspicious message → get a plain-language verdict → get one clear next step → act independently.

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

### B. Core happy path

| # | Screen | Purpose |
|---|--------|---------|
| B1 | **Input Screen** (mockup, *text-only*) | A single textarea: paste/type a message, or describe what happened in your own words (covers the "I got a call" case without a phone-specific flow — proper call support is deferred). No image/screenshot attachment (dropped: OCR on real-world scam screenshots is unreliable enough that a garbled extraction could produce a confidently wrong verdict, which is worse than not offering it — see §5). Single "Check This" button. Inline validation state if empty (mockup already shows a shake animation — keep as inline state, not a separate screen). |
| B2 | **Checking / Loading Screen** (mockup) | Calm rotating status text ("Checking sender…", "Looking at the link…") — all text-appropriate already, no rework needed for the text-only decision. No countdown pressure. Auto-advances to a Result screen. **Build note:** no analysis backend exists yet (that lands with the C screens), so this will initially run against a stub (fixed delay, canned result) and get wired to the real call later. |
| B3 | **Analysis Failed Screen (new)** | For when the check can't complete at all — no network or service error (the "unreadable attachment" case drops out along with screenshots). Distinct from C3: B3 is an infrastructure failure with no analysis to show; C3 is a completed analysis that's just inconclusive. One single, generic, calm message regardless of the underlying error (no jargon, no differentiating error types) — "We couldn't check this right now" — plus a Retry button and a fallback safety tip ("If you're worried, don't click anything until you can try again"), so the user isn't left with nothing to do even when the check fails. |

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
| D2 | **Notify a Trusted Contact (optional, new — needs a decision, see §4)** | Only reachable from D1. Lets the user optionally loop in a pre-configured family member/trusted contact after something has already gone wrong (not for routine checks — that would undercut the "without handing the decision to someone else" goal from your user stories). |

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
| F5 | **Privacy Policy (new — footer link exists in mockup)** | Required; especially important given the "Zero-Data Logging" claim in the marketing copy (see §3/§4 — this claim needs to be true or removed). |
| F6 | **Terms of Service (new — footer link exists in mockup)** | Required. |

## 3. Data: what's saved, and where

**Recommendation: local-first, no account required for v1.** This matches the marketing copy's privacy claims and avoids the trust/onboarding friction of a signup for an anxious user who just wants an answer.

**On-device storage:**
- Check history entries: id, timestamp, raw input text, content type (message text / description of a call), verdict (safe / risky / not-sure), red flags detected, recommended action shown, whether escalation (D1) was triggered, whether "Got it" was confirmed.
- Settings: text size, contrast/theme, trusted contact info if the user opts in (name + phone/email).
- Static content for F2/F3 can simply be bundled with the app, not per-user data.

**Server-side (only what's needed to run the check):**
- The message content is sent to an LLM to be analyzed, via a server-side API route (the API key never reaches the client). **Resolved:** the request is stateless — nothing about the submitted text or the verdict is persisted server-side after the response is returned. This is what makes the mockup's "Zero-Data Logging" copy true rather than aspirational, with one caveat: the LLM provider has its own data-handling terms independent of what Guardia itself stores, which needs a short disclosure in F5 once that's written.
- **v1 model/provider:** Gemini 2.5 Flash via a free-tier Google AI Studio API key. Chosen purely because this is an unfunded prototype — free-tier rate limits are tight enough that a real product would likely need a paid tier or a different provider, but the API route is a thin enough wrapper that swapping later is a config change, not a rewrite.
- **Resolved (verdict thresholds, was open question):** rather than the analysis returning a numeric confidence score that gets bucketed externally, the model is prompted to choose the safe/risky/not-sure verdict itself, with "not-sure" framed as a legitimate first-class answer it should prefer over guessing. Self-reported confidence scores from LLMs aren't reliably calibrated, so an external numeric threshold would be a false sense of precision.
- No account system in v1 means no server-side history — history lives only on the user's device (lost on uninstall/device loss unless a future version adds optional encrypted sync).
- Optional, aggregated, content-free analytics (e.g., count of checks run, verdict distribution) for product metrics — never raw message content.

## 4. Open questions / decisions needed before build

1. **Accounts vs. fully anonymous.** Local-only history is simpler and more private but disappears if the user gets a new phone. Is that acceptable for v1, or does cross-device history matter enough to justify a login screen (which adds friction for this persona)?
2. **Trusted Contact feature (D2).** In scope for v1, or deferred? Your user stories emphasize *not* needing to ask family for routine checks — D2 as proposed only appears after an escalation, which preserves that. Confirm this framing before building it.
3. **Landing screen (A1):** keep the mockup's full marketing layout, or simplify to match the calmer one-button version described in your happy path? They currently conflict.

*(Backend retention policy and C3 verdict-threshold questions from earlier drafts are resolved — see §3.)*

## 5. Out of scope for v1 (candidates to defer)

- Server-side account sync of history across devices.
- Automated "report incorrect verdict" feedback loop.
- Any in-app action that directly blocks/reports a sender (out of scope until there's a clear provider integration, e.g., carrier-level blocking).
- Image/screenshot attachment (with OCR to extract text). Considered and deliberately deferred: OCR on real-world scam screenshots (message bubbles, timestamps, emoji, low-res photos) is unreliable enough that a garbled extraction could produce a confidently wrong verdict — worse than not offering the feature. Revisit only with a specific accuracy bar in mind, and note it raises the privacy surface too (screenshots often catch more incidental personal info than text).
- Dedicated phone-call flow (structured phone-number lookup, call-specific fields). v1 covers calls only via free-text description in the same input as messages.

---
*No code has been written. This is a planning document for review.*
