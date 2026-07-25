/**
 * prisma/seed.ts
 *
 * Creates one Supabase auth user + matching DB row for each of the three roles.
 * Idempotent — safe to run multiple times (upserts on both sides).
 *
 * Usage:
 *   npx prisma db seed
 *   # or directly:
 *   npx tsx prisma/seed.ts
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient, ArticleCategory } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { articles } from "../lib/articles-data";
import { articleBodies } from "../lib/articles-content";
import type { ContentBlock } from "../lib/articles-content";

// ─── Service tier price map (numeric, NGN) ────────────────────────────────────

const TIER_PRICES: Record<string, number> = {
  starter: 150_000,
  standard: 350_000,
  premium: 750_000,
  corporate: 2_500_000,
  "diaspora-remote": 500_000,
};

// ─── Seed data ────────────────────────────────────────────────────

// ─── Markdown helpers ───────────────────────────────────────────

function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.text;
        case "heading2":
          return `## ${block.text}`;
        case "heading3":
          return `### ${block.text}`;
        case "list":
          return block.ordered
            ? block.items.map((item, i) => `${i + 1}. ${item}`).join("\n")
            : block.items.map((item) => `- ${item}`).join("\n");
        case "callout": {
          const prefix = block.title ? `**${block.title}**: ` : "";
          return `> ${prefix}${block.text}`;
        }
        case "divider":
          return "---";
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

const SEED_USERS = [
  {
    email: "admin@terralume.com",
    password: "Admin@Seed1!",
    role: "ADMIN" as const,
    fullName: "Terralume Admin",
    preferredName: "Admin",
    phone: "+44 7700 000001",
  },
  {
    email: "pm@terralume.com",
    password: "PM@Seed1!",
    role: "PM" as const,
    fullName: "Sarah Okonkwo",
    preferredName: "Sarah",
    phone: "+44 7700 000002",
  },
  {
    email: "client@terralume.com",
    password: "Client@Seed1!",
    role: "CLIENT" as const,
    fullName: "James Adeyemi",
    preferredName: "James",
    phone: "+234 812 000 0003",
    nationality: "Nigerian",
    location: "Lagos, Nigeria",
    onboardingComplete: true,
  },
] as const;

// ─── Clients ─────────────────────────────────────────────────────────────────

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get or create a Supabase auth user; returns their UUID. */
async function getOrCreateAuthUser(
  email: string,
  password: string,
): Promise<string> {
  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!error) return created.user.id;

  // If the user already exists just look them up
  if (
    error.message.includes("already been registered") ||
    error.message.includes("already exists") ||
    error.code === "email_exists"
  ) {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    const existing = list?.users.find((u) => u.email === email);
    if (existing) {
      console.log(`  ↩  Auth user already exists: ${email}`);
      return existing.id;
    }
  }

  throw new Error(`Could not create auth user ${email}: ${error.message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Seeding Terralume…\n");

  let adminUserId: string | null = null;

  for (const seed of SEED_USERS) {
    // 1. Supabase auth user
    const authId = await getOrCreateAuthUser(seed.email, seed.password);
    if (seed.role === "ADMIN") adminUserId = authId;
    console.log(`  ✓  Auth  ${seed.role.padEnd(6)}  ${seed.email}`);

    // 2. Prisma user record (upsert — skip update if already correct)
    await prisma.user.upsert({
      where: { id: authId },
      update: {},
      create: {
        id: authId,
        email: seed.email,
        role: seed.role,
        fullName: seed.fullName,
        preferredName: seed.preferredName,
        phone: seed.phone,
        // Client-only fields
        ...(seed.role === "CLIENT" && {
          nationality: (seed as (typeof SEED_USERS)[2]).nationality,
          location: (seed as (typeof SEED_USERS)[2]).location,
          onboardingComplete: (seed as (typeof SEED_USERS)[2])
            .onboardingComplete,
        }),
      },
    });

    console.log(`  ✓  DB    ${seed.role.padEnd(6)}  ${seed.email}`);
  }

  console.log("\n✅  Seed complete.\n");
  console.log("─────────────────────────────────────────────");
  console.log("  Role    Email                  Password");
  console.log("─────────────────────────────────────────────");
  for (const u of SEED_USERS) {
    console.log(`  ${u.role.padEnd(7)} ${u.email.padEnd(25)} ${u.password}`);
  }
  console.log("─────────────────────────────────────────────");

  // ─── Seed articles ──────────────────────────────────────────────────────────

  console.log("\n🗞  Seeding articles…\n");

  if (!adminUserId) {
    console.warn("  ⚠  No admin user found — skipping article seed.");
    return;
  }

  const categoryMap: Record<string, ArticleCategory> = {
    "price-data": ArticleCategory.PRICE_DATA,
    "legal-guides": ArticleCategory.LEGAL_GUIDES,
    "area-analysis": ArticleCategory.AREA_ANALYSIS,
    "fraud-warnings": ArticleCategory.FRAUD_WARNINGS,
    "how-to-guides": ArticleCategory.HOW_TO_GUIDES,
  };

  let created = 0;
  let skipped = 0;

  for (const article of articles) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const body = articleBodies[article.slug] ?? null;

    await prisma.article.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        authorId: adminUserId,
        publishedAt: new Date(article.date),
        readTime: article.readTime,
        category: categoryMap[article.category],
        image: article.image,
        featured: article.featured ?? false,
        body: body != null ? blocksToMarkdown(body) : undefined,
        published: true,
      },
    });

    console.log(`  ✓  ${article.slug}`);
    created++;
  }

  console.log(
    `\n✅  Articles: ${created} created, ${skipped} already existed.\n`,
  );

  // ─── Seed Services & Workflow Templates ─────────────────────────────────────

  console.log("\n🏗️   Seeding services & workflows…\n");

  // Real Estate Service
  const realEstateService = await prisma.service.upsert({
    where: { slug: "real-estate" },
    update: {},
    create: {
      slug: "real-estate",
      name: "Real Estate Advisory",
      type: "REAL_ESTATE",
      description:
        "Comprehensive real estate search, evaluation, and acquisition management for buyers in Nigeria.",
      isActive: true,
    },
  });

  console.log(`  ✓  Service: ${realEstateService.name}`);

  // Real Estate Workflow Template
  const realEstateWorkflow = await prisma.workflowTemplate.upsert({
    where: {
      serviceId_name: {
        serviceId: realEstateService.id,
        name: "Standard Real Estate Workflow",
      },
    },
    update: {},
    create: {
      serviceId: realEstateService.id,
      name: "Standard Real Estate Workflow",
      description: "End-to-end property acquisition journey",
      isActive: true,
    },
  });

  console.log(`  ✓  Workflow: ${realEstateWorkflow.name}`);

  const realEstateStages = [
    {
      name: "Intake Review",
      description:
        "Review client requirements, budget, and preferences from intake form",
      order: 1,
      estimatedDays: 3,
    },
    {
      name: "Four-Pillar Evaluation",
      description:
        "Assess properties across authenticity, legal standing, value, and market dynamics",
      order: 2,
      estimatedDays: 5,
    },
    {
      name: "Curated Shortlist",
      description:
        "Deliver a personalized shortlist of properties matching client criteria",
      order: 3,
      estimatedDays: 7,
    },
    {
      name: "Site Visits & Selection",
      description:
        "Coordinate property viewings and assist client in final selection",
      order: 4,
      estimatedDays: 10,
    },
    {
      name: "Acquisition Management",
      description:
        "Manage negotiations, due diligence, and transaction coordination",
      order: 5,
      estimatedDays: 14,
    },
    {
      name: "Legal & Documentation",
      description:
        "Oversee legal processes, contract review, and documentation",
      order: 6,
      estimatedDays: 10,
    },
    {
      name: "Completion",
      description: "Finalize payment, transfer of title, and handover",
      order: 7,
      estimatedDays: 5,
    },
    {
      name: "Delivered",
      description: "Project complete, property keys handed over to client",
      order: 8,
      estimatedDays: 1,
    },
  ];

  for (const stage of realEstateStages) {
    await prisma.workflowStage.upsert({
      where: {
        workflowTemplateId_order: {
          workflowTemplateId: realEstateWorkflow.id,
          order: stage.order,
        },
      },
      update: {},
      create: {
        workflowTemplateId: realEstateWorkflow.id,
        ...stage,
      },
    });
    console.log(`    ✓  Stage ${stage.order}: ${stage.name}`);
  }

  // Renewable Energy Service
  const energyService = await prisma.service.upsert({
    where: { slug: "renewable-energy" },
    update: {},
    create: {
      slug: "renewable-energy",
      name: "Renewable Energy Solutions",
      type: "RENEWABLE_ENERGY",
      description:
        "Solar energy system design, procurement, and installation for residential and commercial properties.",
      isActive: true,
    },
  });

  console.log(`\n  ✓  Service: ${energyService.name}`);

  // Energy Workflow Template
  const energyWorkflow = await prisma.workflowTemplate.upsert({
    where: {
      serviceId_name: {
        serviceId: energyService.id,
        name: "Standard Energy Workflow",
      },
    },
    update: {},
    create: {
      serviceId: energyService.id,
      name: "Standard Energy Workflow",
      description: "End-to-end renewable energy system deployment",
      isActive: true,
    },
  });

  console.log(`  ✓  Workflow: ${energyWorkflow.name}`);

  const energyStages = [
    {
      name: "Intake Review",
      description: "Review client energy needs and site requirements",
      order: 1,
      estimatedDays: 2,
    },
    {
      name: "Needs Assessment",
      description:
        "Conduct detailed energy audit and system sizing calculations",
      order: 2,
      estimatedDays: 5,
    },
    {
      name: "Consultation & Findings",
      description: "Present assessment findings and system recommendations",
      order: 3,
      estimatedDays: 3,
    },
    {
      name: "Product Matching",
      description: "Select optimal equipment and technology for client needs",
      order: 4,
      estimatedDays: 5,
    },
    {
      name: "Costed Proposal",
      description: "Deliver detailed quotation with payment terms",
      order: 5,
      estimatedDays: 7,
    },
    {
      name: "Approval & Procurement",
      description: "Secure client approval and procure equipment",
      order: 6,
      estimatedDays: 10,
    },
    {
      name: "Deployment & Installation",
      description: "Install system, test, and commission equipment",
      order: 7,
      estimatedDays: 14,
    },
    {
      name: "Monitoring & Handover",
      description:
        "Train client on system operation and provide monitoring setup",
      order: 8,
      estimatedDays: 3,
    },
  ];

  for (const stage of energyStages) {
    await prisma.workflowStage.upsert({
      where: {
        workflowTemplateId_order: {
          workflowTemplateId: energyWorkflow.id,
          order: stage.order,
        },
      },
      update: {},
      create: {
        workflowTemplateId: energyWorkflow.id,
        ...stage,
      },
    });
    console.log(`    ✓  Stage ${stage.order}: ${stage.name}`);
  }

  console.log("\n✅  Services & workflows seeded.\n");
}

main()
  .catch((e) => {
    console.error("\n❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
