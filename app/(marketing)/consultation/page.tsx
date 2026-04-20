import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { CalendarCheck, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Consultation — Terralume Property Advisory",
  description:
    "Request a free, no-obligation consultation with a Terralume project manager. We'll discuss your property goals, budget, and the best path forward.",
};

const WHAT_HAPPENS = [
  {
    step: "1",
    title: "PM assigned within 12–24 hours",
    body: "A dedicated project manager reviews your request and will reach out with a calendar link to schedule your consultation.",
  },
  {
    step: "2",
    title: "Free consultation — no commitment",
    body: "A focused call to understand your objective, budget, risk appetite, and any legal or cross-border considerations.",
  },
  {
    step: "3",
    title: "You decide how to proceed",
    body: "If you'd like to continue, we'll invite you to your secure client portal to complete your structured intake. No pressure.",
  },
];

const TRUST_ITEMS = [
  {
    icon: CalendarCheck,
    label: "Flexible scheduling",
    body: "Virtual or phone consultation — at your timezone.",
  },
  {
    icon: MessageSquare,
    label: "Dedicated project manager",
    body: "One point of contact throughout your entire journey.",
  },
  {
    icon: ShieldCheck,
    label: "Data protected",
    body: "Your information is kept confidential and never shared with third parties.",
  },
];

export default function ConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Free consultation"
        title={
          <>
            Let&apos;s talk about
            <br />
            <span className="text-crimson">your goals.</span>
          </>
        }
        description="Tell us what you're looking for and a project manager will be in touch within 12–24 hours to arrange your free, no-obligation consultation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Free Consultation" },
        ]}
      />

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-14 lg:grid-cols-5">
            {/* ── Form (3/5) */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-on-surface">
                  Request your free consultation
                </h2>
                <p className="mt-2 text-sm text-on-surface-muted">
                  Fill in the short form below. The more detail you share, the
                  better we can prepare for your call.
                </p>
              </div>
              <ConsultationForm />
            </div>

            {/* ── Sidebar (2/5) */}
            <aside className="space-y-10 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
              {/* What happens next */}
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface">
                  What happens next
                </h2>
                <ol className="mt-5 space-y-5">
                  {WHAT_HAPPENS.map(({ step, title, body }) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                        {step}
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">{title}</p>
                        <p className="mt-0.5 text-sm text-on-surface-muted">
                          {body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trust signals */}
              <div className="rounded-2xl border border-divider bg-white p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-on-surface-muted">
                  Why Terralume
                </h3>
                <ul className="space-y-4">
                  {TRUST_ITEMS.map(({ icon: Icon, label, body }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-light text-navy">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {label}
                        </p>
                        <p className="text-xs text-on-surface-muted">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
