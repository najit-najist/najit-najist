import { logoutUser } from '@najit-najist/api/server';
import { NextRequest } from 'next/server';

export const revalidate = 0;

export function GET(request: NextRequest) {
  const headersList = new Headers();

  console.log('Logout executed' + String(request.nextUrl));
  logoutUser(headersList);

  headersList.set(
    'Location',
    new URL('/login', 'https://dev.najitnajist.cz').toString()
  );

  return new Response(null, {
    headers: headersList,
    status: 307,
  });
}
