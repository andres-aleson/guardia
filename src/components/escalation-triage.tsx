"use client";

import { useEffect, useRef, useState } from "react";
import type { TriageOption } from "@/lib/remediation-steps";

interface TriageScreenProps {
  onContinue: (selections: TriageOption[]) => void;
}

const OPTIONS: { value: TriageOption; label: string }[] = [
  { value: "password", label: "Entered a password" },
  {
    value: "financial",
    label: "Shared financial or Social Security information",
  },
  { value: "money", label: "Sent money or a gift card code" },
  { value: "link-only", label: "Clicked a link but didn't enter anything" },
  { value: "downloaded", label: "Downloaded a file or app" },
  { value: "not-sure", label: "Not sure" },
];

export function TriageScreen({ onContinue }: TriageScreenProps) {
  const [selected, setSelected] = useState<TriageOption[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Same reasoning as B3/ResultScreen: arriving here is a same-page state
  // change (not a route change), so screen readers need an explicit nudge.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function toggle(option: TriageOption) {
    setSelected((prev) => {
      if (option === "not-sure") {
        return prev.includes("not-sure") ? [] : ["not-sure"];
      }
      const withoutNotSure = prev.filter((o) => o !== "not-sure");
      return withoutNotSure.includes(option)
        ? withoutNotSure.filter((o) => o !== option)
        : [...withoutNotSure, option];
    });
  }

  return (
    <div className="text-center">
      <div className="mb-stack-md flex justify-center">
        <div className="bg-surface-container-high flex h-16 w-16 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-primary text-[32px]">
            volunteer_activism
          </span>
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-headline-lg text-headline-lg text-on-surface focus:ring-primary mb-stack-sm rounded-sm focus:ring-2 focus:outline-none"
      >
        Let&apos;s figure out what to do next
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-stack-lg max-w-xl">
        This isn&apos;t about blame — we just want to help with the right
        next steps. What did you share or do? Select all that apply.
      </p>

      <fieldset className="mx-auto mb-stack-lg max-w-xl text-left">
        <legend className="sr-only">What did you share or do?</legend>
        <div className="flex flex-col gap-stack-sm">
          {OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-stack-md rounded-xl border p-stack-md transition-all ${
                selected.includes(value)
                  ? "border-primary bg-surface-container-low"
                  : "border-outline-variant bg-surface-container-lowest hover:border-primary"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => toggle(value)}
                className="accent-primary h-5 w-5 shrink-0"
              />
              <span className="font-body-md text-body-md text-on-surface">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        onClick={() => onContinue(selected)}
        className="assurance-glow group relative inline-flex items-center justify-center gap-stack-md rounded-full bg-primary px-12 py-4 font-headline-md text-headline-md text-on-primary transition-all duration-300 hover:bg-primary-container active:scale-95"
      >
        <span>Continue</span>
        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
          arrow_forward
        </span>
      </button>
    </div>
  );
}
