import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect to dashboard if already logged in
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
