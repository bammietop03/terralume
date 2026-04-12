export type CategorySlug =
  | "price-data"
  | "legal-guides"
  | "area-analysis"
  | "fraud-warnings"
  | "how-to-guides";

export interface Category {
  slug: CategorySlug;
  label: string;
  color: string; // Tailwind bg class for badge
  textColor: string; // Tailwind text class for badge
}

export const CATEGORIES: Category[] = [
  {
    slug: "price-data",
    label: "Price Data",
    color: "bg-navy-light",
    textColor: "text-navy",
  },
  {
    slug: "legal-guides",
    label: "Legal Guides",
    color: "bg-crimson-light",
    textColor: "text-crimson",
  },
  {
    slug: "area-analysis",
    label: "Area Analysis",
    color: "bg-surface-card",
    textColor: "text-on-surface",
  },
  {
    slug: "fraud-warnings",
    label: "Fraud Warnings",
    color: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    slug: "how-to-guides",
    label: "How-To Guides",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
  };
  date: string; // ISO 8601
  readTime: number; // minutes
  category: CategorySlug;
  image: string;
  featured?: boolean;
}

export const articles: Article[] = [
  // ── How-To Guides ───────────────────────────────────────
  {
    slug: "how-to-buy-property-in-lagos-complete-guide",
    title:
      "How to Buy Property in Lagos: A Complete Step-by-Step Buyer's Guide",
    excerpt:
      "From setting your brief to collecting your keys — the definitive guide to navigating a Lagos property purchase without losing money or months of your life.",
    author: { name: "Amara Okonkwo", role: "Senior Property Advisor" },
    date: "2025-11-10",
    readTime: 14,
    category: "how-to-guides",
    image: "/images/hero.png",
    featured: true,
  },
  {
    slug: "how-to-buy-property-in-nigeria-from-uk",
    title:
      "How to Buy Property in Nigeria from the UK: A Diaspora Buyer's Guide",
    excerpt:
      "A practical, step-by-step playbook for Nigerians in the UK buying Lagos property remotely — including how to avoid the scams that target diaspora buyers.",
    author: { name: "Chidi Ezekwu", role: "Project Manager" },
    date: "2025-10-22",
    readTime: 12,
    category: "how-to-guides",
    image: "/images/image1.jpg",
  },
  {
    slug: "property-due-diligence-lagos-what-to-check",
    title: "How to Conduct Due Diligence on a Lagos Property: What to Check",
    excerpt:
      "Property due diligence in Lagos goes far beyond a viewing. This guide covers title searches, structural checks, landlord verification, and the documents that matter.",
    author: { name: "Fatima Al-Hassan", role: "Legal Research Analyst" },
    date: "2025-09-15",
    readTime: 10,
    category: "how-to-guides",
    image: "/images/hero.png",
  },
  {
    slug: "how-to-negotiate-property-prices-lagos",
    title:
      "How to Negotiate Property Prices in Lagos Without a Traditional Agent",
    excerpt:
      "Most agents negotiate for the seller. Here's how to research comparable prices, identify seller motivation, and secure the best price independently.",
    author: { name: "Amara Okonkwo", role: "Senior Property Advisor" },
    date: "2025-08-30",
    readTime: 8,
    category: "how-to-guides",
    image: "/images/image1.jpg",
  },
  {
    slug: "what-to-look-for-when-viewing-property-lagos",
    title: "What to Look for When Viewing a Property in Lagos",
    excerpt:
      "Structural red flags, infrastructure checks, and the questions most buyers forget to ask before committing to a viewing in Lagos.",
    author: { name: "Chidi Ezekwu", role: "Project Manager" },
    date: "2025-07-18",
    readTime: 7,
    category: "how-to-guides",
    image: "/images/hero.png",
  },
  {
    slug: "how-to-hire-buyers-agent-lagos",
    title: "How to Hire a Buyer's Agent in Lagos: Questions to Ask",
    excerpt:
      "Not all real estate agents in Lagos work for you. Learn the difference between a traditional agent and a buyer's advisory firm — and what to ask before signing anything.",
    author: { name: "Terralume Editorial", role: "Editorial Team" },
    date: "2025-06-04",
    readTime: 6,
    category: "how-to-guides",
    image: "/images/image1.jpg",
  },

  // ── Fraud Warnings ──────────────────────────────────────
  {
    slug: "how-to-avoid-property-fraud-lagos",
    title: "How to Avoid Property Fraud in Lagos: A Practical Guide",
    excerpt:
      "Property fraud costs buyers hundreds of millions of naira every year in Lagos. This guide covers the most common schemes and how to protect yourself at every stage.",
    author: { name: "Fatima Al-Hassan", role: "Legal Research Analyst" },
    date: "2025-11-01",
    readTime: 11,
    category: "fraud-warnings",
    image: "/images/hero.png",
  },
  {
    slug: "red-flags-buying-property-lagos",
    title: "5 Serious Red Flags When Buying Property in Lagos",
    excerpt:
      "From agents who rush you to sign, to sellers who won't produce a C of O — these five warning signs can save you from a fraudulent transaction.",
    author: { name: "Amara Okonkwo", role: "Senior Property Advisor" },
    date: "2025-10-05",
    readTime: 6,
    category: "fraud-warnings",
    image: "/images/image1.jpg",
  },
  {
    slug: "sold-twice-property-scam-lagos",
    title:
      "The 'Sold Twice' Scam: How Fraudsters Defraud Multiple Buyers in Lagos",
    excerpt:
      "One property. Two or more buyers. A seller who disappears with all the deposits. How this well-worn fraud works and the title search that stops it.",
    author: { name: "Fatima Al-Hassan", role: "Legal Research Analyst" },
    date: "2025-09-08",
    readTime: 8,
    category: "fraud-warnings",
    image: "/images/hero.png",
  },

  // ── Legal Guides ────────────────────────────────────────
  {
    slug: "certificate-of-occupancy-explained-lagos",
    title:
      "Certificate of Occupancy (C of O) Explained: What Every Buyer Must Know",
    excerpt:
      "A C of O is the strongest title document on Lagos land. But who grants it, how is it verified, and what happens if a seller can't produce one?",
    author: { name: "Fatima Al-Hassan", role: "Legal Research Analyst" },
    date: "2025-10-14",
    readTime: 9,
    category: "legal-guides",
    image: "/images/image1.jpg",
  },
  {
    slug: "governors-consent-vs-deed-of-assignment-lagos",
    title: "Governor's Consent vs Deed of Assignment: What's the Difference?",
    excerpt:
      "Two documents that frequently confuse buyers — and whose absence has invalidated thousands of Lagos transactions. Here's what each one means for your purchase.",
    author: { name: "Fatima Al-Hassan", role: "Legal Research Analyst" },
    date: "2025-08-20",
    readTime: 8,
    category: "legal-guides",
    image: "/images/hero.png",
  },
  {
    slug: "title-verification-lagos-step-by-step",
    title: "Title Verification in Lagos: A Step-by-Step Guide for Buyers",
    excerpt:
      "How to trace a property's ownership history, confirm gazettement, and check for encumbrances — before you sign anything.",
    author: { name: "Fatima Al-Hassan", role: "Legal Research Analyst" },
    date: "2025-07-30",
    readTime: 10,
    category: "legal-guides",
    image: "/images/image1.jpg",
  },
  {
    slug: "stamp-duty-land-registry-fees-lagos",
    title: "Stamp Duty and Land Registry Fees When Buying Property in Lagos",
    excerpt:
      "A full breakdown of the transaction costs that buyers often overlook — stamp duty rates, consent fees, and how much to budget beyond the asking price.",
    author: { name: "Chidi Ezekwu", role: "Project Manager" },
    date: "2025-06-25",
    readTime: 7,
    category: "legal-guides",
    image: "/images/hero.png",
  },

  // ── Price Data ──────────────────────────────────────────
  {
    slug: "lagos-property-prices-2025-area-breakdown",
    title: "Lagos Property Prices 2025: Area-by-Area Market Breakdown",
    excerpt:
      "Current per-square-metre prices across Ikoyi, Victoria Island, Lekki, Ajah, Yaba, and Ikeja — with 12-month trend data for each zone.",
    author: { name: "Terralume Editorial", role: "Editorial Team" },
    date: "2025-11-15",
    readTime: 9,
    category: "price-data",
    image: "/images/image1.jpg",
  },
  {
    slug: "ikoyi-vs-victoria-island-property-prices",
    title: "Ikoyi vs Victoria Island: Current Market Prices Compared",
    excerpt:
      "Side-by-side price data for Lagos's two most premium addresses — with yield analysis for buyers considering buy-to-let in either location.",
    author: { name: "Amara Okonkwo", role: "Senior Property Advisor" },
    date: "2025-10-28",
    readTime: 8,
    category: "price-data",
    image: "/images/hero.png",
  },
  {
    slug: "how-much-does-it-cost-to-buy-house-lagos-2025",
    title: "How Much Does It Cost to Buy a House in Lagos in 2025?",
    excerpt:
      "Entry-level to luxury — realistic price bands across Lagos neighbourhoods, including all transaction costs, not just the asking price.",
    author: { name: "Terralume Editorial", role: "Editorial Team" },
    date: "2025-09-01",
    readTime: 7,
    category: "price-data",
    image: "/images/image1.jpg",
  },

  // ── Area Analysis ───────────────────────────────────────
  {
    slug: "best-areas-to-buy-property-lagos-2025",
    title: "Best Areas to Buy Property in Lagos in 2025",
    excerpt:
      "Infrastructure investment, price growth trends, and liveability scores for the neighbourhoods that offer the strongest case for buyers this year.",
    author: { name: "Amara Okonkwo", role: "Senior Property Advisor" },
    date: "2025-11-03",
    readTime: 11,
    category: "area-analysis",
    image: "/images/hero.png",
  },
  {
    slug: "lekki-phase-1-vs-phase-2-which-to-buy",
    title: "Lekki Phase 1 vs Lekki Phase 2: Which is the Better Buy?",
    excerpt:
      "Price per square metre, rental yields, title document risk, and infrastructure quality — a data-driven comparison for buyers deciding between the two.",
    author: { name: "Chidi Ezekwu", role: "Project Manager" },
    date: "2025-09-20",
    readTime: 9,
    category: "area-analysis",
    image: "/images/image1.jpg",
  },
  {
    slug: "banana-island-still-worth-buying-lagos",
    title:
      "Banana Island: Is It Still Worth Buying in Nigeria's Most Expensive Estate?",
    excerpt:
      "Capital values have plateaued. Rental yields are thin. We examine the data and ask whether Banana Island still justifies its premium in 2025.",
    author: { name: "Amara Okonkwo", role: "Senior Property Advisor" },
    date: "2025-08-12",
    readTime: 10,
    category: "area-analysis",
    image: "/images/hero.png",
  },
  {
    slug: "mainland-lagos-yaba-surulere-gbagada-investment",
    title: "Mainland Lagos: Yaba, Surulere, and Gbagada as Investment Zones",
    excerpt:
      "As Island prices remain elevated, smart buyers are revisiting the mainland. A comparative look at three zones with genuine upside potential.",
    author: { name: "Terralume Editorial", role: "Editorial Team" },
    date: "2025-07-07",
    readTime: 8,
    category: "area-analysis",
    image: "/images/image1.jpg",
  },
];
