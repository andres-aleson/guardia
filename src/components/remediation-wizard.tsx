"use client";

import { useEffect, useRef, useState } from "react";
import type { RemediationStep } from "@/lib/remediation-steps";

interface RemediationWizardProps {
  steps: RemediationStep[];
  onFinish: () => void;
}

export function RemediationWizard({ steps, onFinish }: RemediationWizardProps) {
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  // Same reasoning as every other same-page state change in this app: move
  // focus to the heading so screen readers announce each new step.
  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  function handleNext() {
    if (isLast) onFinish();
    else setIndex((i) => i + 1);
  }

  function handleBack() {
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="text-center">
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm">
        Step {index + 1} of {steps.length}
      </p>
      <div className="mb-stack-md flex justify-center">
        <div className="bg-surface-container-high flex h-16 w-16 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-primary text-[32px]">
            {step.icon}
          </span>
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-headline-lg text-headline-lg text-on-surface focus:ring-primary mb-stack-sm rounded-sm focus:ring-2 focus:outline-none"
      >
        {step.title}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-lg max-w-xl">
        {step.body}
      </p>

      <div className="flex flex-col items-center gap-stack-sm">
        <button
          onClick={handleNext}
          className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
        >
          <span>{isLast ? "Continue" : "Next"}</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
        {index > 0 && (
          <button
            onClick={handleBack}
            className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm underline transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
