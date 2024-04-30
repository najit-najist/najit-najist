import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';

export const orderDeliveryMethods = pgTable(
  'order_delivery_methods',
  withDefaultFields({
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 256 }).notNull(),
    description: text('description').notNull(),
    notes: text('notes'),
    price: integer('price').default(0),
  })
);

export type OrderDeliveryMethod = typeof orderDeliveryMethods.$inferSelect;
