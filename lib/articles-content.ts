export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "callout";
      text: string;
      title?: string;
      variant?: "info" | "warning" | "danger";
    }
  | { type: "divider" };

export const articleBodies: Record<string, ContentBlock[]> = {
  "how-to-buy-property-in-lagos-complete-guide": [
    {
      type: "paragraph",
      text: "Buying property in Lagos is one of the most significant financial decisions you will make — and one of the most complex. Unlike mature markets such as the UK or US, Lagos operates without a centralised multiple listing service, with contested title chains, and with agents who typically work for the seller, not for you. This guide walks you through every stage of a Lagos property purchase.",
    },
    {
      type: "heading2",
      text: "Step 1 — Define Your Brief",
    },
    {
      type: "paragraph",
      text: "Before you contact a single agent or view a single property, you need a written brief. This should cover your target locations, your budget including transaction costs, your timeline, property type and minimum specifications, and — critically — whether you require title security suitable for mortgage purposes.",
    },
    {
      type: "heading2",
      text: "Step 2 — Arrange Your Finances",
    },
    {
      type: "paragraph",
      text: "In Lagos, sellers expect proof of funds or a credible mortgage pre-approval before granting viewings for premium properties. Determine whether you are purchasing with cash, via a local Nigerian bank mortgage, or with remittance from abroad. Most Nigerian mortgages require a valid C of O in the borrower's name as collateral.",
    },
    {
      type: "heading2",
      text: "Step 3 — Search the Market (On and Off Market)",
    },
    {
      type: "paragraph",
      text: "The Lagos property market is heavily fragmented. Online portals carry a fraction of active listings. The majority of transactions — particularly in Ikoyi, VI, and Banana Island — occur off-market through agent and developer networks. A buyer's advisory firm with established developer relationships will access inventory that never appears publicly.",
    },
    {
      type: "heading2",
      text: "Step 4 — Conduct Independent Due Diligence",
    },
    {
      type: "paragraph",
      text: "This is the step most buyers shortcut — and the source of most costly mistakes. Due diligence in Lagos includes: title verification at the Land Registry, a structural survey by an independent engineer, a landlord or vendor background check, confirmation of approved building plans, and review of service charge accounts for apartments.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Critical warning",
      text: "Never rely solely on the documents provided by the seller. All title documents must be independently verified at the Lagos State Land Registry before you exchange contracts or pay any deposit.",
    },
    {
      type: "heading2",
      text: "Step 5 — Negotiate Price",
    },
    {
      type: "paragraph",
      text: "Most asking prices in Lagos carry a 5–20% negotiation margin. The key variables affecting seller motivation are: how long the property has been listed, whether the seller is under financial pressure, and whether you are purchasing with cleared funds. A buyer's agent with recent comparable transaction data will negotiate from a position of evidence, not guesswork.",
    },
    {
      type: "heading2",
      text: "Step 6 — Exchange Contracts and Complete",
    },
    {
      type: "paragraph",
      text: "Once terms are agreed, your solicitor will prepare or review the Sale and Purchase Agreement. At exchange, a deposit — typically 10–30% — is paid. The balance is paid at completion, when title is transferred and keys are handed over. The exchange-to-completion period varies from 4 to 12 weeks depending on the complexity of the title chain.",
    },
    {
      type: "heading2",
      text: "Step 7 — Register the Transfer",
    },
    {
      type: "paragraph",
      text: "Following completion, the Deed of Assignment must be stamped with stamp duty and presented to the Governor's office for consent. Governor's Consent is legally required for the transfer of a leasehold title and is frequently overlooked or delayed by buyers without professional guidance. Without it, your ownership is not fully perfected.",
    },
    {
      type: "callout",
      variant: "info",
      title: "How Terralume helps",
      text: "Our Project Managers handle every step in this guide on your behalf — from brief to key handover. We work exclusively for you, never the seller or agent.",
    },
  ],

  "how-to-buy-property-in-nigeria-from-uk": [
    {
      type: "paragraph",
      text: "Buying Nigeria property from the UK is entirely achievable — but it requires a methodical approach, a trustworthy team on the ground, and robust document verification. The diaspora property market is also the most heavily targeted by fraudsters, who exploit the buyer's physical absence and unfamiliarity with local processes.",
    },
    {
      type: "heading2",
      text: "Before Anything Else: Establish Your Ground Team",
    },
    {
      type: "paragraph",
      text: "You will need a buyer's advisory firm with a dedicated project manager, a qualified Nigerian solicitor you found independently (not one referred by the seller), and video-viewing capability for all properties. The advisory firm should be registered with LASRERA (Lagos State Real Estate Regulatory Authority) and able to provide verifiable references from diaspora clients.",
    },
    {
      type: "heading2",
      text: "How Remote Viewings Work",
    },
    {
      type: "paragraph",
      text: "Any reputable advisory firm should conduct accompanied viewings on your behalf, recording full-length video walkthroughs with commentary on structural condition, infrastructure, neighbourhood context, and comparable listings. Still photos from a seller's listing are not sufficient due diligence for a transaction of this size.",
    },
    {
      type: "heading2",
      text: "Title Verification from the UK",
    },
    {
      type: "paragraph",
      text: "You do not need to be in Nigeria to verify title. Your Nigerian solicitor can commission a Land Registry search against the title documents provided by the seller. You should receive a written Title Verification Report before paying any deposit — not after. If any advisor or solicitor tells you this is not possible remotely, find a different advisor.",
    },
    {
      type: "callout",
      variant: "danger",
      title: "The most common diaspora fraud pattern",
      text: "A seller claims to own a property, accepts a large deposit from an overseas buyer, then disappears. The property was either not theirs to sell, or the same deposit was collected from multiple buyers simultaneously. Independent title verification before any money changes hands is the only reliable protection.",
    },
    {
      type: "heading2",
      text: "FX and Payments",
    },
    {
      type: "paragraph",
      text: "All property payments in Nigeria must be made in Naira to a Nigerian bank account. Do not transfer funds to a UK- or UAE-based account on behalf of a 'seller'. Transfer GBP via a reputable FX provider who delivers Naira directly to the vendor's verified Nigerian bank account — with a documented paper trail for every transaction.",
    },
    {
      type: "heading2",
      text: "Nigerian Solicitor vs UK Solicitor",
    },
    {
      type: "paragraph",
      text: "You need a Nigerian solicitor qualified in Nigerian property law and familiar with the Lagos title system. A UK solicitor cannot advise on Nigerian title documents. Some dual-qualified solicitors exist and can provide useful context, but the primary legal review must be conducted by a Lagos-based solicitor who can physically present documents to the Land Registry.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Terralume Diaspora Remote Package",
      text: "Our Diaspora Remote package is designed specifically for buyers in the UK, US, Canada, and UAE. We conduct all viewings and inspections on video, provide written reports on every property, and manage completion entirely remotely — from brief to key handover.",
    },
  ],

  "how-to-avoid-property-fraud-lagos": [
    {
      type: "paragraph",
      text: "Property fraud costs buyers hundreds of millions of naira every year in Lagos. The market's structural features — no centralised searchable register, fragmented title chains, unregulated agents — create an environment where fraudulent transactions are not rare. This guide covers the most common schemes and how to protect yourself at every stage.",
    },
    {
      type: "heading2",
      text: "Why Property Fraud is Prevalent in Lagos",
    },
    {
      type: "paragraph",
      text: "Lagos's property market lacks a centralised, publicly searchable title register. This makes it easier for fraudulent sellers to present forged or doctored documents, claim ownership of land they do not own, or sell the same property to multiple buyers simultaneously. Without independent verification, buyers have limited means of detecting fraud before it is too late.",
    },
    {
      type: "heading2",
      text: "The Five Most Common Fraud Schemes",
    },
    {
      type: "list",
      items: [
        "Multiple sales — the same property sold to two or more buyers. The first to complete registration typically 'wins'; others lose their entire deposits.",
        "Forged title documents — a C of O or Governor's Consent with a genuine-looking seal that does not correspond to any registered title at the Land Registry.",
        "Family land disputes — a property sold by one family member without authority from others who hold a joint interest in the land.",
        "Off-plan fraud — a developer collects full or substantial payment for a development that was never built or was materially misrepresented.",
        "Agent impersonation — a fraudster poses as the legitimate owner's agent, collects rent or purchase funds, and disappears.",
      ],
    },
    {
      type: "heading2",
      text: "How to Protect Yourself: The Pre-Purchase Checklist",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Demand the original C of O, Deed of Assignment, and all previous conveyances — not photocopies.",
        "Commission an independent Land Registry search before paying any deposit.",
        "Verify the seller's identity against government-issued ID and cross-check against the registered owner on the title documents.",
        "Engage a solicitor you found independently — not one referred by the selling agent.",
        "Never pay a deposit directly to an individual; always pay to a solicitor's client account.",
        "For off-plan purchases: confirm the developer is registered with LASRERA and that the development has approved building plans from LASPPPA.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Warning: 'No title verification needed for this property'",
      text: "Any agent, seller, or solicitor who tells you title verification is unnecessary for a particular property type or transaction is either incompetent or deliberately misleading you. Independent verification is always required, regardless of the property type.",
    },
    {
      type: "heading2",
      text: "What to Do if You Suspect Fraud",
    },
    {
      type: "paragraph",
      text: "If you suspect you have been defrauded in a Lagos property transaction: immediately cease all further payments, preserve all communications and receipts, contact the Lagos State Consumer Protection Agency (LASCOPA), and engage a solicitor urgently. Report off-plan fraud to LASRERA. Note that recovering funds in Nigerian property fraud cases is difficult — prevention is the only reliable protection.",
    },
  ],

  "property-due-diligence-lagos-what-to-check": [
    {
      type: "paragraph",
      text: "Property due diligence is the process of independently verifying all material facts about a property before you commit to buying it. In Lagos, this process is significantly more complex than in many other markets because there is no centralised searchable land register, title chains can be long and contested, building plan approvals are frequently not filed, and the physical condition of properties is rarely documented by sellers.",
    },
    {
      type: "heading2",
      text: "1. Title Verification",
    },
    {
      type: "paragraph",
      text: "The single most important due diligence step is confirming that the seller has an unencumbered legal right to sell the property. This involves physical inspection of the original title documents (C of O, Governor's Consent, or Deed of Assignment), a Land Registry search to confirm the documents are registered and unencumbered, and verification that no adjacent or family claims exist on the land.",
    },
    {
      type: "heading2",
      text: "2. Structural Survey",
    },
    {
      type: "paragraph",
      text: "A structural survey conducted by a qualified engineer will identify: foundation integrity issues (particularly common in reclaimed land areas near the Lagos Lagoon), evidence of flooding or water ingress, roof condition, load-bearing wall integrity, and the condition of electrical, plumbing, and drainage systems. A visual inspection alone is never sufficient.",
    },
    {
      type: "heading2",
      text: "3. Building Plan Approval",
    },
    {
      type: "paragraph",
      text: "Every structure in Lagos State must have an approved building plan from the Lagos State Physical Planning Permit Authority (LASPPPA). Many properties — particularly older builds and those on family land — were constructed without approval. An unapproved structure is technically subject to demolition, and this risk must be factored into any purchase decision.",
    },
    {
      type: "heading2",
      text: "4. Infrastructure and Service Checks",
    },
    {
      type: "list",
      items: [
        "Electricity: PHCN/IKEDC supply reliability and transformer capacity for the estate",
        "Water: borehole condition and water table depth, evidence of seasonal flooding",
        "Road access: all-season accessibility, road maintenance responsibility, and gate security",
        "Internet infrastructure: fibre availability for remote-working professionals",
      ],
    },
    {
      type: "heading2",
      text: "5. Service Charge and Estate Records (Apartments Only)",
    },
    {
      type: "paragraph",
      text: "For apartment purchases, obtain the service charge budget and accounts for the past two years, evidence of reserve fund contributions, minutes of residents' or management company meetings, details of estate maintenance contracts, and confirmation of any ongoing disputes or litigation involving the estate.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Sellers are not required to disclose defects in Nigeria",
      text: "Nigerian property law generally operates on caveat emptor (buyer beware). The seller is not legally obliged to disclose structural defects, disputed boundaries, or service charge arrears. This places the entire burden of discovery on the buyer's due diligence process — making independent professional advice essential.",
    },
  ],

  "best-areas-to-buy-property-lagos-2025": [
    {
      type: "paragraph",
      text: "Not all Lagos neighbourhoods offer the same combination of title security, infrastructure, and potential for capital appreciation. Our area assessments are based on five variables: infrastructure quality (road access, electricity, water), title security (prevalence of documented titles vs. family land), price-to-rent yield, 36-month capital growth, and liveability — security, school access, and amenity density.",
    },
    {
      type: "heading2",
      text: "Tier 1: Ikoyi and Victoria Island",
    },
    {
      type: "paragraph",
      text: "Lagos's premium tier remains Ikoyi and Victoria Island. Average prices in Ikoyi range from ₦850,000 to ₦1.8 million per square metre. Title security on the Island is significantly higher than the mainland, with the majority of properties carrying a C of O. Rental yields for executive apartments are currently running at 4–6% gross. Capital growth has been strong in naira terms, driven in part by USD-denominated pricing by high-end developers.",
    },
    {
      type: "heading2",
      text: "Tier 2: Lekki Phase 1 and Oniru",
    },
    {
      type: "paragraph",
      text: "Lekki Phase 1 offers the best combination of verified titles, infrastructure investment, and relative price accessibility compared to Ikoyi. Per-square-metre prices range from ₦500,000 to ₦900,000. Oniru is emerging as a premium zone between VI and Lekki, with significant developer activity and rapidly improving infrastructure.",
    },
    {
      type: "heading2",
      text: "Tier 3: Ajah and Lekki Phase 2",
    },
    {
      type: "paragraph",
      text: "Ajah — specifically the Sangotedo and Abraham Adesanya axis — offers the strongest value proposition for buyers who want newer construction, gated estate living, and lower entry prices. Lekki Phase 2 offers more space per naira but has lower title security than Phase 1 and longer commute times to the Island.",
    },
    {
      type: "heading2",
      text: "The Mainland Case: Yaba, Surulere, Gbagada",
    },
    {
      type: "paragraph",
      text: "As Island prices remain elevated, well-located mainland zones are attracting renewed investor interest. Yaba's proximity to tech clusters, universities, and the planned BRT expansion makes it the strongest mainland growth play. Surulere carries strong existing infrastructure but slower capital appreciation. Gbagada offers good value for landlords with consistent rental demand from working professionals.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Where Terralume advisors are most active in 2025",
      text: "The highest volume of Terralume buyer transactions has been in Lekki Phase 1, Oniru, and Ajah — reflecting buyer demand for verified titles, modern construction, and proximity to the Island without Island prices.",
    },
    {
      type: "heading2",
      text: "Areas We Currently Advise Caution On",
    },
    {
      type: "list",
      items: [
        "Epe and Ibeju-Lekki: long-term infrastructure play with elevated land fraud risk — not suitable for near-term residential buyers.",
        "Isale-Eko and Lagos Island core: complex family land structures, limited new stock, difficult title verification.",
        "Remote phases of Lekki Free Zone: speculative plays with high title risk and no near-term infrastructure delivery timeline.",
      ],
    },
  ],

  "lagos-property-prices-2025-area-breakdown": [
    {
      type: "paragraph",
      text: "All prices below are expressed as price per square metre of internal usable floor area — not plot size — and represent the achieved transaction range based on Terralume advisory engagements and market research conducted in Q3–Q4 2025. Premium finishes, waterfront positions, or exceptional views will push prices toward the upper end of each range.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Important note on naira pricing",
      text: "All prices are denominated in naira. Given ongoing naira volatility, USD-equivalent values fluctuate significantly. Dollar-denominated buyers should request USD pricing directly from sellers or developers — many high-end Lagos properties are now quoted and transacted in USD.",
    },
    {
      type: "heading2",
      text: "Ikoyi",
    },
    {
      type: "list",
      items: [
        "Studio / 1-bed apartments: ₦900,000–₦1,400,000 per sqm",
        "2–3 bed apartments: ₦700,000–₦1,200,000 per sqm",
        "Detached houses (full plot): ₦1,200,000–₦1,800,000 per sqm",
        "12-month trend: +8–12% in naira terms; broadly flat in USD terms",
      ],
    },
    {
      type: "heading2",
      text: "Victoria Island (VI)",
    },
    {
      type: "list",
      items: [
        "Commercial-residential apartments: ₦650,000–₦1,100,000 per sqm",
        "Executive duplexes: ₦800,000–₦1,300,000 per sqm",
        "12-month trend: +6–10% in naira terms",
      ],
    },
    {
      type: "heading2",
      text: "Lekki Phase 1",
    },
    {
      type: "list",
      items: [
        "Apartments (new build): ₦400,000–₦700,000 per sqm",
        "Apartments (existing stock): ₦300,000–₦550,000 per sqm",
        "Detached / semi-detached: ₦500,000–₦900,000 per sqm",
        "12-month trend: +10–15% in naira terms",
      ],
    },
    {
      type: "heading2",
      text: "Ajah / Sangotedo",
    },
    {
      type: "list",
      items: [
        "Apartments (new build): ₦200,000–₦380,000 per sqm",
        "Terrace houses: ₦250,000–₦420,000 per sqm",
        "12-month trend: +12–18% (strong developer supply meeting high buyer demand)",
      ],
    },
    {
      type: "heading2",
      text: "Yaba (Mainland)",
    },
    {
      type: "list",
      items: [
        "Modern apartments: ₦180,000–₦320,000 per sqm",
        "Older residential stock: ₦100,000–₦200,000 per sqm",
        "12-month trend: +5–8%",
      ],
    },
    {
      type: "heading2",
      text: "Ikeja (GRA and Maryland)",
    },
    {
      type: "list",
      items: [
        "GRA and Maryland: ₦250,000–₦500,000 per sqm",
        "Older residential: ₦150,000–₦280,000 per sqm",
        "12-month trend: +4–7%",
      ],
    },
  ],
};
