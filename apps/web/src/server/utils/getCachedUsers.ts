import { AppRouterInput } from '@custom-types/AppRouter';
import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedUsers = cache(
  (options?: AppRouterInput['users']['getMany']) =>
    getCachedTrpcCaller().users.getMany(options)
);
