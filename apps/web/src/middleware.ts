import { NextRequest, NextResponse } from 'next/server';
import { SESSION_NAME } from '@najit-najist/api';

export async function middleware(request: NextRequest) {
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

  if (
    request.nextUrl.pathname.startsWith('/login') &&
    request.cookies.has(SESSION_NAME)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal';

    return NextResponse.redirect(url);
  }
}
