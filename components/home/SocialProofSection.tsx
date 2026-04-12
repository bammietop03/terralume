import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Diaspora Client",
    initials: "DC",
    location: "UK",
    type: "Purchase — 3-bed apartment, Ikoyi",
    outcome:
      "Terralume saved us ₦8.2M off the asking price and uncovered a title defect before we committed. Couldn’t have done this remotely without them.",
    rating: 5,
  },
  {
    name: "Chukwuemeka A.",
    initials: "CA",
    location: "Lagos",
    type: "First-time purchase — VI townhouse",
    outcome:
      "As a first-time buyer I had no idea what questions to ask. Terralume held my hand through every step and the due diligence report alone was worth every naira.",
    rating: 5,
  },
  {
    name: "Corporate HR Manager",
    initials: "HR",
    location: "Multinational, Lagos",
    type: "Staff relocation — 6 rental units, Lekki",
    outcome:
      "We engaged Terralume for a bulk relocation brief. Their professionalism and data quality are unlike anything else I’ve encountered in the Lagos market.",
    rating: 5,
  },
];

const metrics = [
  { value: "120+", label: "Properties Sourced" },
  { value: "97", label: "Deals Completed" },
  { value: "12%", label: "Avg. Saving Negotiated" },
  { value: "4.9/5", label: "Client Satisfaction" },
];

export function SocialProofSection() {
  return (
    <section id="social-proof" className="bg-surface-alt py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 text-center">
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
            <span className="h-px w-8 bg-crimson" />
            Client results
            <span className="h-px w-8 bg-crimson" />
          </p>
          <h2 className="font-display text-4xl font-bold text-navy lg:text-5xl">
            Trusted by serious buyers
          </h2>
        </div>

        {/* Metrics strip */}
        <div className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-divider bg-divider lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-surface px-8 py-10 text-center">
              <span className="block font-display text-5xl font-bold leading-none text-navy">
                {m.value}
              </span>
              <span className="mt-2 block text-[12px] uppercase tracking-wider text-on-surface-muted">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-divider bg-surface p-8"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-navy/20 via-navy/8 to-transparent"
              />
              <Quote size={24} className="shrink-0 text-crimson/30" />
              <p className="flex-1 text-[15px] leading-relaxed text-on-surface">
                &ldquo;{t.outcome}&rdquo;
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className="fill-crimson text-crimson"
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-divider pt-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-navy">{t.name}</p>
                  <p className="text-[12px] text-on-surface-muted">
                    {t.location} · {t.type}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
