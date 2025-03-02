import { integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';

import { orderDeliveryMethods } from './orderDeliveryMethods';
import { products } from './products';

export const productsToDeliveryMethods = pgTable(
  'products_to_delivery_methods',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    deliveryMethodSlug: varchar('method_slug')
      .references(() => orderDeliveryMethods.slug, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (schema) => [unique().on(schema.productId, schema.deliveryMethodSlug)],
);

export type ProductToDeliveryMethod =
  typeof productsToDeliveryMethods.$inferSelect;
