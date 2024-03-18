import { LOGIN_THEN_REDIRECT_TO_PARAMETER } from '@constants';
import { getEdgeSession, canUser, UserActions } from '@najit-najist/api/edge';
import {
  User,
  UserRoles,
  posts,
  products,
  recipes,
  users,
} from '@najit-najist/database/models';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { NextRequest, NextResponse } from 'next/server';

const loggedInPathsRegex = new RegExp(
  `^\/((administrace|muj-ucet|recepty|preview-special|produkty)[^\n]*|clanky\/novy)$`,
  'g'
);

const unauthorizedOnlyPaths = new RegExp(
  `\/(login|registrace|zapomenute-heslo|zmena-emailu)[^\n]*$`,
  'g'
);

const routesToModels: [RegExp, PgTableWithColumns<any>][] = [
  [/\/uzivatele/, users],
  [/\/recepty/, recipes],
  [/\/produkty/, products],
  [/\/clanky/, posts],
];

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
    const currentUserResponse = await fetch(
      'http://localhost:4000/api/muj-ucet/profil',
      { headers: request.headers }
    );
    const currentUser = (await currentUserResponse.json()) as User;

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
      const createNewPathnameChunk = '/novy';
      const editorParamName = 'editor';

      if (isUnderAdministration && currentUser.role !== UserRoles.ADMIN) {
        // TODO: create new page that shows 401
        return toPathname('/muj-ucet/profil');
      }

      const modelForRoute = routesToModels.find(([matcher]) =>
        matcher.test(requestPathname)
      );

      // Lock create new
      if (requestPathname.includes(createNewPathnameChunk)) {
        if (!modelForRoute) {
          throw new Error(
            `Not implemented model rule for create new item ${createNewPathnameChunk} ${requestPathname}`
          );
        }

        if (
          !canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: modelForRoute[1],
          })
        ) {
          // TODO: create new page that shows 401
          return toPathname(
            requestPathname.replace(createNewPathnameChunk, '')
          );
        }
      }

      // log editor
      if (requestSearchParams.has(editorParamName)) {
        if (!modelForRoute?.[1]) {
          throw new Error('Not implemented model rule for update new item');
        }

        if (
          !canUser(currentUser, {
            action: UserActions.UPDATE,
            onModel: modelForRoute[1],
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
