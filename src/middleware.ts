import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_PREFIX = "sb-";
const SESSION_COOKIE_SUFFIX = "-auth-token";

/** Supabase stores the session in `sb-<project-ref>-auth-token`. */
function sessionCookieName(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    const ref = new URL(url).hostname.split(".")[0];
    return ref ? `${SESSION_COOKIE_PREFIX}${ref}${SESSION_COOKIE_SUFFIX}` : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next({ request });
  }

  const cookieName = sessionCookieName();
  const hasSession = cookieName ? request.cookies.has(cookieName) : false;

  if (!isLoginPage && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*"],
};
