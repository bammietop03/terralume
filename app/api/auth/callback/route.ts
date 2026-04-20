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
  const next = searchParams.get("next") ?? "/admin-portal/dashboard";

  // Supabase forwards its own errors as query params when verification fails
  const supabaseError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  if (supabaseError) {
    console.warn(
      "[auth/callback] Supabase error redirect:",
      Object.fromEntries(searchParams),
    );
    // Send user back to the right page with a meaningful error
    const destination = next.startsWith("/reset-password")
      ? `/reset-password?error=${encodeURIComponent(errorCode ?? supabaseError)}`
      : `/login?error=${encodeURIComponent(errorCode ?? supabaseError)}`;
    return NextResponse.redirect(`${origin}${destination}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth/callback] exchange failed:", error.message, error);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
