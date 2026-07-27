import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-glow relative overflow-hidden py-24 md:py-32">
          <div className="max-w-container-max relative z-10 mx-auto px-margin-desktop text-center">
            <div className="bg-surface-container text-primary font-label-sm text-label-sm mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span>Trusted by 50,000+ users worldwide</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mx-auto mb-6 max-w-[800px] md:text-[56px] md:leading-[64px]">
              Not sure about a message? <br />
              <span className="text-primary">Let&apos;s check it together.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto mb-12 max-w-[600px]">
              Upload a screenshot or paste a suspicious link. Guardia uses
              advanced AI to analyze threats and keep your identity safe in
              real-time.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/check"
                className="hover-lift flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-10 py-5 font-headline-md text-headline-md text-on-primary transition-all hover:bg-primary-container active:scale-95 sm:w-auto"
              >
                <span className="material-symbols-outlined">
                  add_moderator
                </span>
                Check a message
              </Link>
              <button className="border-outline-variant text-on-surface hover:bg-surface-container-low w-full rounded-xl border bg-surface px-10 py-5 font-headline-md text-headline-md transition-all active:scale-95 sm:w-auto">
                Learn Privacy
              </button>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 md:gap-16">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span>
                <span className="font-label-md text-label-md">
                  Bank-Level Encryption
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  no_accounts
                </span>
                <span className="font-label-md text-label-md">
                  Zero-Data Logging
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  history_edu
                </span>
                <span className="font-label-md text-label-md">
                  GDPR Compliant
                </span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
            <div className="bg-primary/5 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-[100px]" />
            <div className="bg-secondary/5 absolute -right-24 -bottom-24 h-96 w-96 rounded-full blur-[100px]" />
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="bg-surface-container-lowest py-24">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Main Feature Card */}
              <div className="hover-lift border-outline-variant flex flex-col justify-between rounded-3xl border bg-white p-8 md:col-span-2">
                <div>
                  <div className="bg-surface-variant text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
                    <span className="material-symbols-outlined text-[28px]">
                      search_insights
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                    Real-time Link Analysis
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md">
                    Every link you submit is scanned against 50+ global
                    threat databases and analyzed by our &quot;Wise
                    Companion&quot; AI for behavioral red flags.
                  </p>
                </div>
                <div className="bg-surface-container relative aspect-video overflow-hidden rounded-2xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqJjqHarFoTOMKPTjF0VoLaSUgacE6rZJ92EMozM13rz6V1HH7ElGA0Lbq_Lbo2PbgVdNGBgtSEh-FFl_4CALtGzjVQiH1ulBHrodjfNhag_JIXzT5k97B-j2gst-LAkRYG3e-zTcpL5YpJW4EvWcrrFlgwFeVW7p_mswtiQRqTSgSNyRzZpWQx2_lq1BDlk_mik6jztNvzQjD8ua6TVh7nXVTvZSh_i1b1cDBOXbrDOXIx6YVRlAJ')",
                    }}
                    role="img"
                    aria-label="A clean, minimalist digital interface showing a scanning process with a soft blue progress ring."
                  />
                </div>
              </div>

              {/* Secondary Feature 1 */}
              <div className="bg-surface-container-low hover-lift border-outline-variant flex flex-col rounded-3xl border p-8">
                <div className="text-secondary mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    chat_bubble
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                  SMS &amp; WhatsApp
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  Tired of &quot;Hi Mom&quot; or parcel delivery scams?
                  Forward them to us for instant verification and blocking
                  advice.
                </p>
                <div className="border-outline-variant/30 mt-8 border-t pt-8">
                  <span className="text-primary group font-label-md text-label-md flex cursor-pointer items-center gap-2">
                    View guides{" "}
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>

              {/* Secondary Feature 2 */}
              <div className="bg-surface-container-high hover-lift border-outline-variant flex flex-col rounded-3xl border p-8">
                <div className="text-tertiary mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    psychology
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                  Threat Education
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                  We don&apos;t just say &quot;No.&quot; We explain why a
                  message is risky, helping you develop a sixth sense for
                  digital fraud.
                </p>
                <div className="border-outline-variant/30 mt-8 border-t pt-8">
                  <span className="text-on-surface group font-label-md text-label-md flex cursor-pointer items-center gap-2">
                    Latest reports{" "}
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>

              {/* Image Showcase */}
              <div className="border-outline-variant relative h-[300px] overflow-hidden rounded-3xl border md:col-span-2">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjPLMBNjaeGZeopRLSnXfoApdT7JG1y9A4N9lDu1mk7q_vN4eldf9MCP1LkO-DBvb7ELSCi5eqlZ7GDQYfH_kz870fPZOinzXozVdjMo7BYG1EbuB7y_IjGF-sUjysG8ummMK3sCHoXIquCsSiusvt9En12IQAQR6HHHSRX5SLFcvn-dtJeyh17SDrLWFStfftItAQT48Ovu7D7i1UHjMdCXfEnEhXHXZ3GjNuwBFV7udXrYC_H2Ux')",
                  }}
                  role="img"
                  aria-label="A serene workspace with a smartphone displaying a 'Safe' notification from an app."
                />
                <div className="from-on-surface/40 absolute inset-0 flex items-end bg-gradient-to-t to-transparent p-8">
                  <p className="font-headline-md text-headline-md text-white">
                    Protecting your digital peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-[700px] px-margin-desktop">
            <span
              className="material-symbols-outlined text-primary mb-6 text-[64px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
              Stay one step ahead of scammers.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
              Join thousands of people who trust Guardia to filter out the
              noise and keep their financial lives secure. No sign-up
              required for your first check.
            </p>
            <Link
              href="/check"
              className="hover-lift inline-block rounded-2xl bg-primary px-12 py-5 font-headline-md text-headline-md text-on-primary transition-all hover:bg-primary-container active:scale-95"
            >
              Start Protection Now
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
