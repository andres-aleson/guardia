"use client";

import { useEffect, useRef } from "react";
import { CLOSING_STEP } from "@/lib/remediation-steps";

interface EscalationClosingProps {
  onDone: () => void;
}

export function EscalationClosing({ onDone }: EscalationClosingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="text-center">
      <div className="mb-stack-md flex justify-center">
        <div className="bg-secondary-container flex h-16 w-16 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-secondary text-[32px]">
            {CLOSING_STEP.icon}
          </span>
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-headline-lg text-headline-lg text-on-surface focus:ring-primary mb-stack-sm rounded-sm focus:ring-2 focus:outline-none"
      >
        {CLOSING_STEP.title}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-lg max-w-xl">
        {CLOSING_STEP.body}
      </p>

      <button
        onClick={onDone}
        className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
      >
        <span>Done</span>
        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
          arrow_forward
        </span>
      </button>
    </div>
  );
}
