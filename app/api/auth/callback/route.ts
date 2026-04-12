import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback?code=xxx&next=/dashboard
 *
 * Exchanges the OAuth / magic-link code for a Supabase session.
 * Supabase redirects here after email confirmation or OAuth.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the originally requested page (or dashboard)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no code or exchange failed, redirect to an error page
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
