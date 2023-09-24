import { NextRequest, NextResponse } from 'next/server';
import { getEdgeLoggedInUser, getEdgeSession } from '@najit-najist/api/edge';
import { LOGIN_THEN_REDIRECT_TO_PARAMETER } from '@constants';
import {
  AvailableModels,
  UserActions,
  canUser,
} from '@najit-najist/api/dist/utils/canUser';
import { UserRoles } from '@najit-najist/api/dist/schemas/user.schema';

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
    requestUrl.pathname
  );

  if (isLoggedInOnlyPath || isUnauthorizedOnlyPath) {
    const currentUser = await getEdgeLoggedInUser({ session }).catch((err) => {
      console.log({ err });

      return undefined;
    });

    if (!currentUser && isLoggedInOnlyPath) {
      const url = requestUrl.clone();
      url.pathname = '/login';

      url.searchParams.set(
        LOGIN_THEN_REDIRECT_TO_PARAMETER,
        requestUrl.pathname
      );

      return NextResponse.redirect(url);
    } else if (currentUser && isUnauthorizedOnlyPath) {
      const url = requestUrl.clone();
      url.pathname = '/muj-ucet/profil';

      const nextPathname = url.searchParams.get(
        LOGIN_THEN_REDIRECT_TO_PARAMETER
      );
      if (nextPathname) {
        url.pathname = nextPathname;
        url.searchParams.delete(LOGIN_THEN_REDIRECT_TO_PARAMETER);
      }

      return NextResponse.redirect(url);
    }

    if (currentUser && isLoggedInOnlyPath) {
      const { pathname: requestPathname, searchParams: requestSearchParams } =
        requestUrl;
      const isUnderAdministration = requestPathname.includes('/administrace');
      const isUnderRecipes = requestPathname.includes('/recepty');
      const isUnderProducts = requestPathname.includes('/produkty');
      const isUnderPosts = requestPathname.includes('/clanky');
      const createNewPathnameChunk = '/novy';
      const editorParamName = 'editor';
      const currentModel = isUnderRecipes
        ? AvailableModels.RECIPES
        : isUnderProducts
        ? AvailableModels.PRODUCTS
        : isUnderPosts
        ? AvailableModels.POST
        : null;

      if (isUnderAdministration && currentUser.role !== UserRoles.ADMIN) {
        // TODO: create new page that shows 401
        return toPathname('/muj-ucet/profil');
      }

      // Lock create new
      if (requestPathname.includes(createNewPathnameChunk)) {
        if (!currentModel) {
          throw new Error('Not implemented model rule for create new item');
        }

        if (
          !canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: currentModel,
          })
        ) {
          // TODO: create new page that shows 401
          return toPathname(
            requestPathname.replace(createNewPathnameChunk, '')
          );
        }
      }

      if (requestSearchParams.has(editorParamName)) {
        if (!currentModel) {
          throw new Error('Not implemented model rule for update new item');
        }

        if (
          !canUser(currentUser, {
            action: UserActions.UPDATE,
            onModel: currentModel,
          })
        ) {
          const newUrl = requestUrl.clone();

          // Just delete that param and editor wont activate :)
          newUrl.searchParams.delete(editorParamName);

          return NextResponse.redirect(newUrl);
        }
      }
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|files|favicon.ico).*)'],
};
