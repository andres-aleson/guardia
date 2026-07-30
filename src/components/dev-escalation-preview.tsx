"use client";

import { useState } from "react";
import { EscalationFlow } from "./escalation-flow";

export function DevEscalationPreview() {
  const [runKey, setRunKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <main className="flex flex-grow flex-col items-center px-margin-mobile pt-24 pb-stack-lg md:px-margin-desktop">
      <div className="border-outline-variant bg-surface-container-low mb-stack-lg w-full max-w-3xl rounded-xl border border-dashed p-stack-md">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Dev preview — not linked from the real app. Lets us review the full
          triage → steps → closing flow before it&apos;s wired into the real
          C1 hand-off (Phase 4).
        </p>
      </div>

      <div className="w-full max-w-3xl">
        {done ? (
          <div className="border-outline-variant bg-surface-container-lowest rounded-xl border border-dashed p-8 text-center">
            <div className="mb-stack-md flex justify-center">
              <span className="material-symbols-outlined text-secondary text-[40px]">
                task_alt
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
              (Preview) Flow complete
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              In the real app, &quot;Done&quot; returns to a fresh check (same
              as &quot;Got it&quot; elsewhere). That&apos;s Phase 4.
            </p>
            <button
              onClick={() => {
                setDone(false);
                setRunKey((k) => k + 1);
              }}
              className="border-outline text-on-surface hover:bg-surface-container-low rounded-xl border px-8 py-3 font-label-md text-label-md transition-all active:scale-95"
            >
              Restart preview
            </button>
          </div>
        ) : (
          <EscalationFlow key={runKey} onDone={() => setDone(true)} />
        )}
      </div>
    </main>
  );
}
