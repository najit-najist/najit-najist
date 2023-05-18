import { User } from '@custom-types';
import { pocketbase } from '@najit-najist/pb';
import { AvailableModels } from './canUser';
import { deserializePocketToken } from './deserializePocketToken';
import { getSessionFromCookies } from './getSessionFromCookies';
import { isUserLoggedIn } from './isUserLoggedIn';

export const getLoggedInUser = async (): Promise<User> => {
  if (!(await isUserLoggedIn())) {
    throw new Error('User needs to be logged in first');
  }

  const { authContent } = await getSessionFromCookies();
  const sessionData = deserializePocketToken(authContent!.token);

  return pocketbase
    .collection(AvailableModels.USER)
    .getOne<User>(sessionData.id, {});
};
