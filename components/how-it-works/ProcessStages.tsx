import {
  ClipboardList,
  Users,
  Search,
  Binoculars,
  ShieldCheck,
  TrendingDown,
  FileSignature,
  KeyRound,
  FileText,
  CheckCircle2,
} from "lucide-react";

type Responsible = "Terralume Team" | "Project Manager" | "Client";

interface Stage {
  type: "stage";
  number: string;
  name: string;
  timeline: string;
  responsible: Responsible[];
  actions: string[];
  documents: string[];
  icon: React.ReactNode;
}

interface Gate {
  type: "gate";
  label: string;
  name: string;
  description: string;
  checks: string[];
  unlocks: string;
}

type ProcessItem = Stage | Gate;

const responsibleStyle: Record<Responsible, string> = {
  "Terralume Team": "bg-crimson/8 text-crimson border border-crimson/20",
  "Project Manager": "bg-navy/8 text-navy border border-navy/15",
  Client: "bg-surface-alt text-on-surface-muted border border-divider",
};

const items: ProcessItem[] = [
  {
    type: "stage",
    number: "01",
    name: "Initial Enquiry & Brief",
    timeline: "Day 1",
    responsible: ["Client", "Terralume Team"],
    icon: <ClipboardList size={20} />,
    actions: [
      "Submit the online intake form with your property requirements",
      "Receive a callback from Terralume within 2 working hours",
      "30-minute discovery call to assess budget, timeline, and fit",
      "Scope of engagement explained — fees, process, and expectations",
      "Engagement Letter prepared and sent for review",
    ],
    documents: ["Client Intake Form", "Engagement Letter"],
  },
  {
    type: "gate",
    label: "Gate 1",
    name: "Qualification",
    description:
      "Terralume reviews your brief against our service remit. We only take on engagements where we can genuinely add value.",
    checks: [
      "Budget is aligned with the target market",
      "Timeline is realistic for the property type",
      "Engagement Letter signed and retainer received",
    ],
    unlocks: "PM assignment and Strategy Briefing",
  },
  {
    type: "stage",
    number: "02",
    name: "Client Onboarding & Strategy",
    timeline: "Days 2–5",
    responsible: ["Project Manager"],
    icon: <Users size={20} />,
    actions: [
      "Dedicated Project Manager formally assigned to your case",
      "Full onboarding call — goals, constraints, and non-negotiables",
      "Market orientation: current pricing, supply, and demand dynamics",
      "Target property profile defined and agreed in writing",
      "Reporting cadence set (weekly updates minimum)",
    ],
    documents: [
      "Strategy Document",
      "Property Search Brief",
      "Signed Service Agreement",
    ],
  },
  {
    type: "stage",
    number: "03",
    name: "Property Search & Shortlisting",
    timeline: "Weeks 1–3",
    responsible: ["Terralume Team", "Project Manager"],
    icon: <Search size={20} />,
    actions: [
      "Active market scouting across Lekki, Ikoyi, V/I, Ajah, and other target zones",
      "Agent network activation — over 200 vetted agents in our network",
      "Off-market outreach directly to property owners",
      "Developer liaison for new-build and off-plan options",
      "Viewing arrangements coordinated and accompanied where required",
      "Shortlist of 3–5 best-fit properties compiled",
    ],
    documents: [
      "Property Shortlist Report",
      "Comparative Market Analysis",
      "Viewing Notes",
    ],
  },
  {
    type: "gate",
    label: "Gate 2",
    name: "Activation",
    description:
      "You review the shortlist and select a target property. Terralume is formally activated to proceed on that specific property.",
    checks: [
      "Client has reviewed all shortlisted properties",
      "Target property selected and confirmed in writing",
      "Budget confirmed against asking or guide price",
    ],
    unlocks: "Property inspection and full due diligence",
  },
  {
    type: "stage",
    number: "04",
    name: "Property Inspection & Assessment",
    timeline: "Weeks 3–4",
    responsible: ["Project Manager", "Client"],
    icon: <Binoculars size={20} />,
    actions: [
      "Physical site visit with your Project Manager present",
      "Structural inspection by a licensed building surveyor",
      "Neighbourhood and environment assessment (flood risk, access, noise)",
      "Utilities verification — electricity, water, gas where applicable",
      "Access rights and legal easement review",
      "Defects and condition report compiled",
    ],
    documents: [
      "Site Inspection Report",
      "Structural Assessment Summary",
      "Neighbourhood Assessment",
    ],
  },
  {
    type: "stage",
    number: "05",
    name: "Title & Legal Due Diligence",
    timeline: "Weeks 4–6",
    responsible: ["Terralume Team"],
    icon: <ShieldCheck size={20} />,
    actions: [
      "Land Registry title search and records verification",
      "Certificate of Occupancy (C of O) or Deed of Assignment authentication",
      "Governor's Consent status confirmed",
      "Planning consent and development approval status checked",
      "Encumbrances, caveats, and third-party claims searched",
      "Vendor identity and ownership chain independently verified",
    ],
    documents: [
      "Title Verification Report",
      "Legal Due Diligence Summary",
      "Vendor Identity Report",
    ],
  },
  {
    type: "gate",
    label: "Gate 3",
    name: "Due Diligence Cleared",
    description:
      "All title, legal, and structural checks must pass before we proceed. If issues are found, Terralume will advise on remediation options or recommend walking away.",
    checks: [
      "Title is clean with no encumbrances or disputes",
      "Vendor ownership chain verified and complete",
      "Structural inspection passed or issues documented and priced",
      "No material legal or planning consent issues outstanding",
    ],
    unlocks: "Price negotiation and offer submission",
  },
  {
    type: "stage",
    number: "06",
    name: "Valuation & Price Negotiation",
    timeline: "Weeks 6–7",
    responsible: ["Terralume Team", "Project Manager"],
    icon: <TrendingDown size={20} />,
    actions: [
      "Independent market valuation commissioned",
      "Comparable sales and rental yield analysis prepared",
      "Negotiation strategy developed and agreed with you",
      "Formal offer submitted on your behalf in writing",
      "Counter-offer management until best price is secured",
      "Full negotiation summary documented for your records",
    ],
    documents: [
      "Independent Valuation Report",
      "Offer Letter",
      "Negotiation Summary",
    ],
  },
  {
    type: "stage",
    number: "07",
    name: "Legal Exchange & Documentation",
    timeline: "Weeks 7–10",
    responsible: ["Terralume Team", "Client"],
    icon: <FileSignature size={20} />,
    actions: [
      "Draft Sale Agreement reviewed and annotated by Terralume",
      "Payment schedule structured to protect your interests",
      "Governor's Consent application coordinated",
      "Stamp Duty payment and Lodge-in at Land Registry coordinated",
      "All signings coordinated and witnessed",
      "Final title document authenticated post-completion",
    ],
    documents: [
      "Sale Agreement / Deed of Assignment",
      "Payment Schedule",
      "Stamp Duty Receipt",
      "Governor's Consent",
    ],
  },
  {
    type: "gate",
    label: "Gate 4",
    name: "Completion",
    description:
      "The final gate. All payments are confirmed, all documents are executed, title is transferred in your name. Only then do we call it complete.",
    checks: [
      "All purchase payments confirmed and receipted",
      "Sale Agreement / Deed of Assignment fully executed",
      "Governor's Consent obtained or formally in progress",
      "Title document in buyer's name confirmed at Land Registry",
    ],
    unlocks: "Keys handover and aftercare",
  },
  {
    type: "stage",
    number: "08",
    name: "Handover & Aftercare",
    timeline: "Week 10+",
    responsible: ["Project Manager", "Client"],
    icon: <KeyRound size={20} />,
    actions: [
      "Formal keys handover ceremony with all parties present",
      "Utility transfers coordinated (EKEDC/IBEDC, water, internet)",
      "Final walkthrough and defects snag list agreed with vendor",
      "PM available for 90 days post-completion for any queries",
      "Terralume aftercare team support for post-completion issues",
    ],
    documents: [
      "Completion Certificate",
      "Handover Checklist",
      "90-Day Aftercare Support Guide",
    ],
  },
];

