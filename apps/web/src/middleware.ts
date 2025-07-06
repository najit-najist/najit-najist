import { LOGIN_THEN_REDIRECT_TO_PARAMETER } from '@constants';
import { User, UserRoles } from '@najit-najist/database/models';
import { getEdgeSession } from '@server/utils/edge';
import { NextRequest, NextResponse } from 'next/server';

const loggedInPathsRegex = new RegExp(
  `^\/(administrace|muj-ucet\/objednavky|muj-ucet\/profil|recepty|preview-special)[^\n]*$`,
  'g',
);

const unauthorizedOnlyPaths = new RegExp(
  `\/(login|registrace|zapomenute-heslo|zmena-emailu)[^\n]*$`,
  'g',
);

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const requestUrl = request.nextUrl;
  const session = await getEdgeSession(request, response);

  const toPathname = (pathname: string, url = requestUrl.clone()) => {
    url.pathname = pathname;

    return NextResponse.redirect(url);
  };

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
      return toPathname(UNAUTHORIZED_URL);
    }

    // If logged in and on login page then redirect back to index
    if (session.previewAuthorized && requestUrl.pathname === UNAUTHORIZED_URL) {
      return toPathname('/');
    }
  }

  const isLoggedInOnlyPath = loggedInPathsRegex.test(requestUrl.pathname);
  const isUnauthorizedOnlyPath = unauthorizedOnlyPaths.test(
    requestUrl.pathname,
  );
  if (isLoggedInOnlyPath || isUnauthorizedOnlyPath) {
    const headers = new Headers();
    const parentCookie = request.headers.get('cookie');
    if (parentCookie) {
      headers.set('cookie', parentCookie);
    }

    const currentUserResponse = await fetch(
      `http://localhost:${process.env.PORT}/api/muj-ucet/profil`,
      { headers },
    );
    const currentUser = (await currentUserResponse.json()) as User;

    if (!currentUser && isLoggedInOnlyPath) {
      const url = requestUrl.clone();
      url.pathname = '/login';

      if (requestUrl.pathname.startsWith('/muj-ucet/objednavky/')) {
        url.pathname = requestUrl.pathname.replace('/muj-ucet/', '');

        return NextResponse.redirect(url);
      }

      url.searchParams.set(
        LOGIN_THEN_REDIRECT_TO_PARAMETER,
        requestUrl.pathname,
      );

      return NextResponse.redirect(url);
    } else if (currentUser && isUnauthorizedOnlyPath) {
      const url = requestUrl.clone();
      url.pathname = '/muj-ucet/profil';

      const nextPathname = url.searchParams.get(
        LOGIN_THEN_REDIRECT_TO_PARAMETER,
      );
      if (nextPathname) {
        url.pathname = nextPathname;
        url.searchParams.delete(LOGIN_THEN_REDIRECT_TO_PARAMETER);
      }

      return NextResponse.redirect(url);
    }

    if (currentUser && isLoggedInOnlyPath) {
      const { pathname: requestPathname } = requestUrl;
      const isUnderAdministration = requestPathname.includes('/administrace');

      if (isUnderAdministration && currentUser.role !== UserRoles.ADMIN) {
        const url = requestUrl.clone();
        url.pathname = '/unauthorized';

        return NextResponse.rewrite(url);
      }
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|files|favicon.ico).*)'],
};
