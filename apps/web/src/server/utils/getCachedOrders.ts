import { AppRouterInput } from '@custom-types/AppRouter';
import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedOrders = cache(
  (options?: AppRouterInput['orders']['get']['many']) =>
    getCachedTrpcCaller().orders.get.many(options)
);
