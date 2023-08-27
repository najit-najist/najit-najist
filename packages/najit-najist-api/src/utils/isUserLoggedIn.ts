import { getSessionFromCookies } from './getSessionFromCookies';
import { isTokenExpired } from '@najit-najist/pb';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export type IsUserLoggedInOptions = {
  cookies?: RequestCookies;
};

export const isUserLoggedIn = async ({
  cookies,
}: IsUserLoggedInOptions = {}) => {
  const { authContent } = await getSessionFromCookies({ cookies });

  if (!authContent) {
    return false;
  }

  if (isTokenExpired(authContent.token)) {
    return false;
  }

  return true;
};
