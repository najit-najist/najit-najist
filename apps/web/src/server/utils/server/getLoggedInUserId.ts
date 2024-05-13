import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { getSessionFromCookies } from '../getSessionFromCookies';

export const getLoggedInUserId = async (options?: {
  cookies?: RequestCookies;
}) => {
  const session = await getSessionFromCookies(options);
  const { userId } = session.authContent ?? {};

  if (!userId) {
    throw new Error('User needs to be logged in first');
  }

  return userId;
};
