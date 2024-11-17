import { AppRouterInput } from '@custom-types/AppRouter';
import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedOrders = cache(
  async (options?: AppRouterInput['orders']['get']['many']) =>
    (await getCachedTrpcCaller()).orders.get.many(options),
);
