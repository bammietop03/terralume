export interface FormData {
  // Step 1 — Goal
  transactionType: string; // rent | buy | lease
  purpose: string;

  // Step 2 — About you
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  nationality: string;
  location: string;

  // Step 3 — Property
  targetAreas: string[];
  propertyType: string;
  bedrooms: string; // non-lease only
  floorAreaSqm: string; // lease only
  mustHaves: string[];
  dealBreakers: string;

  // Step 4 — Budget
  currency: string; // NGN | USD | GBP
  budgetMin: string;
  budgetMax: string;
  sourceOfFunds: string;
  mortgageStatus: string; // buy only

  // Step 5 — Timeline & background
  targetDate: string;
  decisionSpeed: string;
  decisionMakers: string; // sole | spouse | family | partner
  priorExperience: string;
  riskProfile: string; // buy only
  referralSource: string;

  // Step 6 — Review / consent
  dataConsent: boolean;
}

export const INITIAL_FORM_DATA: FormData = {
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

export const TOTAL_STEPS = 6;

export const STEP_LABELS = [
  "Goal",
  "About you",
  "Property",
  "Budget",
  "Timeline",
  "Review",
] as const;

export const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "This determines the questions we ask. You can always change it.",
  2: "This stays strictly confidential — it helps your advisor understand your situation from the first call.",
  3: "Tell us exactly what you need. The more specific you are, the better we can shortlist.",
  4: "Your budget is confidential. We use it to find the best options within your range.",
  5: "This helps us prioritise your search and match you with the right advisor.",
  6: "Check your details before submitting. Your advisor will call within 48 hours.",
};
