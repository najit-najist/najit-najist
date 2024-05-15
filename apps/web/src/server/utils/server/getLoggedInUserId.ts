import { UserNotAuthorizedError } from '@server/errors/UserNotAuthorizedError';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { getSessionFromCookies } from '../getSessionFromCookies';

export const getLoggedInUserId = async (options?: {
  cookies?: RequestCookies;
}) => {
  const session = await getSessionFromCookies(options);
  const { userId } = session.authContent ?? {};

  if (!userId) {
    throw new UserNotAuthorizedError();
  }

  return userId;
};
