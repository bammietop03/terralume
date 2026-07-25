export interface FormData {
  // Step 1 — Service Selection
  selectedServices: string[]; // ["real-estate"] | ["renewable-energy"] | ["real-estate", "renewable-energy"]

  // Step 2 — Goal (Real Estate only)
  transactionType?: string; // rent | buy | lease (conditional)
  purpose: string;

  // Step 3 — About you
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  nationality: string;
  location: string;

  // Step 4 — Property (Real Estate only)
  targetAreas: string[];
  propertyType: string;
  bedrooms: string; // non-lease only
  floorAreaSqm: string; // lease only
  mustHaves: string[];
  dealBreakers: string;

  // Energy-specific fields
  energyNeedsDescription: string; // Renewable Energy service description

  // Step 5 — Budget (conditional)
  currency: string; // NGN | USD | GBP
  budgetMin: string;
  budgetMax: string;
  sourceOfFunds: string;
  mortgageStatus: string; // buy only

  // Step 6 — Timeline & background
  targetDate: string;
  decisionSpeed: string;
  decisionMakers: string; // sole | spouse | family | partner
  priorExperience: string;
  riskProfile: string; // buy only
  referralSource: string;

  // Step 7 — Review / consent
  dataConsent: boolean;
}

export const INITIAL_FORM_DATA: FormData = {
  selectedServices: [],
  transactionType: "",
  purpose: "",

  fullName: "",
  preferredName: "",
  email: "",
  phone: "",
  nationality: "",
  location: "",

  targetAreas: [],
  propertyType: "",
  bedrooms: "",
  floorAreaSqm: "",
  mustHaves: [],
  dealBreakers: "",

  energyNeedsDescription: "",

  currency: "NGN",
  budgetMin: "",
  budgetMax: "",
  sourceOfFunds: "",
  mortgageStatus: "",

  targetDate: "",
  decisionSpeed: "",
  decisionMakers: "",
  priorExperience: "",
  riskProfile: "",
  referralSource: "",

  dataConsent: false,
};

export const TOTAL_STEPS = 7;

export const STEP_LABELS = [
  "Service",
  "Goal",
  "About you",
  "Property",
  "Budget",
  "Timeline",
  "Review",
] as const;

export const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Choose the service(s) you need. You can select one or both.",
  2: "This determines the questions we ask. You can always change it.",
  3: "This stays strictly confidential — it helps your advisor understand your situation from the first call.",
  4: "Tell us exactly what you need. The more specific you are, the better we can shortlist.",
  5: "Your budget is confidential. We use it to find the best options within your range.",
  6: "This helps us prioritise your search and match you with the right advisor.",
  7: "Check your details before submitting. Your advisor will call within 48 hours.",
};
