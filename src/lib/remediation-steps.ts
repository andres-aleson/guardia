export type TriageOption =
  | "password"
  | "financial"
  | "money"
  | "link-only"
  | "downloaded"
  | "not-sure";

export interface RemediationStep {
  id: string;
  icon: string;
  title: string;
  body: string;
}

// Static, pre-written, hand-reviewed guidance — no LLM involved. Safety-
// critical specifics (who to call, where to report) shouldn't be generated.
const STEP_LIBRARY: Record<string, RemediationStep> = {
  money: {
    id: "money",
    icon: "priority_high",
    title: "If you sent money or a gift card code",
    body: "Contact the company right away — if it was a gift card, call the retailer (the number is usually on the back of the card or their website) and ask them to freeze it. If it was a bank transfer or wire, call your bank immediately and ask if it can be stopped or reversed. Acting in the first few hours gives you the best chance. If it was cryptocurrency, it usually can't be reversed, but it's still worth reporting (see the last step). Don't feel embarrassed — banks and retailers hear this every day.",
  },
  financial: {
    id: "financial",
    icon: "shield_lock",
    title: "If you shared financial or Social Security information",
    body: "Call your bank or card issuer directly, using the number on the back of your card or a recent statement — not any number from the message. Ask them to watch your account for unusual activity. If you shared your Social Security number, consider placing a free fraud alert with one of the three credit bureaus (Equifax, Experian, or TransUnion) — placing it with just one automatically notifies the other two.",
  },
  password: {
    id: "password",
    icon: "password",
    title: "If you entered a password",
    body: "Change that password right away, on a device you trust — and if you've used the same password anywhere else, change it there too. Turn on two-factor authentication if the account offers it. Take a moment to check the account for anything unfamiliar, like a new payment method or forwarding address.",
  },
  device: {
    id: "device",
    icon: "phonelink_lock",
    title: "If you clicked a link or downloaded something",
    body: "Don't enter any more information on that page or in that app. If you can, run a security scan using your device's built-in protection or a trusted antivirus app. If anything seems different afterward — new pop-ups, unusual slowness — it's worth asking someone you trust or a professional to take a look.",
  },
  monitor: {
    id: "monitor",
    icon: "visibility",
    title: "Keep an eye out, and report it",
    body: "Over the next few weeks, check your bank and card statements for anything you don't recognize. You can report what happened at reportfraud.ftc.gov — it helps warn others and can support a dispute with your bank later. None of this is your fault; scammers do this professionally, and it can happen to anyone.",
  },
};

const URGENCY_ORDER = ["money", "financial", "password", "device", "monitor"];

const OPTION_TO_STEP_IDS: Partial<Record<TriageOption, string>> = {
  money: "money",
  financial: "financial",
  password: "password",
  "link-only": "device",
  downloaded: "device",
};

// "monitor" is always included as a closing catch-all, regardless of which
// (if any) specific categories were selected. An empty selection is treated
// the same as "not sure" — showing every step rather than dead-ending.
export function getRemediationSteps(
  selections: TriageOption[],
): RemediationStep[] {
  const stepIds = new Set<string>(["monitor"]);

  if (selections.length === 0 || selections.includes("not-sure")) {
    URGENCY_ORDER.forEach((id) => stepIds.add(id));
  } else {
    selections.forEach((selection) => {
      const stepId = OPTION_TO_STEP_IDS[selection];
      if (stepId) stepIds.add(stepId);
    });
  }

  return URGENCY_ORDER.filter((id) => stepIds.has(id)).map(
    (id) => STEP_LIBRARY[id],
  );
}

export const CLOSING_STEP = {
  icon: "diversity_3",
  title: "You don't have to handle this alone",
  body: "If it would help, consider telling someone you trust what happened — a family member or friend can help you keep an eye on things over the next few days.",
};
