"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How is Terralume different from a regular estate agent in Lagos?",
    a: "Traditional estate agents in Lagos are paid by the seller or landlord — their entire incentive is to close the transaction at the highest possible price for the seller. Terralume works exclusively for buyers. We are the only professional on your side of the table. Our fee is paid by you, which means our loyalty is entirely to you.",
  },
  {
    q: "How long does the full process typically take?",
    a: "The typical end-to-end process from initial enquiry to key handover takes 8–14 weeks, depending on property type and complexity. Rental advisory engagements can move faster (2–4 weeks). We will give you a realistic timeline during your strategy briefing based on your specific brief.",
  },
  {
    q: "What is included in your advisory fee?",
    a: "Our advisory fee covers end-to-end buyer representation: your dedicated Project Manager, the full property search, accompanied viewings, title verification, due diligence reporting, negotiation, and completion management. There are no hidden costs. Any third-party costs (e.g. licensed surveyor, stamp duty) are itemised and passed through at cost.",
  },
  {
    q: "I live in the diaspora — can Terralume handle this entirely remotely?",
    a: "Yes. A significant portion of our clients are diaspora buyers based in the UK, US, Canada, and the UAE. Our process is specifically designed to be executed remotely. We attend every site visit and inspection on your behalf, provide detailed video walkthroughs, and use digital document signing. You only need to travel for the final handover — and that is optional.",
  },
  {
    q: "What happens if due diligence uncovers a problem?",
    a: "This is exactly what the due diligence gate is for. If we uncover a title defect, encumbrance, or material structural issue, we will present you with the full findings and options: remediation (if possible), price renegotiation to account for the risk, or a recommendation to walk away. We will never pressure you to proceed on a property we have concerns about.",
  },
  {
    q: "Do I need my own solicitor?",
    a: "We work with a panel of trusted property solicitors in Lagos and can refer you to one if needed. If you already have a preferred solicitor, we are happy to work with them. Terralume is not a legal firm — we are your advisory and project management layer. Legal work is handled by a qualified solicitor, coordinated through us.",
  },
  {
    q: "Can Terralume help with off-plan or new developer properties?",
    a: "Yes, and this is an area where buyer representation is especially important. Developer contracts are heavily weighted in the developer's favour. We review all off-plan agreements, escrow arrangements, and completion guarantees to make sure your deposit is protected and your interests are represented.",
  },
  {
    q: "What if I find a property myself — can Terralume still help?",
    a: "Absolutely. If you have already identified a property you like, we can be engaged at any stage — from due diligence only, to negotiation only, to full completion support. You do not need to start from Stage 1. We will scope the engagement based on what work remains.",
  },
];

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="bg-surface-alt py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <div className="mb-14 text-center">
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
            <span className="h-px w-8 bg-crimson" />
            FAQs
            <span className="h-px w-8 bg-crimson" />
          </p>
          <h2 className="font-display text-4xl font-bold text-navy lg:text-5xl">
            Common questions
          </h2>
          <p className="mt-4 text-[17px] text-on-surface-muted">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors",
                  isOpen
                    ? "border-navy/20 bg-surface"
                    : "border-divider bg-surface hover:border-navy/15",
                )}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "font-semibold leading-snug transition-colors",
                      isOpen ? "text-navy" : "text-on-surface",
                    )}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                      isOpen
                        ? "bg-navy text-white"
                        : "bg-surface-alt text-on-surface-muted",
                    )}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96" : "max-h-0",
                  )}
                >
                  <p className="px-7 pb-6 text-[15px] leading-relaxed text-on-surface-muted">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
