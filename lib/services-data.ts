export type TierSlug =
  | "starter"
  | "standard"
  | "premium"
  | "corporate"
  | "diaspora-remote";

export interface ServiceTier {
  slug: TierSlug;
  name: string;
  tag: string;
  tagline: string;
  forWho: string[];
  priceFrom: string;
  priceSuffix: string;
  timeline: string;
  highlight: boolean;
  inclusions: string[];
  exclusions: string[];
  comparison: {
    feature: string;
    diy: string | boolean;
    traditional: string | boolean;
    terralume: string | boolean;
  }[];
}

export const tiers: ServiceTier[] = [
  {
    slug: "starter",
    name: "Starter",
    tag: "Rental Advisory",
    tagline:
      "Expert guidance for renters and relocations — without the agent games.",
    forWho: [
      "Individuals and families relocating within Lagos",
      "Professionals moving to Lagos for work",
      "Corporate HR teams managing staff housing",
      "First-time renters navigating Lagos landlords for the first time",
    ],
    priceFrom: "₦150,000",
    priceSuffix: "per engagement",
    timeline: "2–4 weeks",
    highlight: false,
    inclusions: [
      "Dedicated Project Manager for your rental brief",
      "Full property search across your target zones",
      "Up to 10 property shortlists with comparative analysis",
      "Accompanied viewings (up to 4 properties)",
      "Landlord and agency background check",
      "Tenancy agreement review and annotation",
      "Lease negotiation on your behalf",
      "Move-in inspection report with photographic record",
      "Utility setup checklist and coordination",
    ],
    exclusions: [
      "Legal stamp duty or agency fee payments on your behalf",
      "Structural or engineering surveys",
      "Post-move-in maintenance management",
      "Properties outside Greater Lagos",
      "Commercial or industrial lease advisory",
    ],
    comparison: [
      {
        feature: "Works exclusively for the tenant/buyer",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Landlord background verification",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Independent lease review",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Price negotiation on your behalf",
        diy: "Partially",
        traditional: "Seller-biased",
        terralume: true,
      },
      {
        feature: "Accompanied viewings",
        diy: false,
        traditional: true,
        terralume: true,
      },
      {
        feature: "Move-in condition report",
        diy: false,
        traditional: false,
        terralume: true,
      },
    ],
  },
  {
    slug: "standard",
    name: "Standard",
    tag: "Purchase Advisory",
    tagline:
      "Full buyer representation for property purchases up to ₦100 million.",
    forWho: [
      "First-time property buyers in Lagos",
      "Upgrading families moving to a larger home",
      "Buyers purchasing their primary residence",
      "Anyone buying a property up to ₦100 million in value",
    ],
    priceFrom: "₦350,000",
    priceSuffix: "per engagement",
    timeline: "8–12 weeks",
    highlight: true,
    inclusions: [
      "Everything in the Starter package",
      "Dedicated Project Manager for your purchase brief",
      "Full property search — market and off-market",
      "Independent property valuation report",
      "Full title verification (C of O, Deed, Governor's Consent)",
      "Structural inspection coordination",
      "Buyer-side legal due diligence report",
      "Price negotiation with documented outcome",
      "Sale agreement review and annotation",
      "Completion management from exchange to handover",
      "90-day post-completion PM support",
    ],
    exclusions: [
      "Solicitor or legal fees (referred at cost)",
      "Stamp duty and Land Registry fees",
      "Structural engineering works",
      "Properties above ₦100 million total value",
      "Off-plan developer contract negotiation (Premium tier)",
    ],
    comparison: [
      {
        feature: "Works exclusively for the buyer",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Independent title verification",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Independent property valuation",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Legal due diligence report",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Negotiation on buyer's behalf",
        diy: "Partially",
        traditional: "Seller-biased",
        terralume: true,
      },
      {
        feature: "Completion & handover management",
        diy: false,
        traditional: "Partially",
        terralume: true,
      },
      {
        feature: "Post-completion support",
        diy: false,
        traditional: false,
        terralume: true,
      },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    tag: "Investment Advisory",
    tagline:
      "Portfolio-grade acquisition support for HNW investors and repeat buyers.",
    forWho: [
      "High-net-worth individuals building a Lagos property portfolio",
      "Investors acquiring properties above ₦100 million",
      "Buyers seeking off-market or developer-direct deals",
      "Diaspora investors requiring full remote advisory",
      "Repeat buyers wanting a dedicated long-term PM relationship",
    ],
    priceFrom: "₦750,000",
    priceSuffix: "per engagement",
    timeline: "8–16 weeks",
    highlight: false,
    inclusions: [
      "Everything in the Standard package",
      "Off-market deal access via Terralume developer and owner network",
      "Yield and ROI analysis for buy-to-let acquisitions",
      "Portfolio strategy session with senior advisor",
      "Off-plan developer contract review and escrow validation",
      "Multi-property shortlisting and comparison",
      "Dedicated senior Project Manager",
      "Priority response SLA (same-day)",
      "Quarterly portfolio review (ongoing retainer)",
      "Bespoke due diligence reporting for transactions above ₦500M",
    ],
    exclusions: [
      "Fund management or asset management services",
      "Letting management post-acquisition",
      "Loans, mortgages, or financing advisory",
      "Properties outside Nigeria",
    ],
    comparison: [
      {
        feature: "Off-market deal access",
        diy: false,
        traditional: "Partially",
        terralume: true,
      },
      {
        feature: "Yield & ROI analysis",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Off-plan contract review",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Portfolio strategy advisory",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Senior dedicated PM",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Same-day response SLA",
        diy: false,
        traditional: false,
        terralume: true,
      },
    ],
  },
  {
    slug: "corporate",
    name: "Corporate",
    tag: "Corporate Relocation",
    tagline:
      "Annual B2B relocation contracts for multinationals and large employers.",
    forWho: [
      "Multinationals with Lagos-based staff requiring executive housing",
      "HR and mobility teams managing annual relocation cycles",
      "Embassies, NGOs, and international organisations",
      "Companies with 5+ relocating employees per year",
    ],
    priceFrom: "₦2,500,000",
    priceSuffix: "annual contract from",
    timeline: "Ongoing — 12-month rolling",
    highlight: false,
    inclusions: [
      "Dedicated corporate account manager",
      "Unlimited relocation briefs within contract scope",
      "Priority processing for urgent relocations (48-hour SLA)",
      "Executive rental and purchase advisory for all staff levels",
      "Landlord background checks on all shortlisted properties",
      "Lease negotiation and review for each engagement",
      "Move-in and move-out inspection reports",
      "Centralised reporting dashboard for HR teams",
      "Quarterly contract review and SLA reporting",
      "Emergency housing advisory (same-day response)",
    ],
    exclusions: [
      "Visa advisory or immigration services",
      "Furniture, removals, or logistics coordination",
      "School or healthcare location advisory",
      "Properties outside Greater Lagos (available on request)",
    ],
    comparison: [
      {
        feature: "Dedicated corporate account manager",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Unlimited briefs within contract",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "HR reporting dashboard",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "48-hour urgent SLA",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Independent of landlord/agent",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Annual fixed-cost budgeting",
        diy: false,
        traditional: false,
        terralume: true,
      },
    ],
  },
  {
    slug: "diaspora-remote",
    name: "Diaspora Remote",
    tag: "Remote End-to-End",
    tagline:
      "Buy or rent in Lagos from anywhere in the world — completely handled.",
    forWho: [
      "Nigerians in the UK, US, Canada, UAE or elsewhere",
      "Diaspora buyers purchasing for personal use or investment",
      "Overseas buyers who cannot travel to Lagos during the process",
      "Remote buyers who have been previously defrauded or nearly defrauded",
    ],
    priceFrom: "₦500,000",
    priceSuffix: "fixed fee (rental) / from ₦850,000 (purchase)",
    timeline: "Rental: 3–5 weeks · Purchase: 10–16 weeks",
    highlight: false,
    inclusions: [
      "Full remote onboarding via video call",
      "All viewings attended and recorded on video by your PM",
      "Full written reports with photos for every inspection",
      "UK/US/UAE timezone-compatible communication",
      "Weekly video update calls with your Project Manager",
      "All document signing coordinated via secure digital channels",
      "Completion and handover managed entirely by Terralume",
      "Remote key holding and utility setup",
      "Fraud prevention layer — all vendors independently verified",
      "90-day post-completion remote PM support",
    ],
    exclusions: [
      "In-person attendance (not required — by design)",
      "FX or international money transfer services",
      "Local tax advisory (LIRS)",
      "Properties outside Lagos State",
    ],
    comparison: [
      {
        feature: "Full remote capable",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Video walkthroughs for every property",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Fraud prevention layer",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Diaspora timezone support",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Digital document signing",
        diy: false,
        traditional: false,
        terralume: true,
      },
      {
        feature: "Remote handover management",
        diy: false,
        traditional: false,
        terralume: true,
      },
    ],
  },
];

export const tierOrder: TierSlug[] = [
  "starter",
  "standard",
  "premium",
  "corporate",
  "diaspora-remote",
];
