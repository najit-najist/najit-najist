import { AppRouterInput } from '@custom-types/AppRouter';
import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedUsers = cache(
  async (options?: AppRouterInput['users']['getMany']) =>
    (await getCachedTrpcCaller()).users.getMany(options),
);
