import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Refreshes the Supabase auth session from the proxy.
 * Must be called on every request to keep sessions alive.
 *
 * IMPORTANT: Never trust getSession() in server code.
 * Always use getUser() to verify the JWT signature.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Validate JWT signature — do NOT use getSession() here
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isClientPortal = pathname.startsWith("/client-portal");
  const isAdminPortal = pathname.startsWith("/admin-portal");
  const isProtected =
    isClientPortal || isAdminPortal || pathname.startsWith("/engagements");

  // Redirect unauthenticated users to login
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based portal access control
  if (user && (isClientPortal || isAdminPortal)) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true, onboardingComplete: true },
      });

      if (dbUser) {
        const isClient = dbUser.role === "CLIENT";

        // CLIENT trying to access admin portal → redirect to client portal
        if (isAdminPortal && isClient) {
          const redirect = request.nextUrl.clone();
          redirect.pathname = "/client-portal/dashboard";
          return NextResponse.redirect(redirect);
        }

        // PM/ADMIN trying to access client portal → redirect to admin portal
        if (isClientPortal && !isClient) {
          const redirect = request.nextUrl.clone();
          redirect.pathname = "/admin-portal/dashboard";
          return NextResponse.redirect(redirect);
        }
      }
    } catch {
      // Non-critical — let the request through if DB check fails
    }
  }

  // Redirect already-authed users away from auth pages
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthPage && user) {
    const rawRedirectTo = request.nextUrl.searchParams.get("redirectTo") ?? "";
    // Only follow relative paths to prevent open-redirect attacks
    const safePath =
      rawRedirectTo.startsWith("/") && !rawRedirectTo.startsWith("//")
        ? rawRedirectTo
        : "/admin-portal/dashboard";
    const dest = request.nextUrl.clone();
    dest.pathname = safePath;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  return supabaseResponse;
}
