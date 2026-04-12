import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/signup
 * Body: { email, password, fullName, phone?, role? }
 *
 * Creates a Supabase auth user then mirrors the record in the `users` table.
 * For CLIENT role, also creates a `clients` row.
 * Roles are CLIENT by default — PM/ADMIN must be set by an admin.
 */
export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "email, password, and fullName are required" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Mirror user in our DB
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        role: "CLIENT",
      },
    });

    // 3. Create client profile
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        fullName,
        phone: phone ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Account created. Please check your email to confirm.",
        user: { id: user.id, email: user.email, role: user.role },
        clientId: client.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
