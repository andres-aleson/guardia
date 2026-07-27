"use client";

import { useEffect, useState } from "react";

const MIN_LENGTH = 5;

// Stub timing — stands in for a real analysis call until the backend lands (see docs/plan-input-and-checking-flow.md, Phase 2).
const CHECK_DELAY_MS = 4000;
const RETRY_DELAY_MS = 900;
const MESSAGE_INTERVAL_MS = 1100;

const STATUS_MESSAGES = [
  "Connecting to safety database…",
  "Analyzing sender reputation…",
  "Checking link destinations…",
  "Evaluating linguistic patterns…",
  "Finalizing report…",
];

type Stage = "input" | "checking" | "success" | "failed";
type SimulateMode = "success" | "fail-once" | "fail-always";

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function runStubCheck(mode: SimulateMode, attemptNumber: 1 | 2): Promise<void> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const shouldFail =
        mode === "fail-always" || (mode === "fail-once" && attemptNumber === 1);
      if (shouldFail) reject(new Error("Simulated check failure"));
      else resolve();
    }, CHECK_DELAY_MS);
  });
}

export function CheckForm() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [shake, setShake] = useState(false);
  const [simulateMode, setSimulateMode] = useState<SimulateMode>("success");
  const [statusIndex, setStatusIndex] = useState(0);
  const [attemptKey, setAttemptKey] = useState(0);

  // Runs the (stubbed) check: one silent retry on failure before giving up.
  useEffect(() => {
    if (stage !== "checking") return;
    let cancelled = false;

    async function attempt(n: 1 | 2) {
      setAttemptKey((k) => k + 1);
      try {
        await runStubCheck(simulateMode, n);
        if (!cancelled) setStage("success");
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
  }, [stage, simulateMode]);

  // Rotates the calm status copy while checking.
  useEffect(() => {
    if (stage !== "checking") return;
    const id = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(id);
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
    setStage("input");
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

            <div className="border-outline-variant bg-surface-container-low mb-stack-lg rounded-xl border border-dashed p-stack-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm">
                Dev preview — no analysis backend yet, so simulate the
                result:
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { mode: "success", label: "Success" },
                    { mode: "fail-once", label: "Fail once (auto-retries)" },
                    { mode: "fail-always", label: "Always fail" },
                  ] as { mode: SimulateMode; label: string }[]
                ).map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => setSimulateMode(mode)}
                    className={`rounded-full border px-4 py-1.5 font-label-sm text-label-sm transition-all active:scale-95 ${
                      simulateMode === mode
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant text-on-surface-variant hover:border-primary bg-surface"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`bg-surface-container-lowest soft-card-shadow rounded-xl border p-base transition-all duration-300 ${
                shake
                  ? "animate-shake border-error"
                  : "border-outline-variant hover:border-primary"
              }`}
            >
              <textarea
                className="placeholder:text-outline h-64 w-full resize-none border-none bg-transparent p-stack-md font-body-md text-body-md text-on-surface focus:ring-0 md:h-80"
                placeholder="Paste the message here, or describe what happened…"
                aria-label="Message or description to check"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="border-outline-variant flex items-center justify-end border-t px-stack-md py-stack-sm">
                <span className="text-label-sm font-label-sm text-outline flex items-center gap-1">
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
              <p className="mt-stack-md flex items-center gap-2 font-label-sm text-label-sm text-outline">
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
                    animation: `progress-fill ${CHECK_DELAY_MS}ms linear forwards`,
                  }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-outline flex items-center gap-1 font-label-sm text-label-sm">
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

        {stage === "success" && (
          <div className="border-outline-variant bg-surface-container-lowest rounded-xl border border-dashed p-8 text-center">
            <div className="mb-stack-md flex justify-center">
              <span className="material-symbols-outlined text-secondary text-[40px]">
                task_alt
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
              (Placeholder) Check complete
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              In the real app, a Result screen (Safe / Risky / Not Sure)
              appears here — that&apos;s a later phase. For now this
              confirms the checking flow completed successfully.
            </p>
            <button
              onClick={handleReset}
              className="border-outline text-on-surface hover:bg-surface-container-low rounded-xl border px-8 py-3 font-label-md text-label-md transition-all active:scale-95"
            >
              Start over
            </button>
          </div>
        )}

        {stage === "failed" && (
          <div className="border-outline-variant bg-surface-container-lowest rounded-xl border border-dashed p-8 text-center">
            <div className="mb-stack-md flex justify-center">
              <span className="material-symbols-outlined text-tertiary text-[40px]">
                error
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
              (Placeholder) Checking failed after retry
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              This is where the real Analysis Failed screen goes, built next
              — with a calm explanation and a Retry button. For now this
              confirms the silent-retry-then-fail path works.
            </p>
            <button
              onClick={handleReset}
              className="border-outline text-on-surface hover:bg-surface-container-low rounded-xl border px-8 py-3 font-label-md text-label-md transition-all active:scale-95"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
