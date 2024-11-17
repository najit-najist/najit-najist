import { database } from '@najit-najist/database';
import { cache } from 'react';

export const getCachedDeliveryMethods = cache(() =>
  database.query.orderDeliveryMethods.findMany(),
);
