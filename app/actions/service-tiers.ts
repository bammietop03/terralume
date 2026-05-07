"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireSuperAdmin } from "./auth";
import { logAudit } from "./audit";

export type ServiceTierInput = {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency?: string;
};

/** Public — no auth required. Used by marketing pages. */
export async function getPublicServiceTiers() {
  return prisma.serviceTier.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      currency: true,
    },
  });
}

export async function getServiceTiers() {
  await requireAdmin();
  return prisma.serviceTier.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

export async function getAllServiceTiers() {
  await requireAdmin();
  return prisma.serviceTier.findMany({
    orderBy: { price: "asc" },
  });
}

export async function createServiceTier(data: ServiceTierInput) {
  const admin = await requireSuperAdmin();

  if (!data.name?.trim()) throw new Error("Name is required.");
  if (!data.slug?.trim()) throw new Error("Slug is required.");
  if (!data.price || data.price <= 0)
    throw new Error("Price must be greater than 0.");

  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(data.slug)) {
    throw new Error(
      "Slug may only contain lowercase letters, numbers and hyphens.",
    );
  }

  const tier = await prisma.serviceTier.create({
    data: {
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: data.description?.trim() ?? null,
      price: data.price,
      currency: data.currency ?? "NGN",
      createdById: admin.id,
    },
  });

  void logAudit(admin.id, "SERVICE_TIER_CREATED", "ServiceTier", tier.id, {});
  revalidatePath("/admin-portal/settings/service-tiers");
  return tier;
}

export async function updateServiceTier(
  tierId: string,
  data: Partial<ServiceTierInput & { isActive: boolean }>,
) {
  const admin = await requireSuperAdmin();

  if (data.slug) {
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(data.slug)) {
      throw new Error(
        "Slug may only contain lowercase letters, numbers and hyphens.",
      );
    }
  }

  const tier = await prisma.serviceTier.update({
    where: { id: tierId },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.slug !== undefined && { slug: data.slug.trim() }),
      ...(data.description !== undefined && {
        description: data.description?.trim() ?? null,
      }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.currency !== undefined && { currency: data.currency }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  void logAudit(admin.id, "SERVICE_TIER_UPDATED", "ServiceTier", tier.id, {});
  revalidatePath("/admin-portal/settings/service-tiers");
  return tier;
}

export async function deleteServiceTier(tierId: string) {
  const admin = await requireSuperAdmin();
  await prisma.serviceTier.update({
    where: { id: tierId },
    data: { isActive: false },
  });
  void logAudit(
    admin.id,
    "SERVICE_TIER_DEACTIVATED",
    "ServiceTier",
    tierId,
    {},
  );
  revalidatePath("/admin-portal/settings/service-tiers");
}
