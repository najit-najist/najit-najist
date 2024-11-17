import { AppRouterInput } from '@custom-types/AppRouter';
import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedOrder = cache(
  async (options: AppRouterInput['orders']['get']['one']) =>
    (await getCachedTrpcCaller()).orders.get.one(options),
);
