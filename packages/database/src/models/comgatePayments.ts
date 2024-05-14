import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { orders } from './orders';

export const comgatePayments = pgTable(
  'comgate_payments',
  withDefaultFields({
    redirectUrl: varchar('redirect_url', { length: 1000 }),
    transactionId: varchar('transaction_id', { length: 256 }).notNull(),
    orderId: integer('order_id')
      .references(() => orders.id)
      .notNull(),
  })
);

export type ComgatePayment = typeof comgatePayments.$inferSelect;

export const comgatePaymentsRelations = relations(
  comgatePayments,
  ({ one }) => ({
    order: one(orders, {
      fields: [comgatePayments.orderId],
      references: [orders.id],
    }),
  })
);
