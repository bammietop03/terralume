"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import type { ArticleCategory, Role } from "@/app/generated/prisma/client";

export type ArticleAuthor = {
  id: string;
  fullName: string | null;
  preferredName: string | null;
  photoUrl: string | null;
  role: Role;
};

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorId: string;
  author: ArticleAuthor;
  publishedAt: Date;
  readTime: number;
  category: ArticleCategory;
  image: string;
  featured: boolean;
  body: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const AUTHOR_SELECT = {
  id: true,
  fullName: true,
  preferredName: true,
  photoUrl: true,
  role: true,
} as const;

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getArticles(): Promise<ArticleRow[]> {
  return prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: AUTHOR_SELECT } },
  }) as Promise<ArticleRow[]>;
}

export async function getPublishedArticles(): Promise<ArticleRow[]> {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: AUTHOR_SELECT } },
  }) as Promise<ArticleRow[]>;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleRow | null> {
  return prisma.article.findUnique({
    where: { slug },
    include: { author: { select: AUTHOR_SELECT } },
  }) as Promise<ArticleRow | null>;
}

// ─── Write (admin-only) ───────────────────────────────────────────────────────

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO date string
  readTime: number;
  category: ArticleCategory;
  image: string;
  featured: boolean;
  body: string | null; // Markdown
  published: boolean;
}

export async function createArticle(
  input: ArticleInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const user = await requireAdmin();
    const article = await prisma.article.create({
      data: {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        authorId: user.id,
        publishedAt: new Date(input.publishedAt),
        readTime: input.readTime,
        category: input.category,
        image: input.image,
        featured: input.featured,
        body: input.body ?? undefined,
        published: input.published,
      },
    });
    revalidatePath("/market-intelligence");
    revalidatePath("/admin-portal/market-intelligence");
    return { ok: true, id: article.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Unique constraint") && message.includes("slug")) {
      return { ok: false, error: "A article with that slug already exists." };
    }
    return { ok: false, error: message };
  }
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await prisma.article.update({
      where: { id },
      data: {
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.title !== undefined && { title: input.title }),
        ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
        ...(input.publishedAt !== undefined && {
          publishedAt: new Date(input.publishedAt),
        }),
        ...(input.readTime !== undefined && { readTime: input.readTime }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.image !== undefined && { image: input.image }),
        ...(input.featured !== undefined && { featured: input.featured }),
        ...(input.body !== undefined && { body: input.body ?? undefined }),
        ...(input.published !== undefined && { published: input.published }),
      },
    });
    revalidatePath("/market-intelligence");
    revalidatePath(`/market-intelligence/${input.slug}`);
    revalidatePath("/admin-portal/market-intelligence");
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Unique constraint") && message.includes("slug")) {
      return { ok: false, error: "A article with that slug already exists." };
    }
    return { ok: false, error: message };
  }
}

export async function deleteArticle(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await prisma.article.delete({ where: { id } });
    revalidatePath("/market-intelligence");
    revalidatePath("/admin-portal/market-intelligence");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function toggleArticlePublished(
  id: string,
  published: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await prisma.article.update({ where: { id }, data: { published } });
    revalidatePath("/market-intelligence");
    revalidatePath("/admin-portal/market-intelligence");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
