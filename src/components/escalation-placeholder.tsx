"use client";

interface EscalationPlaceholderProps {
  onBack: () => void;
}

export function EscalationPlaceholder({ onBack }: EscalationPlaceholderProps) {
  return (
    <div className="border-outline-variant bg-surface-container-lowest rounded-xl border border-dashed p-8 text-center">
      <div className="mb-stack-md flex justify-center">
        <span className="material-symbols-outlined text-primary text-[40px]">
          construction
        </span>
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
        (Placeholder) Next steps aren&apos;t built yet
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
        In the real app, this leads to step-by-step help for undoing a scam
        response (changing a password, calling the bank, and so on) —
        that&apos;s a separate, later feature (D1). For now this confirms the
        hand-off from the Result screen works.
      </p>
      <button
        onClick={onBack}
        className="border-outline text-on-surface hover:bg-surface-container-low rounded-xl border px-8 py-3 font-label-md text-label-md transition-all active:scale-95"
      >
        Back
      </button>
    </div>
  );
}
