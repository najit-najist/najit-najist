import {
  UserService,
  type UserWithRelations,
} from '@server/services/UserService';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { getLoggedInUserId } from './getLoggedInUserId';

export type GetLoggedInUserOptions = {
  cookies?: RequestCookies;
};

export const getLoggedInUser = async ({
  cookies,
}: GetLoggedInUserOptions = {}): Promise<UserWithRelations> => {
  const userId = await getLoggedInUserId({ cookies });

  return UserService.getOneBy('id', userId);
};
