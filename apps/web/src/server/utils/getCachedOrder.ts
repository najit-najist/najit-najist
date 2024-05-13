import { AppRouterInput } from '@custom-types/AppRouter';
import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedOrder = cache(
  (options: AppRouterInput['orders']['get']['one']) =>
    getCachedTrpcCaller().orders.get.one(options)
);
