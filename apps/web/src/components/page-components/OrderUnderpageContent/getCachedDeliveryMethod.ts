import { database } from '@najit-najist/database';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import { cache } from 'react';

export const getCachedDeliveryMethod = cache((id: OrderDeliveryMethod['id']) =>
  database.query.orderDeliveryMethods.findFirst({
    where: (s, { eq }) => eq(s.id, id),
  })
);
