import { GetManyUsersOptions } from '@najit-najist/api';
import { getLoggedInUser, UserService } from '@najit-najist/api/server';
import { cache } from 'react';

export const getCachedLoggedInUser = cache(() =>
  getLoggedInUser().catch(() => undefined)
);

export const getCachedUsers = cache((options?: GetManyUsersOptions) =>
  UserService.getMany(options)
);
