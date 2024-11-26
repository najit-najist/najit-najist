import { database } from '@najit-najist/database';
import { Order } from '@najit-najist/database/models';
import { cache } from 'react';

export const getCachedLocalPickupDate = cache((orderId: Order['id']) =>
  database.query.orderLocalPickupTimes.findFirst({
    where: (s, { eq }) => eq(s.orderId, orderId),
  }),
);
