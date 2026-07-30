"use client";

import { useState } from "react";
import type { TriageOption } from "@/lib/remediation-steps";
import { TriageScreen } from "./escalation-triage";

export function DevEscalationPreview() {
  const [selections, setSelections] = useState<TriageOption[] | null>(null);

  return (
    <main className="flex flex-grow flex-col items-center px-margin-mobile pt-24 pb-stack-lg md:px-margin-desktop">
      <div className="border-outline-variant bg-surface-container-low mb-stack-lg w-full max-w-3xl rounded-xl border border-dashed p-stack-md">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Dev preview — not linked from the real app. Lets us review the
          triage screen before the step wizard (Phase 3) exists.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        {selections === null ? (
          <TriageScreen onContinue={setSelections} />
        ) : (
          <div className="border-outline-variant bg-surface-container-lowest rounded-xl border border-dashed p-8 text-center">
            <div className="mb-stack-md flex justify-center">
              <span className="material-symbols-outlined text-secondary text-[40px]">
                task_alt
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
              (Placeholder) Triage captured
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              In the real app, this leads into the step-by-step remediation
              wizard — that&apos;s Phase 3. For now this confirms what was
              selected:
            </p>
            <ul className="font-body-md text-body-md text-on-surface mx-auto mb-stack-md max-w-xs list-inside list-disc text-left">
              {selections.length === 0 ? (
                <li>(nothing selected — treated as &quot;not sure&quot;)</li>
              ) : (
                selections.map((s) => <li key={s}>{s}</li>)
              )}
            </ul>
            <button
              onClick={() => setSelections(null)}
              className="border-outline text-on-surface hover:bg-surface-container-low rounded-xl border px-8 py-3 font-label-md text-label-md transition-all active:scale-95"
            >
              Back to triage
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
