import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { IntakeForm } from "@/components/get-started/IntakeForm";
import { ShieldCheck, Clock, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Started — Client Intake Form | Terralume",
  description:
    "Complete the Terralume client intake form. Takes 5–8 minutes. An advisor will follow up within one business day with a personalised brief.",
};

const TRUST_POINTS = [
  {
    icon: Clock,
    title: "5–8 minutes",
    body: "That's all this takes. The more detail you give, the better we can prepare for our first conversation.",
  },
  {
    icon: ShieldCheck,
    title: "Strict confidence",
    body: "Your information is used only to prepare your advisory. It is never shared with developers, agents, or third parties.",
  },
  {
    icon: FileText,
    title: "No obligation",
    body: "Completing this form does not commit you to any service. We'll recommend the right package — you decide.",
  },
];

export default function GetStartedPage() {
  return (
    <>
      <PageHero
        eyebrow="Client intake"
        title={
          <>
            Let&apos;s build your
            <br />
            <span className="text-crimson">property brief.</span>
          </>
        }
        description="Complete the intake form below so an advisor can prepare a personalised first response. Every section helps us understand your situation better."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Get Started" }]}
      />

      {/* Trust bar */}
      <div className="border-b border-divider bg-surface-alt">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-divider px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex items-start gap-4 py-5 px-3 sm:px-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-light">
                <Icon className="h-4 w-4 text-navy" />
              </span>
              <div>
                <p className="text-sm font-semibold text-on-surface">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-on-surface-muted">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form section */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-6">
          <IntakeForm />

          {/* Footer note */}
          <p className="mt-6 text-center text-xs leading-relaxed text-on-surface-muted">
            Prefer to start with a shorter message?{" "}
            <Link
              href="/contact"
              className="text-navy underline-offset-2 hover:underline"
            >
              Use the quick enquiry form
            </Link>{" "}
            instead.
          </p>
        </div>
      </section>
    </>
  );
}
