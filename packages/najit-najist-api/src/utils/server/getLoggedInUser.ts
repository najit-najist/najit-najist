import { pocketbase } from '@najit-najist/pb';
import { User } from '@schemas';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { AvailableModels } from '../canUser';
import { deserializePocketToken } from '../deserializePocketToken';
import { getSessionFromCookies } from '../getSessionFromCookies';
import { isUserLoggedIn } from '../isUserLoggedIn';
import { AuthService } from '../../services/Auth.service.js';

export type GetLoggedInUserOptions = {
  cookies?: RequestCookies;
  authenticateApi?: boolean;
};

export const getLoggedInUser = async ({
  cookies,
  authenticateApi = true,
}: GetLoggedInUserOptions = {}): Promise<User> => {
  if (!(await isUserLoggedIn({ cookies }))) {
    throw new Error('User needs to be logged in first');
  }

  const { authContent } = await getSessionFromCookies({ cookies });
  const sessionData = deserializePocketToken(authContent!.token);

  if (authenticateApi) {
    AuthService.authPocketBase({ authContent });
  }

  const result = await pocketbase
    .collection(AvailableModels.USER)
    .getOne<User>(sessionData.id, {});

  if (authenticateApi) {
    AuthService.clearAuthPocketBase();
  }

  return result;
};
