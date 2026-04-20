//  Step 1: Goal 

export const TRANSACTION_TYPES = [
  { value: "rent",  label: "Rent",  desc: "Residential or short-term rental" },
  { value: "buy",   label: "Buy",   desc: "Purchase a residential or investment property" },
  { value: "lease", label: "Lease", desc: "Commercial lease or long-term agreement" },
] as const;

export const PURPOSES: Record<string, string[]> = {
  rent:  ["Personal home", "Short-term stay", "Temporary relocation", "Corporate housing"],
  buy:   ["Owner-occupied home", "Investment / rental yield", "Capital appreciation", "Land banking"],
  lease: ["Business premises", "Office space", "Retail / commercial", "Warehouse / industrial"],
};

//  Step 2: About you 

export const LOCATION_OPTIONS = [
  { value: "Lagos",          label: "Lagos, Nigeria" },
  { value: "Abuja",          label: "Abuja, Nigeria" },
  { value: "Nigeria-other",  label: "Other city in Nigeria" },
  { value: "UK",             label: "United Kingdom" },
  { value: "USA",            label: "United States" },
  { value: "Canada",         label: "Canada" },
  { value: "Europe",         label: "Europe (other)" },
  { value: "Other",          label: "Other country" },
];

//  Step 3: Property 

export const TARGET_AREAS = [
  "Lekki Phase 1", "Lekki Phase 2", "Victoria Island", "Ikoyi",
  "Ajah / Sangotedo", "Ikeja GRA", "Yaba / Surulere", "Gbagada",
  "Magodo", "Banana Island", "Chevron Drive", "Epe", "Open to advice",
];

export const PROPERTY_TYPES_RESIDENTIAL = [
  "Flat / apartment", "Terraced house", "Semi-detached", "Detached house",
  "Duplex", "Maisonette", "Land (with plans)", "New development off-plan",
];

export const PROPERTY_TYPES_LEASE = [
  "Office space", "Retail / shop", "Warehouse",
  "Mixed-use", "Industrial unit", "Entire building",
];

export const BEDROOM_OPTIONS = ["Any", "1", "2", "3", "4", "5+"];

export const MUST_HAVES_RESIDENTIAL = [
  "Gated estate", "Generator backup", "24-hr security", "BQ / staff quarters",
  "Parking", "Swimming pool", "Borehole / water", "Good road access", "Serviced / furnished",
];

export const MUST_HAVES_LEASE = [
  "Generator backup", "24-hr security", "Parking", "Lift / elevator",
  "Reception area", "Loading bay", "Flexible floor plan", "Open plan",
];

//  Step 4: Budget 

export const CURRENCIES = ["NGN", "USD", "GBP"];

export const SOURCE_OF_FUNDS = [
  "Personal savings",
  "Mortgage / bank loan",
  "Diaspora remittance / foreign earnings",
  "Business proceeds / corporate funds",
  "Joint purchase / partnership",
  "Inheritance / gift",
];

export const MORTGAGE_STATUS = [
  "Pre-approval obtained",
  "Application in progress",
  "Self-funded  no mortgage needed",
  "Not yet started",
];

//  Step 5: Timeline & background 

export const DECISION_SPEED = [
  { value: "48hrs",    label: "Within 48 hours" },
  { value: "1week",    label: "Within 1 week" },
  { value: "2-4weeks", label: "2\u20134 weeks" },
  { value: "flexible", label: "Flexible" },
];

export const DECISION_MAKERS = [
  { value: "sole",    label: "Client only",        sub: "I make this decision independently" },
  { value: "spouse",  label: "Spouse / partner",   sub: "Joint decision with a partner" },
  { value: "family",  label: "Family committee",   sub: "Multiple family members involved" },
  { value: "partner", label: "Business partner",   sub: "Investment or co-purchase partner" },
];

export const PRIOR_EXPERIENCE = [
  { value: "first-time",  label: "First time \u2014 I have never done this before" },
  { value: "smooth",      label: "Yes \u2014 went smoothly" },
  { value: "problems",    label: "Yes \u2014 encountered problems" },
  { value: "abroad-only", label: "Only bought/rented abroad, not in Nigeria" },
];

export const RISK_PROFILE = [
  { value: "conservative", label: "Conservative \u2014 capital preservation first", sub: "Protect what I have. Slow and safe." },
  { value: "moderate",     label: "Moderate \u2014 balanced growth",                sub: "Good yield with manageable risk." },
  { value: "aggressive",   label: "Growth-focused \u2014 high yield",               sub: "I can tolerate more risk for better returns." },
];

export const REFERRAL_SOURCES = [
  { value: "Referral",   label: "Personal referral" },
  { value: "LinkedIn",   label: "LinkedIn" },
  { value: "Instagram",  label: "Instagram" },
  { value: "Google",     label: "Google search" },
  { value: "WhatsApp",   label: "WhatsApp" },
  { value: "Event",      label: "Event or speaking" },
  { value: "Other",      label: "Other" },
];
