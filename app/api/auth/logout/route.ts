import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/logout
 *
 * Signs out the current user and clears auth cookies.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[logout]", err);
  }

  return NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    { status: 303 },
  );
}
