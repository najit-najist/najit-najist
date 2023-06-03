import { logoutUser } from '@najit-najist/api/server';
import { NextRequest } from 'next/server';

export const revalidate = 0;

export function GET(request: NextRequest) {
  const headersList = new Headers();

  console.log('Logout executed' + request.nextUrl.basePath);
  logoutUser(headersList);

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  headersList.set('Location', url.toString());

  return new Response(null, {
    headers: headersList,
    status: 307,
  });
}
