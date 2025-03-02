import { relations } from 'drizzle-orm';
import { integer, pgTable, serial } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { orderDeliveryMethods } from './orderDeliveryMethods';
import { products } from './products';

export const productsToDeliveryMethods = pgTable(
  'products_to_delivery_methods',
  withDefaultFields({
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => products.id, {
      onDelete: 'cascade',
    }),
    deliveryMethodId: integer('method_id').references(
      () => orderDeliveryMethods.id,
      {
        onDelete: 'cascade',
      },
    ),
  }),
);
