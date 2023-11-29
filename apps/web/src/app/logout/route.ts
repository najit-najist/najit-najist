import { logoutUser } from '@najit-najist/api/server';
import { NextRequest } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const headersList = new Headers();

  console.log('Logout executed' + String(request.nextUrl));
  logoutUser(headersList);

  headersList.set(
    'Location',
    new URL(
      '/login',
      process.env.NODE_ENV === 'production'
        ? 'https://najitnajist.cz'
        : 'http://localhost:3000'
    ).toString()
  );

  return new Response(null, {
    headers: headersList,
    status: 307,
  });
}
