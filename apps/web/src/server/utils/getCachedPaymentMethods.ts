import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedPaymentMethods = cache(() =>
  getCachedTrpcCaller().orders.paymentMethods.get.many()
);
