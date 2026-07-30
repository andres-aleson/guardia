import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DevEscalationPreview } from "@/components/dev-escalation-preview";

export const metadata: Metadata = {
  title: "Dev Preview: Escalation Flow | Guardia",
};

export default function DevEscalationPreviewPage() {
  return (
    <>
      <SiteHeader />
      <DevEscalationPreview />
      <SiteFooter />
    </>
  );
}
