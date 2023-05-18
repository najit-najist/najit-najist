import { getSessionFromCookies } from './getSessionFromCookies';
import { isTokenExpired } from '@najit-najist/pb';

export const isUserLoggedIn = async () => {
  const { authContent } = await getSessionFromCookies();

  if (!authContent) {
    return false;
  }

  if (isTokenExpired(authContent.token)) {
    return false;
  }

  return true;
};
