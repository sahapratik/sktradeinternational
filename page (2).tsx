import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';

// IMPORTANT: Next.js has shipped more than one middleware authorization-bypass
// advisory (e.g. GHSA-f82v-jwr5-mffw). This project pins next@14.2.35, which
// includes the fix, and additionally does NOT rely on middleware as the only
// gate — every /api/admin/* route and admin Server Component also re-checks
// the session server-side (defense in depth, not "trust the middleware ran").
export async function middleware(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';
  if (isLoginRoute) return NextResponse.next();

  const token = request.cookies.get('sk_admin_session')?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
