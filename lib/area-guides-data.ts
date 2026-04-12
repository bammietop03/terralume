export type AreaSlug =
  | "lekki-phase-1"
  | "lekki-phase-2"
  | "victoria-island"
  | "ikoyi"
  | "ajah-sangotedo"
  | "ikeja-gra"
  | "yaba"
  | "gbagada"
  | "surulere";

export type RatingLevel = 1 | 2 | 3 | 4 | 5;
export type RecommendationTier =
  | "strong-buy"
  | "buy"
  | "consider"
  | "caution"
  | "avoid";

export interface PropertyTypeSplit {
  type: string;
  notes: string;
}

export interface PriceRange {
  label: string;
  low: string;
  high: string;
  unit: string; // e.g. "per sqm", "per year"
}

export interface InfrastructureRatings {
  roads: RatingLevel;
  power: RatingLevel;
  water: RatingLevel;
  internet: RatingLevel;
  security: RatingLevel;
}

export interface RiskRating {
  score: RatingLevel; // 1 = very low, 5 = very high
  label: string;
  detail: string;
}

export interface NearbyFacility {
  category: string;
  examples: string[];
}

export interface AreaGuide {
  slug: AreaSlug;
  name: string;
  shortName: string;
  zone: "island" | "mainland" | "peri-urban";
  tagline: string;
  summary: string;
  image: string;

  buyPrices: PriceRange[];
  rentPrices: PriceRange[];

  propertyTypes: PropertyTypeSplit[];

  infrastructure: InfrastructureRatings;

  floodRisk: RiskRating;
  omoOnileRisk: RiskRating;

  proximityMinutes: {
    to: string;
    minutes: string;
    note?: string;
  }[];

  nearbyFacilities: NearbyFacility[];

  pros: string[];
  cons: string[];

  recommendation: RecommendationTier;
  recommendationRationale: string;

  bestFor: string[];

  titleSecurity: RatingLevel; // 1 = poor, 5 = excellent
  titleNote: string;

  terralumesActivity: string; // how active TL is here
}

export const RECOMMENDATION_CONFIG: Record<
  RecommendationTier,
  { label: string; color: string; textColor: string; description: string }
> = {
  "strong-buy": {
    label: "Strong Buy",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    description:
      "Excellent combination of title security, infrastructure, and value.",
  },
  buy: {
    label: "Buy",
    color: "bg-navy-light",
    textColor: "text-navy",
    description: "Solid choice for most buyers. Minor considerations apply.",
  },
  consider: {
    label: "Consider",
    color: "bg-amber-50",
    textColor: "text-amber-700",
    description: "Good options available but requires careful selection.",
  },
  caution: {
    label: "Proceed with Caution",
    color: "bg-orange-50",
    textColor: "text-orange-700",
    description: "Meaningful risks present. Professional advisory essential.",
  },
  avoid: {
    label: "Avoid",
    color: "bg-crimson-light",
    textColor: "text-crimson",
    description: "Risks outweigh benefits for most buyer profiles.",
  },
};

