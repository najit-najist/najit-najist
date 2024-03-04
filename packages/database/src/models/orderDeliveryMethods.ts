import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const orderDeliveryMethods = pgTable('order_delivery_methods', {
  ...modelsBase,
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  notes: text('notes'),
  price: integer('price').default(0),
});
