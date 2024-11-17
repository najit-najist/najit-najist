import { cache } from 'react';

import { getCachedTrpcCaller } from './getCachedTrpcCaller';

export const getCachedPaymentMethods = cache(async () =>
  (await getCachedTrpcCaller()).orders.paymentMethods.get.many(),
);
