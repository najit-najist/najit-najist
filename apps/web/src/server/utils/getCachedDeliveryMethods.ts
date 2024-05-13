import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedDeliveryMethods = cache(() =>
  getCachedTrpcCaller().orders.deliveryMethods.get.many()
);
