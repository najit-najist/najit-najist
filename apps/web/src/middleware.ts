import { NextRequest, NextResponse } from 'next/server';
import { getEdgeLoggedInUser, getEdgeSession } from '@najit-najist/api/edge';
import { LOGIN_THEN_REDIRECT_TO_PARAMETER } from '@constants';
import {
  AvailableModels,
  UserActions,
  canUser,
} from '@najit-najist/api/dist/utils/canUser';
import { UserRoles } from '@najit-najist/api';

const loggedInPathsRegex = new RegExp(
  `\/(produkty\/[^\n]+|(administrace|muj-ucet|recepty|preview-special)[^\n]*|clanky\/novy)$`,
  'g'
);

const unauthorizedOnlyPaths = new RegExp(
  `\/(login|registrace|zapomenute-heslo|zmena-emailu)[^\n]*$`,
  'g'
);

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const requestUrl = request.nextUrl;
  const session = await getEdgeSession(request, response);

  const toPathname = (pathname: string) => {
    const url = requestUrl.clone();
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
    requestUrl.pathname
  );

  if (isLoggedInOnlyPath || isUnauthorizedOnlyPath) {
    const currentUser = await getEdgeLoggedInUser({ session }).catch(
      (err) => undefined
    );

    if (!currentUser && isLoggedInOnlyPath) {
      const url = requestUrl.clone();
      url.pathname = '/login';

      url.searchParams.set(
        LOGIN_THEN_REDIRECT_TO_PARAMETER,
        requestUrl.pathname
      );

      return NextResponse.redirect(url);
    } else if (currentUser && isUnauthorizedOnlyPath) {
      return toPathname('/muj-ucet/profil');
    }

    if (currentUser && isLoggedInOnlyPath) {
      const pathname = requestUrl.pathname;

      if (
        pathname.includes('/administrace') &&
        currentUser.role !== UserRoles.ADMIN
      ) {
        // TODO: create new page that shows 401
        return toPathname('/muj-ucet/profil');
      }

      // Lock create new
      if (pathname.includes('/novy')) {
        let currentModel = pathname.includes('/recepty')
          ? AvailableModels.RECIPES
          : pathname.includes('/produkty')
          ? AvailableModels.PRODUCTS
          : AvailableModels.POST;

        if (
          !canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: currentModel,
          })
        ) {
          // TODO: create new page that shows 401
          return toPathname(pathname.replace('/novy', ''));
        }
      }
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|files|favicon.ico).*)'],
};
