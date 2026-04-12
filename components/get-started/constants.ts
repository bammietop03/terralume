export const COUNTRY_CODES = [
  { code: "+234", flag: "🇳🇬", label: "Nigeria (+234)" },
  { code: "+44", flag: "🇬🇧", label: "UK (+44)" },
  { code: "+1", flag: "🇺🇸", label: "USA / Canada (+1)" },
  { code: "+971", flag: "🇦🇪", label: "UAE (+971)" },
  { code: "+61", flag: "🇦🇺", label: "Australia (+61)" },
  { code: "+27", flag: "🇿🇦", label: "South Africa (+27)" },
  { code: "+353", flag: "🇮🇪", label: "Ireland (+353)" },
  { code: "+49", flag: "🇩🇪", label: "Germany (+49)" },
  { code: "+31", flag: "🇳🇱", label: "Netherlands (+31)" },
  { code: "+33", flag: "🇫🇷", label: "France (+33)" },
  { code: "+47", flag: "🇳🇴", label: "Norway (+47)" },
  { code: "+46", flag: "🇸🇪", label: "Sweden (+46)" },
  { code: "+64", flag: "🇳🇿", label: "New Zealand (+64)" },
];

export const LOCATIONS = [
  "Nigeria — Lagos",
  "Nigeria — Abuja",
  "Nigeria — Other",
  "United Kingdom",
  "United States",
  "Canada",
  "UAE / Dubai",
  "Australia",
  "South Africa",
  "Germany",
  "Netherlands",
  "Ireland",
  "France",
  "Other (Europe)",
  "Other",
];

export const NATIONALITIES = [
  "Nigerian",
  "British",
  "American",
  "Canadian",
  "Emirati",
  "Australian",
  "South African",
  "German",
  "French",
  "Dutch",
  "Irish",
  "Norwegian",
  "Swedish",
  "New Zealander",
  "Other",
];

export const TRANSACTION_TYPES = [
  { value: "buy-primary", label: "Buy — primary residence" },
  { value: "buy-secondary", label: "Buy — secondary / holiday home" },
  { value: "invest-btl", label: "Buy-to-let investment" },
  {
    value: "invest-portfolio",
    label: "Portfolio acquisition (multiple units)",
  },
  { value: "corporate", label: "Corporate / company acquisition" },
  { value: "diaspora-remote", label: "Diaspora remote purchase" },
  { value: "not-sure", label: "Not decided yet — exploring options" },
];

export const PRIMARY_PURPOSES = [
  "Live in it immediately",
  "Live in it in the future (plan ahead)",
  "Full-time rental income",
  "Occasional rental + personal use",
  "Capital preservation (store of value)",
  "Capital appreciation only",
  "Leave it to family / estate planning",
  "Other",
];

export const CURRENCIES = [
  "NGN (₦)",
  "USD ($)",
  "GBP (£)",
  "EUR (€)",
  "AED (AED)",
];

export const BUDGET_RANGES = [
  "Under ₦50 million",
  "₦50M – ₦100M",
  "₦100M – ₦250M",
  "₦250M – ₦500M",
  "₦500M – ₦1 billion",
  "Over ₦1 billion",
  "Equivalent in foreign currency (specify below)",
];

export const SOURCE_OF_FUNDS = [
  "Personal savings",
  "Business proceeds",
  "Salary / employment income",
  "Remittance from abroad",
  "Sale of existing property",
  "Inheritance / gift",
  "Mortgage / home loan",
  "Multiple sources",
];

export const MORTGAGE_STATUS = [
  "Paying cash — no mortgage needed",
  "Pre-approved for a mortgage",
  "Exploring mortgage options",
  "Not eligible / prefer not to say",
];

export const AREA_OPTIONS = [
  "Lekki Phase 1",
  "Lekki Phase 2",
  "Victoria Island (VI)",
  "Ikoyi",
  "Ajah / Sangotedo",
  "Ikeja GRA",
  "Yaba",
  "Gbagada",
  "Surulere",
  "Banana Island",
  "Oniru / Elegushi",
  "Chevron / Lekki Right",
  "Ibeju-Lekki",
  "Not sure yet — open to recommendations",
];

export const PROPERTY_TYPES = [
  "Apartment",
  "Terraced house",
  "Semi-detached house",
  "Detached house",
  "Penthouse",
  "Duplex / maisonette",
  "Villa / waterfront",
  "Land only",
  "No preference",
];

export const BEDROOM_OPTIONS = [
  "Studio",
  "1",
  "2",
  "3",
  "4",
  "5+",
  "No preference",
];

export const MUST_HAVES = [
  "24/7 power (generator / solar)",
  "Borehole / independent water",
  "Swimming pool",
  "Fitted kitchen",
  "BQ / staff quarters",
  "Covered parking (2+ spaces)",
  "Private garden / outdoor space",
  "Gated estate / perimeter security",
  "CCTV & controlled access",
  "Concierge / facility management",
  "Close to top schools",
  "Close to hospital / clinic",
  "Sea view / waterfront",
  "Fibre internet in building",
];

export const TIMELINE_OPTIONS = [
  "Immediately — ready to move fast",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "Over 12 months",
  "Flexible — no fixed deadline",
];

export const DECISION_SPEED = [
  "I decide alone, quickly",
  "I decide alone, but I take time",
  "Joint decision with spouse / partner",
  "Multiple stakeholders (family, board)",
  "Subject to mortgage approval",
  "Subject to other property sale",
];

export const EXPERIENCE_LEVELS = [
  "First-time buyer — no prior experience",
  "1–2 prior transactions",
  "3–5 prior transactions",
  "6+ transactions / experienced investor",
];

export const RISK_TOLERANCE = [
  "Conservative — I prioritise security over yield",
  "Moderate — I want a balance of security and return",
  "Growth-oriented — higher risk is acceptable for better returns",
  "Speculative — I understand and accept high risk",
];

export const REFERRAL_SOURCES = [
  "Word of mouth (friend / family)",
  "LinkedIn",
  "Instagram",
  "Google search",
  "Online article / blog",
  "Event or seminar",
  "Previous Terralume client",
  "Other",
];

/** Referral sources that don't need a free-text detail field */
export const REFERRAL_NO_DETAIL = new Set([
  "Google search",
  "LinkedIn",
  "Instagram",
]);
