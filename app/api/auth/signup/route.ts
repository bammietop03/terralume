import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/signup
 * Body: { email, password, fullName, phone? }
 *
 * Creates a Supabase auth user then mirrors the record in the `users` table.
 * Roles are CLIENT by default — PM/ADMIN must be created by an admin.
 */
export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "email, password, and fullName are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // 1. Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message ?? "Sign-up failed" },
        { status: 400 },
      );
    }

    const userId = authData.user.id;

    // 2. Mirror user in our DB with profile fields
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        role: "CLIENT",
        fullName,
        phone: phone ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Account created. Please check your email to confirm.",
        user: { id: user.id, email: user.email, role: user.role },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
