import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession, PREVIEW_AUTH_PASSWORD } from '@najit-najist/api/edge';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getEdgeSession(request, response);

  if (process.env.NODE_ENV === 'production') {
    const UNAUTHORIZED_URL = '/unauthorized-preview';
    const UNAUTHORIZED_URL_POST = '/unauthorized-preview-post';
    const requestUrl = request.nextUrl;

    // If not logged in then redirect to unauthorized preview handler
    if (
      !session.previewAuthorized &&
      !(
        requestUrl.pathname === UNAUTHORIZED_URL ||
        requestUrl.pathname === UNAUTHORIZED_URL_POST
      )
    ) {
      const url = request.nextUrl.clone();
      url.pathname = UNAUTHORIZED_URL;
      return NextResponse.redirect(url);
    }

    // If logged in and on login page then redirect back to index
    if (
      session.previewAuthorized &&
      (requestUrl.pathname === UNAUTHORIZED_URL ||
        requestUrl.pathname === UNAUTHORIZED_URL_POST)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Handle post
    if (requestUrl.pathname === UNAUTHORIZED_URL_POST) {
      // Read body
      const [key, value] = new TextDecoder()
        .decode(
          await request.body
            ?.getReader()
            .read()
            .then(({ value }) => value)
        )
        .split('=');

      const url = request.nextUrl.clone();
      url.basePath = 'https://dev.larokinvest.cz';

      // If key is not code then do nothing
      if (key !== 'code') {
        return NextResponse.next();
      }

      if (value != PREVIEW_AUTH_PASSWORD) {
        url.pathname = UNAUTHORIZED_URL;
        url.search = new URLSearchParams([['invalid', '']]).toString();

        console.log('request failed when accessing preview');
        console.log(request);

        return NextResponse.redirect(url);
      } else {
        url.pathname = '/';
        session.previewAuthorized = true;
        await session.save();

        return NextResponse.redirect(url, {
          headers: new Headers(response.headers),
        });
      }
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
