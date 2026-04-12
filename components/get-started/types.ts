export interface FormData {
  // Step 1 — About you
  fullName: string;
  preferredName: string;
  countryCode: string;
  phone: string;
  email: string;
  location: string;
  nationality: string;

  // Step 2 — Your goal
  transactionType: string;
  primaryPurpose: string;
  purposeOther: string;

  // Step 3 — Budget
  budgetRange: string;
  budgetNote: string;
  currency: string;
  sourceOfFunds: string;
  mortgageStatus: string;

  // Step 4 — Property
  locationPreferences: string[];
  propertyType: string;
  bedrooms: string;
  sizeMin: string;
  sizeMax: string;
  mustHaves: string[];
  dealBreakers: string;

  // Step 5 — Timeline
  targetDate: string;
  decisionSpeed: string;
  otherDecisionMakers: string;

  // Step 6 — Background
  priorExperience: string;
  riskTolerance: string;
  referralSource: string;
  referralDetail: string;

  // Step 7 — Confirmation
  dataConsent: boolean;
  marketingConsent: boolean;
}

export const INITIAL_FORM_DATA: FormData = {
  fullName: "",
  preferredName: "",
  countryCode: "+234",
  phone: "",
  email: "",
  location: "",
  nationality: "",

  transactionType: "",
  primaryPurpose: "",
  purposeOther: "",

  budgetRange: "",
  budgetNote: "",
  currency: "NGN (₦)",
  sourceOfFunds: "",
  mortgageStatus: "",

  locationPreferences: [],
  propertyType: "",
  bedrooms: "",
  sizeMin: "",
  sizeMax: "",
  mustHaves: [],
  dealBreakers: "",

  targetDate: "",
  decisionSpeed: "",
  otherDecisionMakers: "",

  priorExperience: "",
  riskTolerance: "",
  referralSource: "",
  referralDetail: "",

  dataConsent: false,
  marketingConsent: false,
};

export const TOTAL_STEPS = 7;

export const STEP_LABELS = [
  "About you",
  "Your goal",
  "Budget",
  "Property",
  "Timeline",
  "Background",
  "Confirmation",
] as const;

export const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Basic contact details — so we know who we're talking to.",
  2: "Tell us the nature and purpose of your transaction.",
  3: "Budget information helps us shortlist appropriate properties and advisory packages.",
  4: "Define the property you're looking for. Be as specific or open as you like.",
  5: "Understanding your timing helps us prioritise and resource your advisory correctly.",
  6: "A brief background helps your advisor calibrate their approach for you.",
  7: "Review your answers before submitting. You can go back to edit any section.",
};
