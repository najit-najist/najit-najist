import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession } from '@najit-najist/api/edge';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getEdgeSession(request, response);

  if (
    process.env.NODE_ENV === 'production' &&
    !!process.env.PREVIEW_AUTH_PASSWORD
  ) {
    const UNAUTHORIZED_URL = '/unauthorized-preview';
    const requestUrl = request.nextUrl;

    // If not logged in then redirect to unauthorized preview handler
    if (
      !session.previewAuthorized &&
      !(requestUrl.pathname === UNAUTHORIZED_URL)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = UNAUTHORIZED_URL;
      return NextResponse.redirect(url);
    }

    // If logged in and on login page then redirect back to index
    if (session.previewAuthorized && requestUrl.pathname === UNAUTHORIZED_URL) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
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
    '/((?!_next/static|_next/image|files|favicon.ico).*)',
  ],
};
