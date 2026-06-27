import { TrendingUp, Users, BarChart2, Star, Quote } from "lucide-react";

const metrics = [
  {
    icon: TrendingUp,
    value: "120+",
    label: "Transactions",
    detail: "Property deals sourced, negotiated, and closed",
  },
  {
    icon: Users,
    value: "67",
    label: "Active Clients",
    detail: "Investors, developers, and diaspora clients currently engaged",
  },
  {
    icon: BarChart2,
    value: "12%",
    label: "ROI Range",
    detail: "Average investment return across portfolio transactions",
  },
  {
    icon: Star,
    value: "4.5/5",
    label: "Satisfaction",
    detail: "Client-reported satisfaction across all engagements",
  },
];

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

export function ProofMetricsSection() {
  return (
    <section className="bg-surface py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center max-w-xl mx-auto">
          <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
            <span className="h-px w-8 bg-crimson" />
            Track Record
            <span className="h-px w-8 bg-crimson" />
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
            Performance You Can{" "}
            <span className="italic text-crimson">Measure</span>
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 gap-px bg-divider overflow-hidden rounded-3xl border border-divider sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="relative flex flex-col items-center justify-center bg-surface p-12 text-center group overflow-hidden hover:bg-surface-alt transition-colors duration-300"
            >
              {/* Accent top border on first */}
              {i === 0 && (
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-navy via-crimson to-transparent"
                />
              )}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-light group-hover:bg-navy/15 transition-colors duration-300">
                <m.icon size={22} className="text-navy" />
              </div>
              <span className="font-display text-[52px] font-bold leading-none text-navy lg:text-[58px]">
                {m.value}
              </span>
              <span className="mt-2 text-[13px] font-semibold uppercase tracking-widest text-on-surface-muted">
                {m.label}
              </span>
              <p className="mt-3 text-[13px] leading-relaxed text-on-surface-muted/70 max-w-45">
                {m.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 pt-12">
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
