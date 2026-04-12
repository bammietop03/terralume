import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Signs in via Supabase email/password auth.
 * Session cookies are set automatically via the SSR client.
 * Also updates last_login timestamp in the users table.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
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
        { status: 401 }
      );
    }

    // Update last login timestamp
    await prisma.user
      .update({
        where: { id: data.user.id },
        data: { lastLogin: new Date() },
      })
      .catch(() => {
        // Non-critical — don't fail the request
      });

    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({
      user: dbUser,
      session: {
        expiresAt: data.session?.expires_at,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
