import { GetManyUsersOptions } from '@najit-najist/api';
import { getLoggedInUser, getTrpcCaller } from '@najit-najist/api/server';
import { cache } from 'react';

export const getCachedLoggedInUser = cache(() =>
  getLoggedInUser().catch(() => undefined)
);

export const getCachedTrpcCaller = cache(() => getTrpcCaller());

export const getCachedUsers = cache((options?: GetManyUsersOptions) =>
  getCachedTrpcCaller().users.getMany(options)
);
