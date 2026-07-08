import { User, Globe, HardHat, Building, Landmark } from "lucide-react";

const segments = [
  {
    icon: User,
    title: "Individual Investors",
    description:
      "High-net-worth individuals seeking credible acquisition support, independent due diligence, and access to off-market opportunities in Lagos and beyond.",
    tags: ["Acquisition", "Due Diligence", "Advisory"],
  },
  {
    icon: Globe,
    title: "Diaspora Clients",
    description:
      "Nigerians abroad investing remotely — we serve as trusted eyes on the ground, managing the entire process from brief to title transfer with full documentation.",
    tags: ["Remote Acquisition", "Title Verification", "Representation"],
  },
  {
    icon: HardHat,
    title: "Developers",
    description:
      "Development firms requiring land acquisition, infrastructure strategy, and energy systems integration for new residential or mixed-use projects.",
    tags: ["Land Sourcing", "Energy EaaS", "Mini Grid"],
  },
  {
    icon: Building,
    title: "Estate Managers",
    description:
      "Property managers seeking to upgrade estate energy infrastructure, reduce diesel dependency, and deliver better amenities to residents without capital outlay.",
    tags: ["Estate Energy", "Subscription Model", "Cost Reduction"],
  },
  {
    icon: Landmark,
    title: "Institutional Clients",
    description:
      "Corporate tenants, funds, and organisations requiring bulk acquisition, energy audits, and strategic portfolio advisory at scale.",
    tags: ["Portfolio Advisory", "Bulk Acquisition", "Commercial Energy"],
  },
];

export function WhoWeServeSection() {
  return (
    <section className="bg-navy-dark py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-8 bg-gold" />
            Who We Serve
            <span className="h-px w-8 bg-gold" />
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-white lg:text-5xl">
            Built for{" "}
            <span className="italic text-gold">Serious Stakeholders</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-white/50">
            We work with clients who expect institutional-grade advisory — not
            standard agency services.
          </p>
        </div>

        {/* Segment cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {segments.slice(0, 3).map((s) => (
            <SegmentCard key={s.title} segment={s} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-2xl lg:mx-auto">
          {segments.slice(3).map((s) => (
            <SegmentCard key={s.title} segment={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SegmentCard({ segment }: { segment: (typeof segments)[number] }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-8 hover:border-white/15 hover:bg-white/6 transition-all duration-300">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <div className="relative">
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
          <segment.icon size={20} className="text-gold/80" />
        </div>
        <h3 className="mb-3 font-display text-[20px] font-semibold text-white leading-snug">
          {segment.title}
        </h3>
        <p className="mb-6 text-[14px] leading-relaxed text-white/45">
          {segment.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {segment.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
