import { XCircle, CheckCircle2 } from "lucide-react";

const problems = [
  "Traditional agents are paid by the seller — they work for them, not you.",
  "Fraudulent titles, forged documents, and phantom properties are rampant.",
  "Prices are inflated with no independent data to challenge them.",
  "Buyers have no representation, no legal buffer, and no recourse.",
];

const solutions = [
  "We work exclusively for buyers — our loyalty is 100% yours.",
  "Every property is independently verified before you spend a kobo.",
  "We negotiate hard using real market intelligence, saving you millions.",
  "End-to-end support from search to title transfer, all documented.",
];

export function ProblemSolutionSection() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
            <span className="h-px w-8 bg-crimson" />
            Why it matters
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
            The Lagos market is stacked{" "}
            <span className="italic text-crimson">against buyers.</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-on-surface-muted">
            We built Terralume to fix that permanently.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT — Problem */}
          <div className="relative overflow-hidden rounded-2xl bg-navy-dark p-10 lg:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-crimson/8 blur-3xl"
            />
            <div className="relative">
              <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-crimson/12 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-crimson">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                The problem
              </span>
              <p className="mb-10 font-display text-[22px] font-semibold leading-snug text-white">
                Traditional agents work for sellers.{" "}
                <span className="text-white/60">
                  You have no one in your corner.
                </span>
              </p>
              <ul className="space-y-5">
                {problems.map((p) => (
                  <li key={p} className="flex items-start gap-4">
                    <XCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-crimson"
                    />
                    <span className="text-[15px] leading-relaxed text-white/80">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — Solution */}
          <div className="relative overflow-hidden rounded-2xl border border-divider bg-surface-card p-10 lg:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 rounded-full bg-navy/5 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-navy via-navy/40 to-transparent"
            />
            <div className="relative">
              <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-navy/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-navy">
                <span className="h-1.5 w-1.5 rounded-full bg-navy" />
                The Terralume difference
              </span>
              <p className="mb-10 font-display text-[22px] font-semibold leading-snug text-navy-dark">
                100% buyer loyalty.{" "}
                <span className="text-navy/70">
                  Every transaction. No exceptions.
                </span>
              </p>
              <ul className="space-y-5">
                {solutions.map((s) => (
                  <li key={s} className="flex items-start gap-4">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-navy"
                    />
                    <span className="text-[15px] leading-relaxed text-on-surface">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
