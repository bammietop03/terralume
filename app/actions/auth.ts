"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Role, User } from "@/types";

/** Returns the fully hydrated DB user for the current session, or null. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
  }) as Promise<User | null>;
}

/** Returns the session user or redirects to /login. */
export async function requireAuth(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Returns the session user if they have one of the required roles, otherwise redirects. */
export async function requireRole(allowed: Role | Role[]): Promise<User> {
  const user = await requireAuth();
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(user.role)) {
    redirect(
      user.role === "CLIENT"
        ? "/client-portal/dashboard"
        : "/admin-portal/dashboard",
    );
  }
  return user;
}

export async function requireClient(): Promise<User> {
  return requireRole("CLIENT");
}

export async function requireAdmin(): Promise<User> {
  return requireRole(["PM", "ADMIN"]);
}

export async function requireSuperAdmin(): Promise<User> {
  return requireRole("ADMIN");
}

/** Updates the current user's password after verifying the current one. */
export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return { ok: false, error: "Not authenticated." };

  // Verify current password via server client (user's session)
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: sessionUser.email,
    password: currentPassword,
  });
  if (signInError)
    return { ok: false, error: "Current password is incorrect." };

  // Update via admin client
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { error: updateError } = await admin.auth.admin.updateUserById(
    sessionUser.id,
    { password: newPassword },
  );
  if (updateError) return { ok: false, error: updateError.message };

  return { ok: true };
}
