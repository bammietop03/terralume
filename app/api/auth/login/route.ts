import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/login
 * Body: { email, password, portalType?: "client" | "admin" }
 *
 * Signs in via Supabase email/password auth.
 * If portalType is provided, validates the user's role matches the portal.
 * Returns user, session expiry, and the redirect URL for the correct portal.
 */
export async function POST(request: Request) {
  try {
    const { email, password, portalType } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "Login failed" },
        { status: 401 },
      );
    }

    // Update last login timestamp (non-critical)
    await prisma.user
      .update({
        where: { id: data.user.id },
        data: { lastLogin: new Date() },
      })
      .catch(() => {});

    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, email: true, role: true, onboardingComplete: true },
    });

    if (!dbUser) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Account not found. Please contact support." },
        { status: 404 },
      );
    }

    // Validate portal type against role
    if (portalType === "client" && dbUser.role !== "CLIENT") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Please use the team portal to log in." },
        { status: 403 },
      );
    }
    if (portalType === "admin" && dbUser.role === "CLIENT") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Please use the client portal to log in." },
        { status: 403 },
      );
    }

    // Determine redirect URL based on role
    let redirectUrl: string;
    if (dbUser.role === "CLIENT") {
      redirectUrl = "/client-portal/dashboard";
    } else {
      redirectUrl = "/admin-portal/dashboard";
    }

    return NextResponse.json({
      user: { id: dbUser.id, email: dbUser.email, role: dbUser.role },
      session: { expiresAt: data.session?.expires_at },
      redirectUrl,
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
