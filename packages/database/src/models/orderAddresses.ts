import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { withAddressFields } from '../internal/withAddressFields';
import { municipalities } from './municipalities';
import { orders } from './orders';

export const orderAddresses = pgTable(
  'order_addresses',
  withAddressFields({
    orderId: integer('order_id')
      .references(() => orders.id)
      .notNull(),
  }),
);

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [orderAddresses.orderId],
    references: [orders.id],
  }),
  municipality: one(municipalities, {
    fields: [orderAddresses.municipalityId],
    references: [municipalities.id],
  }),
}));

export type OrderedAddress = typeof orderAddresses.$inferSelect;
