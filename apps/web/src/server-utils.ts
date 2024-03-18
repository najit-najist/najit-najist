import { AppRouterInput } from '@najit-najist/api';
import { getLoggedInUser, getTrpcCaller } from '@najit-najist/api/server';
import { cache } from 'react';

export const getCachedLoggedInUser = cache(() =>
  getLoggedInUser().catch(() => undefined)
);

export const getCachedTrpcCaller = cache(() => getTrpcCaller());

export const getCachedUsers = cache(
  (options?: AppRouterInput['users']['getMany']) =>
    getCachedTrpcCaller().users.getMany(options)
);

export const getCachedDeliveryMethods = cache(() =>
  getCachedTrpcCaller().orders.deliveryMethods.get.many()
);

export const getCachedPaymentMethods = cache(() =>
  getCachedTrpcCaller().orders.paymentMethods.get.many()
);

export const getCachedOrders = cache(
  (options?: AppRouterInput['orders']['get']['many']) =>
    getCachedTrpcCaller().orders.get.many(options)
);

export const getCachedOrder = cache(
  (options: AppRouterInput['orders']['get']['one']) =>
    getCachedTrpcCaller().orders.get.one(options)
);