export const areaGuides: AreaGuide[] = [
  /* ── Lekki Phase 1 ──────────────────────────────────── */
  {
    slug: "lekki-phase-1",
    name: "Lekki Phase 1",
    shortName: "Lekki Ph. 1",
    zone: "island",
    tagline:
      "Lagos's most liquid residential market — strong titles, deep demand.",
    summary:
      "Lekki Phase 1 is the most active mid-to-premium residential zone on the Lagos Island corridor. Sustained developer investment, strong rental demand from professionals and expats, and a high prevalence of C of O titles make it the most straightforward area for buyers seeking a balance of value, security, and liquidity.",
    image: "/images/hero.png",

    buyPrices: [
      {
        label: "Apartments (existing stock)",
        low: "₦300,000",
        high: "₦550,000",
        unit: "per sqm",
      },
      {
        label: "Apartments (new build)",
        low: "₦500,000",
        high: "₦750,000",
        unit: "per sqm",
      },
      {
        label: "Detached / semi-detached",
        low: "₦600,000",
        high: "₦950,000",
        unit: "per sqm",
      },
      {
        label: "Terraced houses",
        low: "₦420,000",
        high: "₦680,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "1-bedroom apartment",
        low: "₦1.8M",
        high: "₦3.5M",
        unit: "per year",
      },
      {
        label: "2-bedroom apartment",
        low: "₦3.0M",
        high: "₦6.0M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦5.0M",
        high: "₦10M",
        unit: "per year",
      },
      {
        label: "4-bedroom detached",
        low: "₦12M",
        high: "₦25M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Apartments (most common)",
        notes:
          "Ranging from studio to 4-bed; new-build and resale stock both widely available",
      },
      {
        type: "Terraced houses",
        notes: "Popular gated estate format; good security, shared facilities",
      },
      {
        type: "Semi-detached houses",
        notes: "Less common; commands premium over terraced equivalents",
      },
      {
        type: "Detached houses (limited)",
        notes: "Limited stock; most on secondary roads; high demand",
      },
    ],

    infrastructure: {
      roads: 4,
      power: 3,
      water: 3,
      internet: 5,
      security: 4,
    },

    floodRisk: {
      score: 2,
      label: "Low – Moderate",
      detail:
        "Most of Lekki Phase 1 is on elevated ground relative to the lagoon. Some low-lying estates near the lagoon edge flood seasonally. Buyers should confirm the specific plot elevation before purchase.",
    },
    omoOnileRisk: {
      score: 1,
      label: "Very Low",
      detail:
        "Lekki Phase 1 is one of the most formally titled areas in Lagos. Omo-onile interference is rare due to the high prevalence of C of O titles and established estate boundaries.",
    },

    proximityMinutes: [
      {
        to: "Victoria Island (business)",
        minutes: "15–35 min",
        note: "Traffic dependent; Adetokunbo Ademola St corridor",
      },
      { to: "Ikoyi", minutes: "10–25 min" },
      { to: "Lagos Island (CBD)", minutes: "30–50 min" },
      { to: "Lekki-Epe Expressway", minutes: "5–10 min" },
      { to: "MMA2 (Domestic Airport)", minutes: "45–70 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "Greensprings School",
          "Chrisland College",
          "Lead British International School",
        ],
      },
      {
        category: "Hospitals",
        examples: [
          "Lagoon Hospital Lekki",
          "St. Nicholas Hospital",
          "Reddington Hospital",
        ],
      },
      {
        category: "Shopping",
        examples: ["Circle Mall", "Lekki Market", "Novare Lekki Mall"],
      },
      {
        category: "Recreation",
        examples: [
          "Lekki Conservation Centre",
          "Oniru Private Beach",
          "Landmark Beach",
        ],
      },
    ],

    pros: [
      "Highest concentration of C of O-titled properties in Lagos outside Ikoyi/VI",
      "Deep rental market with consistent demand from professionals and expats",
      "Strong capital appreciation — 10–15% per year in naira terms over past 3 years",
      "Wide variety of property types and price points",
      "Strong developer pipeline driving new supply",
    ],
    cons: [
      "Traffic congestion on Admiralty Way and Lekki-Epe Expressway during peak hours",
      "PHCN power supply remains unreliable; diesel generator costs are significant",
      "Some estates have high service charge obligations",
      "New-build prices approaching Ikoyi levels in premium pockets",
    ],

    recommendation: "strong-buy",
    recommendationRationale:
      "Lekki Phase 1 offers the best risk-adjusted combination of title security, rental yield (5–8% gross), capital appreciation, and transaction liquidity of any Lagos residential zone. Suitable for owner-occupiers and investors at most budget levels.",

    bestFor: [
      "First-time buyers seeking a safe entry point",
      "Buy-to-let investors seeking consistent rental demand",
      "Diaspora buyers wanting strong title security with remote purchase",
      "Corporate HR teams placing professional staff",
    ],

    titleSecurity: 5,
    titleNote:
      "The majority of properties in Lekki Phase 1 carry a C of O or Governor's Consent. Title verification is still mandatory — but the risk of unresolvable title defects is significantly lower than in most other Lagos zones.",

    terralumesActivity:
      "Lekki Phase 1 accounts for approximately 35% of all Terralume buyer advisory engagements by volume.",
  },

  /* ── Lekki Phase 2 ──────────────────────────────────── */
  {
    slug: "lekki-phase-2",
    name: "Lekki Phase 2",
    shortName: "Lekki Ph. 2",
    zone: "island",
    tagline: "More space, lower prices — but a more complex title landscape.",
    summary:
      "Lekki Phase 2 offers larger plots and lower prices than Phase 1, attracting buyers priced out of Phase 1. However, the area has a significantly higher proportion of untitled or family land, and infrastructure lags substantially behind Phase 1. The risk-reward ratio is less favourable for buyers without professional guidance.",
    image: "/images/image1.jpg",

    buyPrices: [
      {
        label: "Apartments",
        low: "₦200,000",
        high: "₦380,000",
        unit: "per sqm",
      },
      {
        label: "Terraced / semi-detached",
        low: "₦250,000",
        high: "₦420,000",
        unit: "per sqm",
      },
      {
        label: "Detached houses",
        low: "₦300,000",
        high: "₦500,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "2-bedroom apartment",
        low: "₦1.5M",
        high: "₦3.0M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦2.5M",
        high: "₦5.0M",
        unit: "per year",
      },
      {
        label: "4-bedroom house",
        low: "₦6.0M",
        high: "₦14M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Gated estate housing",
        notes:
          "Best option for title security; buy within a registered estate where possible",
      },
      {
        type: "Stand-alone houses",
        notes: "Vary significantly in title status; due diligence critical",
      },
      {
        type: "Apartments",
        notes: "Fewer in supply than Phase 1; mostly developer-built new stock",
      },
    ],

    infrastructure: {
      roads: 3,
      power: 2,
      water: 2,
      internet: 4,
      security: 3,
    },

    floodRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Portions of Lekki Phase 2 are on lower-lying or reclaimed ground. Seasonal flooding is documented in several localities. Elevation confirmation from a structural engineer is essential before purchase.",
    },
    omoOnileRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "A meaningful portion of land in Lekki Phase 2 remains on family or community ownership with incomplete documentation. Omo-onile interference has been reported on construction sites. Title verification must extend beyond document review to physical boundary confirmation.",
    },

    proximityMinutes: [
      { to: "Lekki Phase 1", minutes: "10–20 min" },
      {
        to: "Victoria Island",
        minutes: "30–55 min",
        note: "Traffic highly variable",
      },
      { to: "Ajah junction", minutes: "15–25 min" },
      { to: "MMA2 (Domestic Airport)", minutes: "60–90 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "Crown Estate Nursery & Primary",
          "Dominion University",
          "Meadow Hall",
        ],
      },
      {
        category: "Hospitals",
        examples: [
          "Lekki Phase 2 Medical Centre",
          "St. Ives Specialist Hospital",
        ],
      },
      {
        category: "Shopping",
        examples: [
          "Shoprite Lekki",
          "Circle Mall (nearby)",
          "Lekki Phase 2 Market",
        ],
      },
    ],

    pros: [
      "Larger plot sizes and houses for equivalent spend compared to Phase 1",
      "Significant infrastructure investment ongoing — road widening projects",
      "Entry prices accessible for first-time buyers and investors",
      "Proximity to Ajah and the expanding Lekki-Epe corridor",
    ],
    cons: [
      "Higher proportion of untitled and family land relative to Phase 1",
      "Power supply among the least reliable on the Island",
      "Significant traffic congestion on the single main access road",
      "Slower rental market than Phase 1; longer void periods for landlords",
    ],

    recommendation: "consider",
    recommendationRationale:
      "Lekki Phase 2 offers price accessibility but carries material title and infrastructure risk. Buyers should restrict their search to properties within registered, titled estates and conduct rigorous independent title verification. Not recommended for buyers who need certainty above capital efficiency.",

    bestFor: [
      "Buyers seeking larger properties at lower per-sqm prices",
      "Long-term investors comfortable with a 5–10 year holding horizon",
      "Buyers targeting properties within reputable gated estates specifically",
    ],

    titleSecurity: 3,
    titleNote:
      "Title security varies dramatically by specific property. Registered estate properties are generally well-titled; stand-alone properties require extensive verification. Never purchase Lekki Phase 2 land without an independent Land Registry search.",

    terralumesActivity:
      "Terralume advises buyers in Lekki Phase 2 only for properties within registered gated estates or with demonstrably clean title chains.",
  },

  /* ── Victoria Island ────────────────────────────────── */
  {
    slug: "victoria-island",
    name: "Victoria Island",
    shortName: "VI",
    zone: "island",
    tagline:
      "Lagos's premier commercial-residential address — premium in every metric.",
    summary:
      "Victoria Island is the heart of corporate Lagos — home to the highest concentration of multinationals, embassies, and high-end residential developments. Prices reflect the premium positioning. Title security is among the highest in Lagos, and the rental market is dominated by corporate lease demand, which provides consistent yields.",
    image: "/images/hero.png",

    buyPrices: [
      {
        label: "Studios & 1-bed apartments",
        low: "₦500,000",
        high: "₦850,000",
        unit: "per sqm",
      },
      {
        label: "2–3 bed executive apartments",
        low: "₦650,000",
        high: "₦1,100,000",
        unit: "per sqm",
      },
      {
        label: "Penthouses & premium units",
        low: "₦1,000,000",
        high: "₦2,200,000",
        unit: "per sqm",
      },
      {
        label: "Commercial-residential duplexes",
        low: "₦800,000",
        high: "₦1,400,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "1-bedroom apartment",
        low: "₦4.0M",
        high: "₦9.0M",
        unit: "per year",
      },
      {
        label: "2–3 bedroom apartment",
        low: "₦7.0M",
        high: "₦18M",
        unit: "per year",
      },
      {
        label: "Executive 3–4 bed (serviced)",
        low: "₦20M",
        high: "₦60M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "High-rise apartments",
        notes:
          "Dominant format; most carry service charges for building management",
      },
      {
        type: "Serviced apartments",
        notes:
          "Premium segment; typically transacted in USD; high corporate lease demand",
      },
      {
        type: "Duplexes / townhouses",
        notes: "Limited supply; often used as combined office-residence",
      },
      {
        type: "Commercial-residential mixed use",
        notes: "Common in older VI stock; zoning review essential",
      },
    ],

    infrastructure: {
      roads: 4,
      power: 4,
      water: 4,
      internet: 5,
      security: 5,
    },

    floodRisk: {
      score: 2,
      label: "Low – Moderate",
      detail:
        "VI is generally well-drained with established storm drainage infrastructure. Some low-lying pockets near Eko Atlantic boundary and Bar Beach have experienced surge flooding. Check drainage records for specific buildings.",
    },
    omoOnileRisk: {
      score: 1,
      label: "Very Low",
      detail:
        "Victoria Island has among the strongest title documentation in Lagos, with most properties on Federal Government or Lagos State-issued long leases. Omo-onile activity is extremely rare.",
    },

    proximityMinutes: [
      { to: "Ikoyi", minutes: "5–15 min" },
      { to: "Lekki Phase 1", minutes: "15–30 min" },
      { to: "Lagos Island (CBD)", minutes: "15–25 min" },
      { to: "Murtala Muhammed Int'l Airport", minutes: "50–75 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "American International School Lagos",
          "British International School Lagos",
        ],
      },
      {
        category: "Hospitals",
        examples: [
          "Reddington Hospital",
          "Eko Hospital",
          "The Clinic Hospital",
        ],
      },
      {
        category: "Business",
        examples: [
          "Shell Nigeria HQ",
          "Chevron HQ",
          "Standard Chartered",
          "multiple embassy row",
        ],
      },
      {
        category: "Leisure",
        examples: ["Eko Hotel & Suites", "Hard Rock Cafe", "Eko Atlantic City"],
      },
    ],

    pros: [
      "Highest title security and legal documentation standards in Lagos",
      "Strong corporate rental demand with USD-denominated lease options",
      "Excellent infrastructure by Lagos standards — roads, power, water",
      "Premium resale market with international buyer demand",
      "Proximity to all major corporate headquarters",
    ],
    cons: [
      "Among the highest entry prices in Lagos — limited accessibility",
      "Predominantly apartment market; limited family housing",
      "High service charge obligations on premium buildings",
      "Traffic congestion during business hours is severe",
      "Many older buildings require significant capital expenditure on maintenance",
    ],

    recommendation: "buy",
    recommendationRationale:
      "VI offers the strongest combination of title security, infrastructure quality, and corporate rental demand in Lagos. Entry prices are high but justified by market depth and demand stability. Optimal for buyers targeting corporate let income or USD-denominated returns.",

    bestFor: [
      "HNW investors targeting corporate lease income",
      "Multinationals seeking executive accommodation for senior staff",
      "Buyers pricing in USD who want maximum title security",
      "Buy-to-let investors targeting the expat and diplomatic market",
    ],

    titleSecurity: 5,
    titleNote:
      "Victoria Island properties are predominantly on government-granted leases with strong documentation. Independent verification remains essential, but the risk of unresolvable title defects is lower than anywhere else in Lagos.",

    terralumesActivity:
      "VI accounts for approximately 20% of Terralume's Premium and Corporate advisory engagements.",
  },

  /* ── Ikoyi ─────────────────────────────────────────── */
  {
    slug: "ikoyi",
    name: "Ikoyi",
    shortName: "Ikoyi",
    zone: "island",
    tagline:
      "Lagos's most exclusive address — old money, new development, unrivalled prestige.",
    summary:
      "Ikoyi is Lagos's uncontested premium residential address, combining Old Ikoyi's mature Government Reserved Area status with significant new ultra-luxury developer activity. It commands Lagos's highest per-square-metre prices and has the deepest pool of HNW and international buyers. Title security is excellent; infrastructure is the best available in Nigeria's private sector.",
    image: "/images/image1.jpg",

    buyPrices: [
      {
        label: "Established apartments",
        low: "₦700,000",
        high: "₦1,200,000",
        unit: "per sqm",
      },
      {
        label: "New luxury apartments",
        low: "₦1,200,000",
        high: "₦1,800,000",
        unit: "per sqm",
      },
      {
        label: "Detached GRA houses",
        low: "₦1,500,000",
        high: "₦3,000,000+",
        unit: "per sqm",
      },
      {
        label: "Waterfront / Banana Island adjacent",
        low: "₦1,800,000",
        high: "₦4,000,000+",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "2-bedroom apartment",
        low: "₦10M",
        high: "₦25M",
        unit: "per year",
      },
      {
        label: "3–4 bedroom apartment",
        low: "₦18M",
        high: "₦60M",
        unit: "per year",
      },
      {
        label: "Detached house (full)",
        low: "₦50M",
        high: "₦200M+",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Luxury apartments (dominant new stock)",
        notes: "Typically USD-priced; many with concierge, swimming pool, gym",
      },
      {
        type: "GRA detached houses",
        notes:
          "Older stock on large plots; high land value even for renovations",
      },
      {
        type: "Waterfront villas",
        notes:
          "Very limited supply; transacted privately; rarely listed publicly",
      },
      {
        type: "Serviced residential complexes",
        notes: "Growing segment driven by multinational demand",
      },
    ],

    infrastructure: {
      roads: 5,
      power: 5,
      water: 5,
      internet: 5,
      security: 5,
    },

    floodRisk: {
      score: 1,
      label: "Very Low",
      detail:
        "Old Ikoyi GRA is elevated and well-drained. No significant flood history except in exceptionally severe weather events. Flood risk is negligible for most properties.",
    },
    omoOnileRisk: {
      score: 1,
      label: "Very Low",
      detail:
        "Government Reserved Area status means the vast majority of Ikoyi land has been formally alienated by the government with documented titles. Omo-onile activity does not apply to GRA land.",
    },

    proximityMinutes: [
      { to: "Victoria Island", minutes: "5–15 min" },
      { to: "Lagos Island (CBD)", minutes: "15–25 min" },
      { to: "Lekki Phase 1", minutes: "20–35 min" },
      { to: "MMA International Airport", minutes: "50–70 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "Corona School Ikoyi",
          "British International School",
          "Bayo Kuku School",
        ],
      },
      {
        category: "Healthcare",
        examples: ["Reddington Hospital", "Dodan Barracks Referral Hospital"],
      },
      {
        category: "Recreation",
        examples: [
          "Ikoyi Club 1938",
          "Lagos Country Club",
          "Elegushi Beach (nearby)",
        ],
      },
      {
        category: "Amenities",
        examples: [
          "Shoprite Ligali Ayorinde",
          "Lagos Island Golf Club",
          "Five-star hotels — Radisson Blu, Eko Signature",
        ],
      },
    ],

    pros: [
      "Lagos's strongest title security — GRA status with government documentation",
      "Best infrastructure in Nigeria for a residential address",
      "Significant USD-denominated appreciation potential",
      "Deep HNW buyer pool supports premium resale values",
      "International school cluster within 15 minutes",
    ],
    cons: [
      "Highest entry prices in Lagos — restricts buyer universe significantly",
      "Yields are thin (typically 3–5% gross) given high capital values",
      "Older GRA houses often require substantial renovation capital",
      "New luxury developments are predominantly USD-priced — naira buyers face FX exposure",
    ],

    recommendation: "buy",
    recommendationRationale:
      "Ikoyi is the right choice for HNW buyers seeking maximum prestige, security, and USD capital appreciation potential. Rental yields are lower than Lekki, but capital value preservation is stronger. Not suitable for buyers prioritising yield over capital value.",

    bestFor: [
      "HNW owner-occupiers requiring the best Lagos address",
      "Portfolio investors seeking USD-denominated capital appreciation",
      "Senior executives, diplomats, and expatriate families",
      "Diaspora buyers wanting the safest possible Lagos title",
    ],

    titleSecurity: 5,
    titleNote:
      "GRA status confers the strongest possible title protection in Lagos. Federal and state government documentation standards apply. Verification is still required but the risk profile is the lowest in Lagos.",

    terralumesActivity:
      "Ikoyi accounts for around 25% of Terralume's Premium advisory engagements, predominantly for HNW and diaspora clients.",
  },

  /* ── Ajah / Sangotedo ───────────────────────────────── */
  {
    slug: "ajah-sangotedo",
    name: "Ajah / Sangotedo",
    shortName: "Ajah",
    zone: "peri-urban",
    tagline:
      "The best value on the Island corridor — strong growth, improving titles.",
    summary:
      "The Ajah axis — encompassing Sangotedo, Abraham Adesanya, Ogombo Road, and Thomas Estate — has emerged as the most commercially active growth zone in Lagos's residential market. Strong developer activity, expanding retail infrastructure, and the highest volume of new gated estate development in Lagos have attracted a broad buyer demographic. Title quality varies significantly and requires careful navigation.",
    image: "/images/hero.png",

    buyPrices: [
      {
        label: "Apartments (new build estates)",
        low: "₦200,000",
        high: "₦380,000",
        unit: "per sqm",
      },
      {
        label: "Terraced houses",
        low: "₦250,000",
        high: "₦420,000",
        unit: "per sqm",
      },
      {
        label: "Semi-detached houses",
        low: "₦320,000",
        high: "₦500,000",
        unit: "per sqm",
      },
      {
        label: "Off-plan (pre-completion)",
        low: "₦180,000",
        high: "₦350,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "2-bedroom apartment",
        low: "₦1.2M",
        high: "₦2.5M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦2.0M",
        high: "₦4.0M",
        unit: "per year",
      },
      {
        label: "3-bedroom terraced house",
        low: "₦2.5M",
        high: "₦5.0M",
        unit: "per year",
      },
      {
        label: "4-bedroom semi-detached",
        low: "₦4.0M",
        high: "₦9.0M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Gated estate apartments (most common)",
        notes:
          "Best option; shared infrastructure, perimeter security, registered titles",
      },
      {
        type: "Terraced and semi-detached estate housing",
        notes:
          "High demand from young professionals and families; strong rental market",
      },
      {
        type: "Off-plan developments",
        notes:
          "Active developer market — LASRERA registration check essential before any purchase",
      },
      {
        type: "Land (various title types)",
        notes:
          "Significant variation — C of O, Governor's Consent, family land all present",
      },
    ],

    infrastructure: {
      roads: 3,
      power: 2,
      water: 3,
      internet: 4,
      security: 3,
    },

    floodRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Several Ajah localities flood seasonally, particularly those on lower ground near the creek system. Thomas Estate and parts of Ogombo Road have documented flood histories. Elevation is highly variable — estate-by-estate assessment is required.",
    },
    omoOnileRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Omo-onile activity is documented in parts of Ajah, particularly on land outside established estates. Buying within a registered gated estate with documented LASPPPA approval significantly reduces this risk. Stand-alone plots require caution.",
    },

    proximityMinutes: [
      { to: "Lekki Phase 1", minutes: "20–40 min" },
      { to: "Epe Expressway junction", minutes: "10–20 min" },
      {
        to: "Victoria Island",
        minutes: "45–75 min",
        note: "Traffic heavily variable",
      },
      { to: "Ibeju-Lekki (LEKOAFZA)", minutes: "30–50 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "Greensprings School Awoyaya",
          "Meadow Hall Ajah",
          "Mauvecrest International School",
        ],
      },
      {
        category: "Healthcare",
        examples: [
          "Evercare Hospital Lekki",
          "De-Edge Hospital",
          "Lagoon Hospital (nearby Lekki)",
        ],
      },
      {
        category: "Shopping",
        examples: ["Novare Mall Ajah", "Shoprite Sangotedo", "Lekki Market"],
      },
      {
        category: "Faith & Community",
        examples: [
          "The Fountain of Life Church",
          "Living Faith Church outpost",
        ],
      },
    ],

    pros: [
      "Lowest entry prices on the Island corridor — best value for new builds",
      "Highest volume of new gated estate development in Lagos",
      "Strong capital appreciation — 12–18% per year in naira terms",
      "Rapidly improving retail and commercial infrastructure",
      "Strong young professional rental demand close to tech and corporate clusters",
    ],
    cons: [
      "Title quality highly variable — requires property-by-property verification",
      "Infrastructure (power, water) significantly below Island standard",
      "Flood risk in localised areas requires individual assessment",
      "Long commute to VI and Ikoyi — not suitable for daily Island commuters without high traffic tolerance",
    ],

    recommendation: "buy",
    recommendationRationale:
      "Ajah/Sangotedo offers the strongest capital growth potential at accessible price points among all Lagos zones currently. The key is restricting the search to registered gated estates with verified titles. Within that boundary, this is one of the most compelling buy cases in Lagos today.",

    bestFor: [
      "First-time buyers seeking the best value on the Island corridor",
      "Buy-to-let investors targeting the young professional market",
      "Diaspora buyers wanting modern construction at accessible prices",
      "Families needing larger homes than Island prices permit",
    ],

    titleSecurity: 3,
    titleNote:
      "Title security depends entirely on the specific property and developer. Properties within established estates built by reputable developers with LASPPPA approval and C of O typically score 4–5. Stand-alone plots and family land can score 1–2. Verification is non-negotiable.",

    terralumesActivity:
      "One of Terralume's highest-volume advisory zones — representing approximately 25% of all Starter and Standard engagements.",
  },

  /* ── Ikeja GRA ──────────────────────────────────────── */
  {
    slug: "ikeja-gra",
    name: "Ikeja GRA",
    shortName: "Ikeja GRA",
    zone: "mainland",
    tagline:
      "The mainland's most stable address — established titles, airport proximity.",
    summary:
      "Ikeja GRA (Government Reserved Area) is the mainstream of the mainland premium residential market. Proximity to the international airport, the state government secretariat, and major commercial hubs makes it the preferred address for corporate executives, senior civil servants, and families with mainland anchors. Title documentation is generally strong by mainland standards.",
    image: "/images/image1.jpg",

    buyPrices: [
      {
        label: "Apartments (executive)",
        low: "₦250,000",
        high: "₦500,000",
        unit: "per sqm",
      },
      {
        label: "Semi-detached houses",
        low: "₦350,000",
        high: "₦600,000",
        unit: "per sqm",
      },
      {
        label: "Detached GRA houses",
        low: "₦500,000",
        high: "₦900,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "2-bedroom apartment",
        low: "₦2.0M",
        high: "₦4.0M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦3.5M",
        high: "₦7.0M",
        unit: "per year",
      },
      {
        label: "4–5 bedroom detached",
        low: "₦12M",
        high: "₦30M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "GRA detached houses (landmark stock)",
        notes:
          "Large plots; significant renovation often required; strong underlying land value",
      },
      {
        type: "Modern apartments",
        notes:
          "Growing supply from mainland developers; good quality infrastructure within buildings",
      },
      {
        type: "Semi-detached houses",
        notes:
          "Practical choice for families; good value relative to Island equivalents",
      },
    ],

    infrastructure: {
      roads: 4,
      power: 3,
      water: 3,
      internet: 4,
      security: 4,
    },

    floodRisk: {
      score: 1,
      label: "Very Low",
      detail:
        "Ikeja GRA is on elevated ground and has well-maintained drainage infrastructure relative to most of Lagos. Flood risk is minimal.",
    },
    omoOnileRisk: {
      score: 1,
      label: "Very Low",
      detail:
        "GRA designation means most land was formally alienated by government. Title documentation is generally strong. Omo-onile risk is very low.",
    },

    proximityMinutes: [
      { to: "MMA2 (Domestic Airport)", minutes: "10–20 min" },
      { to: "Murtala Muhammed Int'l Airport", minutes: "15–25 min" },
      {
        to: "Lagos Island / VI",
        minutes: "40–70 min",
        note: "Carter Bridge / Third Mainland Bridge route",
      },
      { to: "Oshodi commercial hub", minutes: "15–25 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "Loyola Jesuit College",
          "Atlantic Hall",
          "King's College Lagos",
        ],
      },
      {
        category: "Healthcare",
        examples: [
          "LASUTH (Lagos State University Teaching Hospital)",
          "Zenith Medical & Kidney Centre",
        ],
      },
      {
        category: "Business",
        examples: [
          "Computer Village (Ikeja)",
          "Lagos State Secretariat",
          "multiple bank headquarters",
        ],
      },
      {
        category: "Shopping",
        examples: [
          "Ikeja City Mall",
          "The Palms Ikeja",
          "Allen Avenue commercial strip",
        ],
      },
    ],

    pros: [
      "GRA title documentation among strongest on the mainland",
      "Excellent airport proximity for frequent travellers",
      "Strong established property market with consistent demand",
      "Better infrastructure than most mainland areas",
      "Significantly lower prices than Island equivalents for comparable property types",
    ],
    cons: [
      "Long commute to Island business districts during peak hours",
      "Older GRA housing stock requires significant renovation capital",
      "Yields lower than Ajah and Lekki due to lower rental demand from expat market",
    ],

    recommendation: "buy",
    recommendationRationale:
      "Ikeja GRA represents the best mainland option for buyers who need to be mainland-based. GRA title security, strong infrastructure, and airport proximity make it a solid choice for corporate executives, frequent travellers, and investors targeting mainland rental demand.",

    bestFor: [
      "Frequent travellers needing airport proximity",
      "Corporate executives with mainland office locations",
      "Families preferring mainland schooling clusters",
      "Investors targeting the mainland executive rental market",
    ],

    titleSecurity: 4,
    titleNote:
      "GRA status provides strong title foundations. Most properties carry documented government-originated titles. Standard independent verification required but risk of unresolvable defects is low.",

    terralumesActivity:
      "Ikeja GRA is a secondary market for Terralume — primarily Corporate and Standard package clients with mainland requirements.",
  },

  /* ── Yaba ───────────────────────────────────────────── */
  {
    slug: "yaba",
    name: "Yaba",
    shortName: "Yaba",
    zone: "mainland",
    tagline:
      "Lagos's tech and creative hub — strong rental demand, improving capital values.",
    summary:
      "Yaba has undergone a significant repositioning over the past decade, driven by the concentration of tech companies, universities, and creative sector businesses in the 'Yaba Tech Cluster'. This has produced strong rental demand from young professionals, consistent occupancy rates, and improving capital values — particularly for modern apartment stock close to the commercial core.",
    image: "/images/hero.png",

    buyPrices: [
      {
        label: "Older residential stock",
        low: "₦100,000",
        high: "₦200,000",
        unit: "per sqm",
      },
      {
        label: "Modern apartments",
        low: "₦180,000",
        high: "₦320,000",
        unit: "per sqm",
      },
      {
        label: "New-build developments",
        low: "₦250,000",
        high: "₦400,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "1-bedroom apartment",
        low: "₦900K",
        high: "₦1.8M",
        unit: "per year",
      },
      {
        label: "2-bedroom apartment",
        low: "₦1.5M",
        high: "₦3.0M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦2.5M",
        high: "₦5.0M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Modern apartment blocks",
        notes:
          "Best investment option; purpose-built for the professional renter market",
      },
      {
        type: "Converted colonial buildings",
        notes:
          "Unique character; typically lower specification but interesting stock",
      },
      {
        type: "Older family houses",
        notes:
          "Often on multiple-family land with complex title structures — caution required",
      },
    ],

    infrastructure: {
      roads: 3,
      power: 2,
      water: 2,
      internet: 5,
      security: 3,
    },

    floodRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Parts of Yaba, particularly areas near the Lagos Lagoon waterfront and lower-lying streets, experience seasonal flooding. Elevated streets and modern high-rise developments are generally not affected.",
    },
    omoOnileRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Yaba contains a significant proportion of family-owned land with multi-generational ownership disputes. Title verification must cover family consent and inheritance history, particularly for older stock.",
    },

    proximityMinutes: [
      { to: "Lagos Island", minutes: "15–30 min" },
      { to: "Victoria Island", minutes: "25–45 min" },
      { to: "Surulere", minutes: "10–20 min" },
      { to: "Ikeja GRA", minutes: "25–40 min" },
    ],

    nearbyFacilities: [
      {
        category: "Education",
        examples: [
          "University of Lagos (UNILAG)",
          "Yaba College of Technology",
          "Nigerian Law School",
        ],
      },
      {
        category: "Tech / Business",
        examples: [
          "CcHub (Co-Creation Hub)",
          "multiple tech startup offices",
          "Andela Lagos",
        ],
      },
      {
        category: "Healthcare",
        examples: [
          "LASUTH",
          "Menola Hospital",
          "Randle General Hospital (Surulere)",
        ],
      },
      {
        category: "Amenities",
        examples: [
          "Tejuosho Ultra-Modern Market",
          "National Arts Theatre",
          "railway BRT hub",
        ],
      },
    ],

    pros: [
      "Strong, consistent rental demand from tech professionals and students",
      "Best internet/fibre connectivity outside of VI and Ikoyi",
      "Lowest entry prices for residential investment on this guide",
      "Proximity to Lagos Island for professionals who need occasional Island access",
      "BRT and planned rail access improving commute options",
    ],
    cons: [
      "Mixed title quality in older stock — significant due diligence required",
      "PHCN power supply is among the least reliable in Lagos",
      "Traffic congestion severe during peak hours, particularly near UNILAG",
      "Limited premium housing stock — not suitable for lifestyle buyers",
    ],

    recommendation: "consider",
    recommendationRationale:
      "Yaba is a strong buy-to-let investment zone for the professional rental market, particularly for buyers of modern apartment stock. Capital values are improving but remain significantly below Island levels. Due diligence on older stock is essential. Not recommended for owner-occupiers seeking a premium residential environment.",

    bestFor: [
      "Investors targeting the professional and student rental market",
      "Budget-conscious first-time buyers willing to accept mainland living",
      "Portfolio investors seeking high yield with low capital outlay",
    ],

    titleSecurity: 3,
    titleNote:
      "Modern apartment blocks in Yaba typically have clean titles. Older family-owned housing stock is significantly more complex — multi-generational family consent is a recurring issue. Never proceed without a full registered title search.",

    terralumesActivity:
      "Yaba is an active zone for Terralume Standard buy-to-let advisory engagements.",
  },

  /* ── Gbagada ────────────────────────────────────────── */
  {
    slug: "gbagada",
    name: "Gbagada",
    shortName: "Gbagada",
    zone: "mainland",
    tagline:
      "A mature, stable mainland choice — good infrastructure, consistent demand.",
    summary:
      "Gbagada is one of Lagos's most established mainland residential areas, with a diverse mix of older family housing, gated estates, and modern apartment developments. Its position as a relatively decongested middle-mainland zone with consistent rental demand from working professionals, combined with solid infrastructure relative to other mainland areas, makes it a reliable if unremarkable investment proposition.",
    image: "/images/image1.jpg",

    buyPrices: [
      {
        label: "Apartments",
        low: "₦150,000",
        high: "₦280,000",
        unit: "per sqm",
      },
      {
        label: "Terraced / semi-detached (estate)",
        low: "₦200,000",
        high: "₦380,000",
        unit: "per sqm",
      },
      {
        label: "Detached houses",
        low: "₦280,000",
        high: "₦500,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "2-bedroom apartment",
        low: "₦1.2M",
        high: "₦2.5M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦2.0M",
        high: "₦4.0M",
        unit: "per year",
      },
      {
        label: "4-bedroom house",
        low: "₦4.0M",
        high: "₦10M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Gated estate housing",
        notes:
          "Best title security and most consistent rental demand; prioritise these",
      },
      {
        type: "Older detached houses",
        notes:
          "Large plots with family land histories — rigorous title verification required",
      },
      {
        type: "Modern apartments",
        notes: "Growing supply; targeted at professional renters",
      },
    ],

    infrastructure: {
      roads: 3,
      power: 3,
      water: 3,
      internet: 4,
      security: 3,
    },

    floodRisk: {
      score: 2,
      label: "Low",
      detail:
        "Gbagada generally has adequate drainage. Low-lying areas near the creek system can flood during heavy rains but most residential streets are unaffected. Confirm drainage for specific properties near Phase 1 waterway.",
    },
    omoOnileRisk: {
      score: 2,
      label: "Low – Moderate",
      detail:
        "Established residential area with a reasonable proportion of titled properties. Older family houses and plots on the periphery carry higher omo-onile risk. Gated estates are largely unaffected.",
    },

    proximityMinutes: [
      { to: "Lagos Island", minutes: "20–35 min" },
      { to: "Ikeja GRA", minutes: "15–25 min" },
      { to: "Yaba", minutes: "15–20 min" },
      { to: "Third Mainland Bridge", minutes: "10–15 min" },
    ],

    nearbyFacilities: [
      {
        category: "Schools",
        examples: [
          "Gbagada General Hospital Secondary School",
          "Chrisland Schools",
          "various nursery schools",
        ],
      },
      {
        category: "Healthcare",
        examples: [
          "Gbagada General Hospital",
          "Mediplan Healthcare",
          "Evercare Hospital (nearby Lekki)",
        ],
      },
      {
        category: "Shopping",
        examples: [
          "Gbagada Shopping Mall",
          "Shoprite (nearby Ikeja)",
          "local markets",
        ],
      },
    ],

    pros: [
      "More affordable entry prices than Ikeja GRA or Island",
      "Relatively stable and consistent rental demand",
      "Good road access to Lagos Island and Ikeja",
      "Established residential community with strong local amenity base",
    ],
    cons: [
      "Less prestigious address than Ikeja GRA or Island zones",
      "Power supply inconsistent",
      "Limited new developer activity — stock predominantly older",
      "Slower capital appreciation than Ajah or Yaba",
    ],

    recommendation: "consider",
    recommendationRationale:
      "Gbagada is a stable, unglamorous choice for mainland investors and owner-occupiers who value consistency over growth. Suitable for buy-to-let investors targeting the working professional rental market. Capital appreciation will be moderate. Strong title checking required for older stock.",

    bestFor: [
      "Buy-to-let investors seeking stable cash flow over capital growth",
      "Owner-occupiers who need mainland living with Island access",
      "Families with strong mainland community ties",
    ],

    titleSecurity: 3,
    titleNote:
      "Mixed title environment. Registered estate properties are generally well-documented. Older family houses require detailed title searches including family tree documentation to confirm authority to sell.",

    terralumesActivity:
      "Secondary market for Terralume — primarily Starter rental advisory and Standard purchase clients.",
  },

  /* ── Surulere ───────────────────────────────────────── */
  {
    slug: "surulere",
    name: "Surulere",
    shortName: "Surulere",
    zone: "mainland",
    tagline:
      "Lagos's most central mainland address — culture, community, and connectivity.",
    summary:
      "Surulere is one of Lagos's oldest and most established mainland residential areas, benefiting from central location, strong cultural identity (the National Stadium, arts institutions, National Theatre proximity), and consistent rental demand from civil servants, professionals, and families. It is not a growth market but offers stability and strong fundamentals at accessible prices.",
    image: "/images/hero.png",

    buyPrices: [
      {
        label: "Apartments (older stock)",
        low: "₦120,000",
        high: "₦220,000",
        unit: "per sqm",
      },
      {
        label: "Modern apartments",
        low: "₦200,000",
        high: "₦350,000",
        unit: "per sqm",
      },
      {
        label: "Detached / semi-detached",
        low: "₦250,000",
        high: "₦450,000",
        unit: "per sqm",
      },
    ],
    rentPrices: [
      {
        label: "2-bedroom apartment",
        low: "₦1.0M",
        high: "₦2.0M",
        unit: "per year",
      },
      {
        label: "3-bedroom apartment",
        low: "₦1.8M",
        high: "₦3.5M",
        unit: "per year",
      },
      {
        label: "4-bedroom house",
        low: "₦3.5M",
        high: "₦8.0M",
        unit: "per year",
      },
    ],

    propertyTypes: [
      {
        type: "Older detached houses (most common)",
        notes:
          "Large footprints; many with multiple occupancy; complex family title histories common",
      },
      {
        type: "Modern apartment blocks (growing)",
        notes:
          "Developer activity increasing — purpose-built for the buy-to-let professional market",
      },
      {
        type: "Blocks of flats",
        notes:
          "Common format; usually in single ownership — assess building-wide title and planning status",
      },
    ],

    infrastructure: {
      roads: 3,
      power: 2,
      water: 2,
      internet: 4,
      security: 3,
    },

    floodRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Surulere experiences periodic flooding in several localities, particularly near the Idi-Araba corridor and lower-elevation streets. Confirm drainage and flood history for specific addresses before purchase.",
    },
    omoOnileRisk: {
      score: 3,
      label: "Moderate",
      detail:
        "Surulere has a significant volume of older family-owned land with multi-generational ownership structures. Title disputes involving multiple heirs are a documented risk. Detailed title history investigation is essential for any older residential stock.",
    },

    proximityMinutes: [
      { to: "Lagos Island", minutes: "15–25 min" },
      { to: "National Stadium", minutes: "5–10 min" },
      { to: "Yaba", minutes: "10–20 min" },
      { to: "Victoria Island", minutes: "25–40 min" },
    ],

    nearbyFacilities: [
      {
        category: "Education",
        examples: [
          "Lagos State University (LASU)",
          "National Stadium Schools",
          "Randle Memorial School",
        ],
      },
      {
        category: "Healthcare",
        examples: [
          "Randle General Hospital",
          "Lagos Island General Hospital (nearby)",
          "Lagos University Teaching Hospital (LUTH)",
        ],
      },
      {
        category: "Culture & Recreation",
        examples: [
          "National Arts Theatre",
          "National Stadium",
          "MUSON Centre (Musical Society of Nigeria)",
        ],
      },
      {
        category: "Shopping",
        examples: [
          "Adeniran Ogunsanya Mall",
          "Bode Thomas market strip",
          "local open markets",
        ],
      },
    ],

    pros: [
      "Most accessible entry prices among all zones in this guide",
      "Highly central — excellent access to Lagos Island, Yaba, and Ikeja",
      "Strong existing institutional rental demand — civil servants, hospital workers, university staff",
      "Cultural and community depth unmatched in newer developments",
    ],
    cons: [
      "Oldest housing stock of any zone in this guide — high maintenance obligations",
      "Complex family title structures are the rule rather than the exception",
      "Power and water among the least reliable of all zones covered",
      "Not a capital growth story — prices have been relatively flat historically",
    ],

    recommendation: "consider",
    recommendationRationale:
      "Surulere works as a yield play for experienced investors willing to invest in title verification and renovation. Modern apartment developments within Surulere are a cleaner entry route. Not suitable for buyers who want simplicity, capital growth, or premium residential environment.",

    bestFor: [
      "Experienced buy-to-let investors comfortable with complex title work",
      "Buyers targeting new-build apartments in the Surulere renewal belt",
      "Owner-occupiers with family roots in the area",
      "Portfolio investors seeking high gross yields on renovated stock",
    ],

    titleSecurity: 2,
    titleNote:
      "Surulere has the most complex title environment of any zone in this guide. Multi-generational family ownership, inadequate historical documentation, and disputed boundaries are common. Avoid purchasing older stock without a qualified solicitor conducting a full historical title investigation.",

    terralumesActivity:
      "Lower activity zone for Terralume — primarily Starter rental advisory clients.",
  },
];
