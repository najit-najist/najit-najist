import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { orders } from './orders';

export const comgatePayments = pgTable('comgate_payments', {
  ...modelsBase,
  transactionId: varchar('transaction_id', { length: 256 }).notNull(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
});

export const comgatePaymentsRelations = relations(
  comgatePayments,
  ({ one }) => ({
    order: one(orders, {
      fields: [comgatePayments.orderId],
      references: [orders.id],
    }),
  })
);
