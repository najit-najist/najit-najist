import {
  PocketBase,
  Record,
  isTokenExpired,
  pocketbase,
} from '@najit-najist/pb';
import { User } from '@schemas';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { AvailableModels } from '../canUser';
import { getSessionFromCookies } from '../getSessionFromCookies';
import { isUserLoggedIn } from '../isUserLoggedIn';
import jwtDecode from 'jwt-decode';
import { UserTokenData } from '@custom-types';
import { IronSessionData } from 'iron-session/edge';

export type GetEdgeLoggedInUserOptions = {
  session: IronSessionData;
};

export const getEdgeLoggedInUser = async ({
  session,
}: GetEdgeLoggedInUserOptions): Promise<User> => {
  const tokenExpired = isTokenExpired(session.authContent?.token ?? '');

  if (tokenExpired) {
    throw new Error('User needs to be logged in first');
  }

  const sessionData = jwtDecode<UserTokenData>(
    session.authContent?.token ?? ''
  );

  pocketbase.authStore.save(
    session.authContent!.token,
    new Record(session.authContent!.model)
  );

  const result = await pocketbase
    .collection(AvailableModels.USER)
    .getOne<User>(sessionData.id, {});

  pocketbase.authStore.clear();

  return result;
};
