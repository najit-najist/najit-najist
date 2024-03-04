import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { orderDeliveryMethods } from './orderDeliveryMethods';

export const orderPaymentMethods = pgTable('order_payment_methods', {
  ...modelsBase,
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: integer('price').default(0),
  slug: varchar('name', { length: 256 }).notNull(),
  notes: text('notes'),
  paymentOnCheckout: boolean('payment_on_checkout').default(false),
});

export const orderPaymentExceptDeliveryMethods = pgTable(
  'order_payment_methods_except_delivery_methods',
  {
    paymentMethodId: integer('payment_method_id')
      .references(() => orderPaymentMethods.id)
      .notNull(),
    deliveryMethodId: integer('delivery_method_id')
      .references(() => orderDeliveryMethods.id)
      .notNull(),
  }
);
