import { integer, pgTable } from 'drizzle-orm/pg-core';

import { addressModelsBase } from '../internal/addressModelsBase';
import { orders } from './orders';

export const orderAddresses = pgTable('order_addresses', {
  ...addressModelsBase,
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
});
