import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin routes to use Next.js routing
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    console.log(`Accessing Next.js route: ${pathname}`);
    return NextResponse.next();
  }

  // Allow API routes to use Next.js routing
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For static files (images, CSS, JS), serve directly
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // For main site routes, let Next.js rewrites handle serving HTML files
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
