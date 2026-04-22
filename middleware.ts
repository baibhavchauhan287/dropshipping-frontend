import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 🔐 Protect dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  

  return NextResponse.next();
}