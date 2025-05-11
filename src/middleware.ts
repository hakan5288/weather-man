import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwtCookie = request.cookies.get("token");

  const isLoggedIn = !!jwtCookie;

  const isAuthRoute = pathname.startsWith("/auth") || pathname === "/";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if(!isLoggedIn && pathname === "/"){
    return NextResponse.redirect(new URL("/auth/login" , request.url))
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
};