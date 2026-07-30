"use client";

import { useState } from "react";
import {
  getRemediationSteps,
  type RemediationStep,
  type TriageOption,
} from "@/lib/remediation-steps";
import { TriageScreen } from "./escalation-triage";
import { RemediationWizard } from "./remediation-wizard";
import { EscalationClosing } from "./escalation-closing";

type FlowStage = "triage" | "steps" | "closing";

interface EscalationFlowProps {
  onDone: () => void;
}

export function EscalationFlow({ onDone }: EscalationFlowProps) {
  const [stage, setStage] = useState<FlowStage>("triage");
  const [steps, setSteps] = useState<RemediationStep[]>([]);

  if (stage === "triage") {
    return (
      <TriageScreen
        onContinue={(selections: TriageOption[]) => {
          setSteps(getRemediationSteps(selections));
          setStage("steps");
        }}
      />
    );
  }

  if (stage === "steps") {
    return (
      <RemediationWizard steps={steps} onFinish={() => setStage("closing")} />
    );
  }

  return <EscalationClosing onDone={onDone} />;
}
