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
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("[logout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
