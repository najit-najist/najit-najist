import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { AUTHORIZATION_HEADER } from '../../index.js';
import { User } from '../../schemas/user.schema.js';
import { UserService } from '../../services/User.service.js';
import { deserializePocketToken } from '../deserializePocketToken';
import { getSessionFromCookies } from '../getSessionFromCookies';
import { isUserLoggedIn } from '../isUserLoggedIn';

export type GetLoggedInUserOptions = {
  cookies?: RequestCookies;
};

export const getLoggedInUser = async ({
  cookies,
}: GetLoggedInUserOptions = {}): Promise<User> => {
  if (!(await isUserLoggedIn({ cookies }))) {
    throw new Error('User needs to be logged in first');
  }

  const { authContent } = await getSessionFromCookies({ cookies });
  const sessionData = deserializePocketToken(authContent!.token);

  return await UserService.getBy('id', sessionData.id, {
    headers: {
      [AUTHORIZATION_HEADER]: authContent!.token,
    },
  });
};
