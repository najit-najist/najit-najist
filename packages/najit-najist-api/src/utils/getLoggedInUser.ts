import { User } from '@custom-types';
import { pocketbase } from '@najit-najist/pb';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { AvailableModels } from './canUser';
import { deserializePocketToken } from './deserializePocketToken';
import { getSessionFromCookies } from './getSessionFromCookies';
import { isUserLoggedIn } from './isUserLoggedIn';

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

  const result = await pocketbase
    .collection(AvailableModels.USER)
    .getOne<User>(sessionData.id, {});

  return result;
};