export function ProcessStages() {
  return (
    <section className="bg-surface py-24 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <div className="space-y-4">
          {items.map((item, idx) => {
            if (item.type === "gate") {
              return (
                <div
                  key={item.name}
                  className="relative overflow-hidden rounded-2xl bg-navy-dark px-10 py-8"
                >
                  {/* Left accent bar */}
                  <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-crimson" />
                  {/* Glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-crimson/6 blur-3xl"
                  />
                  <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
                    {/* Gate badge + name */}
                    <div className="shrink-0 lg:w-56">
                      <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-crimson px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        {item.label}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white">
                        {item.name}
                      </h3>
                    </div>
                    {/* Body */}
                    <div className="flex-1">
                      <p className="mb-5 text-[15px] leading-relaxed text-white/60">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-white/30">
                            Checks required
                          </p>
                          <ul className="space-y-1.5">
                            {item.checks.map((c) => (
                              <li
                                key={c}
                                className="flex items-start gap-2 text-[13px] text-white/60"
                              >
                                <CheckCircle2
                                  size={13}
                                  className="mt-0.5 shrink-0 text-crimson/60"
                                />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-white/30">
                            Unlocks
                          </p>
                          <p className="text-[13px] font-semibold text-white/70">
                            → {item.unlocks}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Stage card
            return (
              <div
                key={item.number}
                className="relative overflow-hidden rounded-2xl border border-divider bg-surface"
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-navy/20 via-navy/8 to-transparent" />
                {/* Watermark number */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-4 -top-3 select-none font-display text-8xl font-bold leading-none text-navy/4"
                >
                  {item.number}
                </span>

                <div className="relative p-8 lg:p-10">
                  {/* Stage header row */}
                  <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-navy/8 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-navy">
                            Stage {item.number}
                          </span>
                          <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[11px] font-semibold text-on-surface-muted border border-divider">
                            {item.timeline}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-navy lg:text-2xl">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    {/* Responsible parties */}
                    <div className="flex flex-wrap gap-2">
                      {item.responsible.map((r) => (
                        <span
                          key={r}
                          className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${responsibleStyle[r]}`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
                    {/* Key actions */}
                    <div>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">
                        Key Actions
                      </p>
                      <ul className="space-y-2.5">
                        {item.actions.map((a) => (
                          <li
                            key={a}
                            className="flex items-start gap-3 text-[14px] text-on-surface"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Documents produced */}
                    <div>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">
                        Documents Produced
                      </p>
                      <ul className="space-y-2">
                        {item.documents.map((d) => (
                          <li
                            key={d}
                            className="flex items-center gap-2.5 rounded-xl border border-divider bg-surface-alt px-3.5 py-2.5 text-[13px] font-medium text-on-surface"
                          >
                            <FileText
                              size={13}
                              className="shrink-0 text-navy"
                            />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
