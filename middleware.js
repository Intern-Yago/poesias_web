import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect /poeta route
  if (pathname.startsWith('/poeta')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const legacyToken = req.cookies.get("token")?.value || req.cookies.get("token");

    if (!token && !legacyToken) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/poeta/:path*'],
};