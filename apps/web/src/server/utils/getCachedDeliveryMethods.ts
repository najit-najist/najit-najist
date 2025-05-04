import { database } from '@najit-najist/database';
import { cache } from 'react';

export const getCachedDeliveryMethods = cache(() =>
  database.query.orderDeliveryMethods.findMany({
    where: (schema, { not, eq }) => not(eq(schema.disabled, true)),
  }),
);
