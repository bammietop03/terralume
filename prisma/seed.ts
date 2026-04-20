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
