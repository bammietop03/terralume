import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  MessageSquare,
  SearchCheck,
  KeyRound,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <ClipboardList size={22} />,
    title: "Intake & Brief",
    description:
      "Complete our structured intake form so we understand your budget, timeline, and property goals in Lagos.",
  },
  {
    number: "02",
    icon: <MessageSquare size={22} />,
    title: "Strategy Briefing",
    description:
      "Your dedicated Project Manager presents a personalised property brief with shortlisted options and market context.",
  },
  {
    number: "03",
    icon: <SearchCheck size={22} />,
    title: "Due Diligence",
    description:
      "We independently verify titles, ownership, planning consents, and produce a full property inspection report.",
  },
  {
    number: "04",
    icon: <KeyRound size={22} />,
    title: "Completion",
    description:
      "We negotiate price, coordinate legal documentation, and walk you through to a clean, protected completion.",
  },
];

export function HowItWorksPreview() {
  return (
    <section id="how-it-works" className="bg-surface-alt py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              The process
            </p>
            <h2 className="font-display text-4xl font-bold text-navy lg:text-5xl">
              How Terralume works
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-on-surface-muted">
              A structured four-step process built entirely around protecting
              you as a buyer.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/how-it-works">See full process</Link>
          </Button>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line (mobile) */}
          <div className="absolute left-7 top-0 h-full w-px bg-divider lg:hidden" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="relative flex gap-5 lg:flex-col lg:gap-0"
              >
                {/* Per-step horizontal connector to next circle (desktop only) */}
                {idx < 3 && (
                  <div className="absolute top-7 left-14 -right-6 hidden h-px bg-divider lg:block" />
                )}

                {/* Number circle */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-divider bg-surface-alt">
                  <span className="font-display text-[13px] font-bold tabular-nums text-navy/90">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="pb-2 lg:mt-8">
                  {/* Icon pill */}
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                    {step.icon}
                  </div>
                  <h3 className="mb-3 font-display text-[18px] font-bold text-navy">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-on-surface-muted">
                    {step.description}
                  </p>
                  {idx === 3 && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-crimson">
                      Get started <ArrowRight size={13} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
