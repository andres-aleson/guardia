"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/analyze";
import { ResultScreen } from "./result-screen";
import { EscalationPlaceholder } from "./escalation-placeholder";

const MOCK_RESULTS: Record<"safe" | "risky" | "not-sure", AnalysisResult> = {
  safe: {
    verdict: "safe",
    explanation:
      "This message doesn't show any signs of being a scam — it reads like a normal, low-pressure note with no requests for money or personal information.",
    redFlags: [],
    recommendedAction:
      "No action needed. As always, stay alert if anything about a message ever feels off.",
  },
  risky: {
    verdict: "risky",
    explanation:
      "This message uses urgency and asks for sensitive information — both common signs of a scam. Scammers often pressure people to act fast so they don't stop to think it through.",
    redFlags: [
      "Urgent, threatening language",
      "Asks for a password or Social Security number",
      "A link that doesn't match the real company's website",
    ],
    recommendedAction:
      "Don't click any links or share any information. Contact the company directly using a number from an official statement or card, not any number or link in this message.",
  },
  "not-sure": {
    verdict: "not-sure",
    explanation:
      "This one doesn't clearly look like a scam, but there isn't quite enough here to be sure either way.",
    redFlags: [],
    recommendedAction:
      "If you can, verify this by calling the organization directly using a number from an official document — never a number or link from the message itself.",
  },
};

type PreviewMode = "safe" | "risky" | "not-sure" | "escalation";

const MODE_OPTIONS: { mode: PreviewMode; label: string }[] = [
  { mode: "risky", label: "C1 — Risky" },
  { mode: "safe", label: "C2 — Safe" },
  { mode: "not-sure", label: "C3 — Not Sure" },
  { mode: "escalation", label: "Escalation placeholder" },
];

export function DevResultsPreview() {
  const [mode, setMode] = useState<PreviewMode>("risky");

  return (
    <main className="flex flex-grow flex-col items-center px-margin-mobile pt-24 pb-stack-lg md:px-margin-desktop">
      <div className="border-outline-variant bg-surface-container-low mb-stack-lg w-full max-w-3xl rounded-xl border border-dashed p-stack-md">
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm">
          Dev preview — not linked from the real app. Lets us review C1/C2/C3
          with mock data before Phase 3 wires up the real flow.
        </p>
        <div className="flex flex-wrap gap-2">
          {MODE_OPTIONS.map(({ mode: m, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full border px-4 py-1.5 font-label-sm text-label-sm transition-all active:scale-95 ${
                mode === m
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-on-surface-variant hover:border-primary bg-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        {mode === "escalation" ? (
          <EscalationPlaceholder onBack={() => setMode("risky")} />
        ) : (
          <ResultScreen
            result={MOCK_RESULTS[mode]}
            onGotIt={() => setMode("risky")}
            onEscalate={() => setMode("escalation")}
          />
        )}
      </div>
    </main>
  );
}
