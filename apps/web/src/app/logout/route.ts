import { SESSION_NAME } from '@najit-najist/api';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
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
