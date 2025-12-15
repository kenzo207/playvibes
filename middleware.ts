import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that do not require authentication
  const publicPaths = ["/", "/browse", "/login", "/register", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Check for session cookie
  // Better Auth typically uses "better-auth.session_token"
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Protected Routes Logic
  // If no session and trying to access protected route (manage, saved, profile)
  if (!sessionToken && !isPublicPath) {
    // Specifically protect these routes
    const protectedPrefixes = ["/manage", "/saved", "/profile"];
    if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auth Routes Logic
  // If session exists and trying to access login/register
  if (sessionToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/browse", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
