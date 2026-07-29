import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DevResultsPreview } from "@/components/dev-results-preview";

export const metadata: Metadata = {
  title: "Dev Preview: Result Screens | Guardia",
};

export default function DevResultsPreviewPage() {
  return (
    <>
      <SiteHeader />
      <DevResultsPreview />
      <SiteFooter />
    </>
  );
}
