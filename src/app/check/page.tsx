import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckForm } from "@/components/check-form";

export const metadata: Metadata = {
  title: "Check a Message | Guardia",
  description:
    "Paste a suspicious message, or describe what happened, and get a plain-language answer.",
};

export default function CheckPage() {
  return (
    <>
      <SiteHeader />
      <CheckForm />
      <SiteFooter />
    </>
  );
}
