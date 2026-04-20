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
