import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { orders } from './orders';

export const orderLocalPickupTimes = pgTable(
  'orders_local_pickup_dates',
  withDefaultFields({
    date: timestamp('date', { withTimezone: true }),
    orderId: integer('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
  }),
);

export type OrderPickupTime = typeof orderLocalPickupTimes.$inferSelect;

export const orderLocalPickupTimesRelations = relations(
  orderLocalPickupTimes,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderLocalPickupTimes.orderId],
      references: [orders.id],
    }),
  }),
);
