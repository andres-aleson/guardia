"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/lib/analyze";
import { ResultScreen } from "./result-screen";
import { EscalationPlaceholder } from "./escalation-placeholder";

const MIN_LENGTH = 5;

const RETRY_DELAY_MS = 900;
const MESSAGE_INTERVAL_MS = 1100;

// The progress bar's fill is a reassurance cue, not a literal countdown — we
// don't know real latency in advance. It animates toward 92% over this
// estimate and holds there (animation-fill-mode: forwards) if the real
// request takes longer, so it never falsely claims "done" early.
const PROGRESS_ANIMATION_MS = 3000;

const STATUS_MESSAGES = [
  "Connecting to safety database…",
  "Analyzing sender reputation…",
  "Checking link destinations…",
  "Evaluating linguistic patterns…",
  "Finalizing report…",
];

type Stage = "input" | "checking" | "result" | "escalation" | "failed";

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

export function CheckForm() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [shake, setShake] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [attemptKey, setAttemptKey] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const failedHeadingRef = useRef<HTMLHeadingElement>(null);

  // Runs the real analysis check: one silent retry on failure before giving up.
  useEffect(() => {
    if (stage !== "checking") return;
    let cancelled = false;

    async function attempt(n: 1 | 2) {
      setAttemptKey((k) => k + 1);
      try {
        const response = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) {
          throw new Error(`Analysis request failed (${response.status})`);
        }
        const result = (await response.json()) as AnalysisResult;
        if (!cancelled) {
          setAnalysisResult(result);
          setStage("result");
        }
      } catch {
        if (n === 1) {
          await wait(RETRY_DELAY_MS);
          if (!cancelled) await attempt(2);
        } else if (!cancelled) {
          setStage("failed");
        }
      }
    }

    attempt(1);
    return () => {
      cancelled = true;
    };
  }, [stage, text]);

  // Rotates the calm status copy while checking.
  useEffect(() => {
    if (stage !== "checking") return;
    const id = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [stage]);

  // Moves focus to the failure heading so screen readers announce it — this
  // is a same-page state change, not a route change, so it wouldn't
  // otherwise be picked up automatically.
  useEffect(() => {
    if (stage === "failed") failedHeadingRef.current?.focus();
  }, [stage]);

  function handleCheck() {
    if (text.trim().length < MIN_LENGTH) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setStatusIndex(0);
    setStage("checking");
  }

  function handleReset() {
    setText("");
    setAnalysisResult(null);
    setStage("input");
  }

  function handleRetry() {
    setStatusIndex(0);
    setStage("checking");
  }

  return (
    <main className="flex flex-grow items-center justify-center px-margin-mobile pt-24 pb-stack-lg md:px-margin-desktop">
      <div className="w-full max-w-3xl">
        {stage === "input" && (
          <>
            <div className="mb-stack-lg text-center">
              <div className="bg-surface-container-high border-outline-variant mb-stack-md inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  verified_user
                </span>
                <span className="font-label-md text-label-md text-primary">
                  Your Safe Guardian
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">
                Is this message safe?
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto max-w-xl">
                Paste the message below, or tell us what happened — like a
                call you weren&apos;t sure about. We&apos;ll explain what we
                find in plain language.
              </p>
            </div>

            <div
              className={`bg-surface-container-lowest soft-card-shadow rounded-xl border p-base transition-all duration-300 ${
                shake
                  ? "animate-shake border-error"
                  : "border-outline-variant hover:border-primary"
              }`}
            >
              <textarea
                className="placeholder:text-on-surface-variant h-64 w-full resize-none border-none bg-transparent p-stack-md font-body-md text-body-md text-on-surface focus:ring-0 md:h-80"
                placeholder="Paste the message here, or describe what happened…"
                aria-label="Message or description to check"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="border-outline-variant flex items-center justify-end border-t px-stack-md py-stack-sm">
                <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    lock
                  </span>
                  Encrypted &amp; Private Analysis
                </span>
              </div>
            </div>
            {shake && (
              <p role="alert" className="sr-only">
                Please enter a message or description before checking.
              </p>
            )}
            <div className="mt-stack-lg flex flex-col items-center">
              <button
                onClick={handleCheck}
                className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
              >
                <span>Check This</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
              <p className="mt-stack-md flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">
                  lock
                </span>
                <span>Your data is never shared or sold.</span>
              </p>
            </div>
          </>
        )}

        {stage === "checking" && (
          <div className="text-center">
            <div className="mb-stack-md flex justify-center">
              <div className="relative">
                <div className="bg-primary-container absolute inset-0 animate-pulse rounded-full opacity-20 blur-xl" />
                <div className="border-outline-variant bg-surface-container-lowest relative flex h-24 w-24 items-center justify-center rounded-full border shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[48px]">
                    shield_with_heart
                  </span>
                </div>
              </div>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">
              Taking a look for you…
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-md max-w-md">
              We&apos;re checking what you shared and will explain what we
              find in plain language. Just a moment.
            </p>
            <div className="mx-auto max-w-xs">
              <div className="bg-surface-container-high h-1.5 w-full overflow-hidden rounded-full">
                <div
                  key={attemptKey}
                  className="bg-primary h-full rounded-full"
                  style={{
                    animation: `progress-fill ${PROGRESS_ANIMATION_MS}ms linear forwards`,
                  }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-on-surface-variant flex items-center gap-1 font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">
                    lock
                  </span>
                  Secure Analysis
                </span>
                <span
                  aria-live="polite"
                  className="text-primary font-label-sm text-label-sm"
                >
                  {STATUS_MESSAGES[statusIndex]}
                </span>
              </div>
            </div>
          </div>
        )}

        {stage === "result" && analysisResult && (
          <ResultScreen
            result={analysisResult}
            onGotIt={handleReset}
            onEscalate={() => setStage("escalation")}
          />
        )}

        {stage === "escalation" && (
          <EscalationPlaceholder onBack={() => setStage("result")} />
        )}

        {stage === "failed" && (
          <div className="text-center">
            <div className="mb-stack-md flex justify-center">
              <span className="material-symbols-outlined text-tertiary text-[40px]">
                error
              </span>
            </div>
            <h1
              ref={failedHeadingRef}
              tabIndex={-1}
              className="font-headline-lg text-headline-lg text-on-surface focus:ring-primary mb-stack-sm rounded-sm focus:ring-2 focus:outline-none"
            >
              We couldn&apos;t check this right now
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-lg max-w-md">
              This isn&apos;t about your message — something went wrong on
              our end. Please try again in a moment.
            </p>
            <div className="bg-surface-container-low mx-auto mb-stack-lg max-w-md rounded-lg p-stack-md text-left">
              <p className="font-body-md text-body-md text-on-surface flex items-start gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px]">
                  lightbulb
                </span>
                <span>
                  If you&apos;re worried, don&apos;t click any links or share
                  personal information until you&apos;re able to try again.
                </span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-stack-sm">
              <button
                onClick={handleRetry}
                className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
              >
                <span>Try again</span>
                <span className="material-symbols-outlined transition-transform group-hover:rotate-45">
                  refresh
                </span>
              </button>
              <button
                onClick={handleReset}
                className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm underline transition-colors"
              >
                Start over instead
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
