import { UserService, UserWithRelations } from '@services/UserService.js';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { getSessionFromCookies } from '../getSessionFromCookies';

export type GetLoggedInUserOptions = {
  cookies?: RequestCookies;
};

export const getLoggedInUser = async ({
  cookies,
}: GetLoggedInUserOptions = {}): Promise<UserWithRelations> => {
  const session = await getSessionFromCookies({ cookies });
  const { userId } = session.authContent ?? {};

  if (!userId) {
    throw new Error('User needs to be logged in first');
  }

  return UserService.getOneBy('id', userId);
};
