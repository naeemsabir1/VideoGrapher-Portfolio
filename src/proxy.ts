import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Allow access to the login page itself
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for the admin_session cookie
  const session = request.cookies.get('admin_session');

  // If missing or not authenticated, redirect to login
  if (!session || session.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
