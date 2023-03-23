import { NextRequest, NextResponse } from 'next/server';
import { SESSION_NAME } from '@najit-najist/api';
import { getEdgeSession, PREVIEW_AUTH_PASSWORD } from '@najit-najist/api/edge';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getEdgeSession(request, response);

  if (process.env.NODE_ENV === 'production') {
    if (!session.previewAuthorized) {
      if (request.method.toUpperCase() === 'POST') {
        const [key, value] = new TextDecoder()
          .decode(
            await request.body
              ?.getReader()
              .read()
              .then(({ value }) => value)
          )
          .split('=');

        const url = request.nextUrl.clone();

        if (key !== 'code') {
          return NextResponse.next();
        }

        if (value != PREVIEW_AUTH_PASSWORD) {
          url.pathname = '/unauthorized-preview';

          return NextResponse.rewrite(url);
        } else {
          url.pathname = '/';
          session.previewAuthorized = true;
          await session.save();

          return NextResponse.redirect(url, {
            headers: new Headers(response.headers),
          });
        }
      } else {
        const url = request.nextUrl.clone();
        if (!url.pathname.startsWith('/unauthorized-preview')) {
          url.pathname = '/unauthorized-preview';

          return NextResponse.redirect(url);
        }

        return response;
      }
    } else if (request.nextUrl.pathname.startsWith('/unauthorized-preview')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  if (request.nextUrl.pathname.startsWith('/logout')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';

    const response = NextResponse.redirect(url, {
      headers: new Headers(request.headers),
    });

    response.cookies.delete(SESSION_NAME);

    return NextResponse.redirect(url, {
      // Bug in next - we have to pass headers again
      headers: response.headers,
    });
  }

  if (request.nextUrl.pathname.startsWith('/login') && session.userToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal';

    return NextResponse.redirect(url);
  }

  return response;
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
