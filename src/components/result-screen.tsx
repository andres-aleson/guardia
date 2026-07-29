"use client";

import { useEffect, useRef } from "react";
import type { AnalysisResult } from "@/lib/analyze";

interface ResultScreenProps {
  result: AnalysisResult;
  onGotIt: () => void;
  onEscalate: () => void;
}

export function ResultScreen({ result, onGotIt, onEscalate }: ResultScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Same reasoning as B3: this is a same-page state change (not a route
  // change), so screen readers need an explicit nudge to notice the verdict.
  useEffect(() => {
    headingRef.current?.focus();
  }, [result.verdict]);

  const headingClass =
    "font-headline-lg text-headline-lg text-on-surface focus:ring-primary mb-stack-sm rounded-sm focus:ring-2 focus:outline-none";

  if (result.verdict === "risky") {
    return (
      <div className="text-center">
        <div className="mb-stack-md flex justify-center">
          <div className="bg-tertiary-fixed flex h-16 w-16 items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-tertiary text-[32px]">
              warning
            </span>
          </div>
        </div>
        <h1 ref={headingRef} tabIndex={-1} className={headingClass}>
          This looks risky
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-lg max-w-xl">
          {result.explanation}
        </p>

        {result.redFlags.length > 0 && (
          <div className="bg-surface-container-high border-outline-variant mx-auto mb-stack-lg max-w-xl rounded-xl border p-stack-md text-left">
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm">
              Red flags found
            </h2>
            <ul className="space-y-3">
              {result.redFlags.map((flag) => (
                <li key={flag} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary mt-0.5 text-[20px]">
                    priority_high
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    {flag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-surface-container-low mx-auto mb-stack-lg max-w-xl rounded-lg p-stack-md text-left">
          <h2 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">
              security_update_good
            </span>
            What to do next
          </h2>
          <p className="font-body-md text-body-md text-on-surface">
            {result.recommendedAction}
          </p>
        </div>

        <div className="flex flex-col items-center gap-stack-sm">
          <button
            onClick={onGotIt}
            className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
          >
            Got it
          </button>
          <button
            onClick={onEscalate}
            className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm underline transition-colors"
          >
            I&apos;ve already clicked or responded to this
          </button>
        </div>
      </div>
    );
  }

  if (result.verdict === "safe") {
    return (
      <div className="text-center">
        <div className="mb-stack-md flex justify-center">
          <div className="bg-secondary-container flex h-16 w-16 items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-secondary text-[32px]">
              task_alt
            </span>
          </div>
        </div>
        <h1 ref={headingRef} tabIndex={-1} className={headingClass}>
          This looks safe
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-md max-w-xl">
          {result.explanation}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mx-auto mb-stack-lg max-w-xl">
          {result.recommendedAction}
        </p>
        <button
          onClick={onGotIt}
          className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
        >
          Got it
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-stack-md flex justify-center">
        <div className="bg-surface-container-high flex h-16 w-16 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-primary text-[32px]">
            help
          </span>
        </div>
      </div>
      <h1 ref={headingRef} tabIndex={-1} className={headingClass}>
        We&apos;re not sure about this one
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-lg max-w-xl">
        {result.explanation}
      </p>
      <div className="bg-surface-container-low mx-auto mb-stack-lg max-w-xl rounded-lg p-stack-md text-left">
        <h2 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            fact_check
          </span>
          How to check for sure
        </h2>
        <p className="font-body-md text-body-md text-on-surface">
          {result.recommendedAction}
        </p>
      </div>
      <button
        onClick={onGotIt}
        className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
      >
        Got it
      </button>
    </div>
  );
}
