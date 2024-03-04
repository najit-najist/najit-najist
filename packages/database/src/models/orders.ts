import {
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { orderDeliveryMethods } from './orderDeliveryMethods';
import { orderPaymentMethods } from './orderPaymentMethods';
import { telephoneNumbers } from './telephoneNumbers';
import { users } from './users';

export enum OrderState {
  NEW = 'new',
  UNPAID = 'unpaid',
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  FINISHED = 'finished',
  DROPPED = 'dropped',
  SHIPPED = 'shipped',
}

export const userState = pgEnum('user_states', [
  OrderState.NEW,
  OrderState.UNPAID,
  OrderState.UNCONFIRMED,
  OrderState.CONFIRMED,
  OrderState.FINISHED,
  OrderState.DROPPED,
  OrderState.SHIPPED,
]);

export const orders = pgTable('orders', {
  ...modelsBase,
  subtotal: real('subtotal').notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  telephoneId: integer('telephone_id')
    .references(() => telephoneNumbers.id)
    .notNull(),
  firstName: varchar('firstname', { length: 256 }).notNull(),
  lastName: varchar('firstname', { length: 256 }).notNull(),
  paymentMethodId: integer('payment_method_id')
    .references(() => orderPaymentMethods.id)
    .notNull(),
  deliveryMethodId: integer('delivery_method_id')
    .references(() => orderDeliveryMethods.id)
    .notNull(),
  state: userState('state').default(OrderState.NEW).notNull(),

  notes: text('notes'),

  deliveryMethodPrice: integer('delivery_method_price').default(0),
  paymentMethodPrice: integer('payment_method_price').default(0),
});
