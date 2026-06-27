import { TrendingDown, AlertTriangle, Unplug, Merge } from "lucide-react";

const pillars = [
  {
    icon: TrendingDown,
    color: "text-crimson",
    bg: "bg-crimson/8",
    title: "Property value tied to infrastructure",
    body: "In Nigeria, a property's worth is directly linked to its access to reliable power, water, and services. Infrastructure gaps silently erode asset value — often invisibly, until a deal falls through.",
  },
  {
    icon: Unplug,
    color: "text-crimson",
    bg: "bg-crimson/8",
    title: "Energy instability reduces asset performance",
    body: "Diesel dependency inflates operating costs, reduces tenant quality, and compresses yields. An asset without stable power is not performing at its potential — regardless of its location.",
  },
  {
    icon: AlertTriangle,
    color: "text-navy",
    bg: "bg-navy/8",
    title: "Most firms treat them as separate problems",
    body: "Property advisors ignore energy. Energy companies ignore asset strategy. The result is a fragmented approach that leaves investors managing two disjointed vendors with no unified outcome.",
  },
];

export function BigIdeaSection() {
  return (
    <section className="bg-surface py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-20 max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
            <span className="h-px w-8 bg-crimson" />
            The Integrated View
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl xl:text-[52px]">
            Real Estate and Energy{" "}
            <span className="italic text-crimson">Are the Same Problem</span>
          </h2>
          <p className="mt-6 text-[18px] leading-relaxed text-on-surface-muted max-w-2xl">
            The highest-performing assets in Nigeria share one common trait —
            they solve for energy as deliberately as they solve for location.
          </p>
        </div>

        {/* Three-column pillars */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="relative rounded-2xl border border-divider bg-surface-card p-8 overflow-hidden group hover:border-navy/20 hover:shadow-sm transition-all duration-300"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-navy/4 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className={`mb-5 inline-flex rounded-xl p-3 ${p.bg}`}>
                <p.icon size={22} className={p.color} />
              </div>
              <h3 className="mb-3 font-display text-[19px] font-semibold text-navy leading-snug">
                {p.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-on-surface-muted">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-gold/25 bg-gold-light py-12 px-10 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-gold/10 p-3">
            <Merge size={22} className="text-gold" />
          </div>
          <p className="font-display text-2xl font-semibold text-navy lg:text-3xl max-w-xl leading-snug">
            Terralume solves both —{" "}
            <span className="italic text-gold">together.</span>
          </p>
          <p className="text-[16px] text-on-surface-muted max-w-lg">
            One strategic partner. Two capabilities. A single outcome: assets
            that perform.
          </p>
        </div>
      </div>
    </section>
  );
}
