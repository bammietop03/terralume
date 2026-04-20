"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireRole } from "./auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { welcomeEmailHtml } from "@/lib/email-templates";
import type { Role } from "@/types";

const PORTAL_BASE =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.terralume.com";

// ── Types ──────────────────────────────────────────────────────────────────

export type UserWithStats = Awaited<ReturnType<typeof getAllUsers>>[number];

// ── Queries ────────────────────────────────────────────────────────────────

/** All users (all roles) — ADMIN only. */
export async function getAllUsers() {
  await requireRole("ADMIN");
  return prisma.user.findMany({
    include: {
      _count: {
        select: { engagements: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** CLIENT users only — ADMIN only. */
export async function getClientUsers() {
  await requireRole("ADMIN");
  return prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      assignedPm: { select: { id: true, fullName: true, photoUrl: true } },
      _count: {
        select: { engagements: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** PM and ADMIN users only — ADMIN only. */
export async function getStaffUsers() {
  await requireRole("ADMIN");
  return prisma.user.findMany({
    where: { role: { in: ["PM", "ADMIN"] } },
    include: {
      _count: {
        select: { engagements: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** CLIENT users assigned to the calling PM — PM or ADMIN. */
export async function getMyAssignedClients() {
  const pm = await requireAdmin();
  return prisma.user.findMany({
    where: { role: "CLIENT", assignedPmId: pm.id },
    include: {
      _count: {
        select: { engagements: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type MyAssignedClientWithStats = Awaited<
  ReturnType<typeof getMyAssignedClients>
>[number];

// ── Mutations ──────────────────────────────────────────────────────────────

export type CreateUserInput = {
  email: string;
  fullName: string;
  preferredName?: string;
  role: Role;
  phone?: string;
};

/**
 * Creates a Supabase auth user + Prisma user record, then sends a welcome
 * email containing a password-setup link.
 */
export async function createUser(input: CreateUserInput) {
  await requireRole("ADMIN");

  const adminClient = createAdminClient();

  // 1. Create Supabase auth user (email already confirmed)
  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: input.email,
      email_confirm: true,
      user_metadata: { full_name: input.fullName },
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message ?? "Failed to create auth user");
  }

  const uid = authData.user.id;

  // 2. Create Prisma record
  const user = await prisma.user.create({
    data: {
      id: uid,
      email: input.email,
      fullName: input.fullName,
      preferredName: input.preferredName ?? null,
      role: input.role,
      phone: input.phone ?? null,
    },
  });

  // 3. Generate password-setup link (recovery = password reset flow)
  const { data: linkData, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: input.email,
    });

  const setupUrl =
    !linkError && linkData?.properties?.action_link
      ? linkData.properties.action_link
      : `${PORTAL_BASE}/reset-password`;

  // 4. Send welcome email
  try {
    await sendEmail({
      to: input.email,
      subject: "Welcome to Terralume — set up your account",
      html: welcomeEmailHtml({
        clientName: input.fullName,
        loginUrl: setupUrl,
      }),
    });
  } catch {
    // Email failure should not roll back user creation
  }

  revalidatePath("/admin-portal/users/clients");
  revalidatePath("/admin-portal/users/staff");
  return user;
}

// ──────────────────────────────────────────────────────────────────────────

export type UpdateUserInput = {
  fullName?: string;
  preferredName?: string;
  role?: Role;
  phone?: string;
};

/** Updates non-auth user fields. Email changes are not supported here. */
export async function updateUser(id: string, input: UpdateUserInput) {
  await requireAdmin();

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(input.fullName !== undefined && { fullName: input.fullName }),
      ...(input.preferredName !== undefined && {
        preferredName: input.preferredName,
      }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.phone !== undefined && { phone: input.phone }),
    },
  });

  revalidatePath("/admin-portal/users/clients");
  revalidatePath("/admin-portal/users/staff");
  return user;
}

// ──────────────────────────────────────────────────────────────────────────

/** Hard-deletes the user from Supabase Auth and the database. */
export async function deleteUser(id: string) {
  await requireRole("ADMIN");

  const adminClient = createAdminClient();

  // Delete from Supabase Auth first (Prisma cascade handles DB relations)
  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) {
    throw new Error(error.message);
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin-portal/users/clients");
  revalidatePath("/admin-portal/users/staff");
}

// ── Self-service: update own profile ──────────────────────────────────────

export type UpdateProfileInput = {
  fullName?: string;
  preferredName?: string;
  phone?: string;
  nationality?: string;
  location?: string;
  photoUrl?: string;
};

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<{ success: boolean; error?: string }> {
  const { getSessionUser } = await import("./auth");
  const sessionUser = await getSessionUser();
  if (!sessionUser) return { success: false, error: "Not authenticated." };

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      ...(input.fullName !== undefined && { fullName: input.fullName.trim() }),
      ...(input.preferredName !== undefined && {
        preferredName: input.preferredName.trim() || null,
      }),
      ...(input.phone !== undefined && {
        phone: input.phone.trim() || null,
      }),
      ...(input.nationality !== undefined && {
        nationality: input.nationality.trim() || null,
      }),
      ...(input.location !== undefined && {
        location: input.location.trim() || null,
      }),
      ...(input.photoUrl !== undefined && { photoUrl: input.photoUrl }),
    },
  });

  revalidatePath("/client-portal/profile");
  revalidatePath("/admin-portal/settings");
  return { success: true };
}
