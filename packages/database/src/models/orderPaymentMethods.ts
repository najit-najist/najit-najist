import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { orderDeliveryMethods } from './orderDeliveryMethods';

export const orderPaymentMethods = pgTable(
  'order_payment_methods',
  withDefaultFields({
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description').notNull(),
    price: integer('price').default(0),
    slug: varchar('slug', { length: 256 }).notNull(),
    notes: text('notes'),
    paymentOnCheckout: boolean('payment_on_checkout').default(false),
  })
);

export type OrderPaymentMethod = typeof orderPaymentMethods.$inferSelect;

export const orderPaymentExceptDeliveryMethods = pgTable(
  'order_payment_methods_except_delivery_methods',
  {
    paymentMethodId: integer('payment_method_id')
      .references(() => orderPaymentMethods.id, { onDelete: 'cascade' })
      .notNull(),
    deliveryMethodId: integer('delivery_method_id')
      .references(() => orderDeliveryMethods.id, { onDelete: 'cascade' })
      .notNull(),
  }
);

export const orderPaymentMethodsRelations = relations(
  orderPaymentMethods,
  ({ many }) => ({
    exceptDeliveryMethods: many(orderPaymentExceptDeliveryMethods),
  })
);

export const orderPaymentExceptDeliveryMethodsRelations = relations(
  orderPaymentExceptDeliveryMethods,
  ({ one }) => ({
    paymentMethod: one(orderPaymentMethods, {
      fields: [orderPaymentExceptDeliveryMethods.paymentMethodId],
      references: [orderPaymentMethods.id],
    }),
    deliveryMethod: one(orderDeliveryMethods, {
      fields: [orderPaymentExceptDeliveryMethods.deliveryMethodId],
      references: [orderDeliveryMethods.id],
    }),
  })
);
