"use client";

import { useState } from "react";

const MIN_LENGTH = 5;

type Stage = "input" | "submitted";

export function CheckForm() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [shake, setShake] = useState(false);

  function handleCheck() {
    if (text.trim().length < MIN_LENGTH) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setStage("submitted");
  }

  function handleReset() {
    setText("");
    setStage("input");
  }

  return (
    <main className="flex flex-grow items-center justify-center px-margin-mobile pt-24 pb-stack-lg md:px-margin-desktop">
      <div className="w-full max-w-3xl">
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
            Paste the message below, or tell us what happened — like a call
            you weren&apos;t sure about. We&apos;ll explain what we find in
            plain language.
          </p>
        </div>

        {stage === "submitted" ? (
          <div className="bg-surface-container-lowest border-outline-variant rounded-xl border p-8 text-center">
            <div className="mb-stack-md flex justify-center">
              <span className="material-symbols-outlined text-primary text-[40px]">
                task_alt
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
              Got it.
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              We&apos;ve captured what you submitted. The checking screen
              (with a plain-language answer) is coming in the next build
              phase.
            </p>
            <div className="bg-surface-container-low mb-stack-md rounded-lg p-stack-md text-left">
              <p className="font-label-sm text-label-sm text-outline mb-1">
                What you submitted:
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant break-words whitespace-pre-wrap">
                {text}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="border-outline text-on-surface hover:bg-surface-container-low rounded-xl border px-8 py-3 font-label-md text-label-md transition-all active:scale-95"
            >
              Start over
            </button>
          </div>
        ) : (
          <>
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
      </div>
    </main>
  );
}
