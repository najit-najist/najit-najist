import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { comgatePayments } from './comgatePayments';
import { couponPatches } from './couponPatches';
import { orderAddresses } from './orderAddresses';
import { orderDeliveryMethods } from './orderDeliveryMethods';
import { orderLocalPickupTimes } from './orderLocalPickupDates';
import { orderPaymentMethods } from './orderPaymentMethods';
import { orderedProducts } from './orderedProducts';
import { packetaParcels } from './packetaParcels';
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

export const orders = pgTable(
  'orders',
  withDefaultFields({
    subtotal: real('subtotal').notNull(),
    discount: real('discount').notNull().default(0),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 256 }).notNull(),
    telephoneId: integer('telephone_id')
      .references(() => telephoneNumbers.id)
      .notNull(),
    firstName: varchar('firstname', { length: 256 }).notNull(),
    lastName: varchar('lastname', { length: 256 }).notNull(),
    paymentMethodId: integer('payment_method_id')
      .references(() => orderPaymentMethods.id, { onDelete: 'restrict' })
      .notNull(),
    deliveryMethodId: integer('delivery_method_id')
      .references(() => orderDeliveryMethods.id, { onDelete: 'restrict' })
      .notNull(),
    state: userState('state').default(OrderState.NEW).notNull(),

    addressId: integer('address_id')
      .references(() => orderAddresses.id, {
        onDelete: 'restrict',
      })
      .notNull(),

    invoiceAddressId: integer('invoice_address_id').references(
      () => orderAddresses.id,
      {
        onDelete: 'restrict',
      },
    ),

    ico: varchar('ico'),
    dic: varchar('dic'),

    notes: text('notes'),
    deliveryMethodPrice: integer('delivery_method_price').default(0),
    paymentMethodPrice: integer('payment_method_price').default(0),

    couponPatchId: integer('coupon_patch_id').references(
      () => couponPatches.id,
      {
        onDelete: 'restrict',
      },
    ),
  }),
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  telephone: one(telephoneNumbers, {
    fields: [orders.telephoneId],
    references: [telephoneNumbers.id],
  }),
  paymentMethod: one(orderPaymentMethods, {
    fields: [orders.paymentMethodId],
    references: [orderPaymentMethods.id],
  }),
  deliveryMethod: one(orderDeliveryMethods, {
    fields: [orders.deliveryMethodId],
    references: [orderDeliveryMethods.id],
  }),
  couponPatch: one(couponPatches, {
    fields: [orders.couponPatchId],
    references: [couponPatches.id],
  }),
  address: one(orderAddresses, {
    fields: [orders.addressId],
    references: [orderAddresses.id],
    relationName: 'order_to_address_relation',
  }),
  invoiceAddress: one(orderAddresses, {
    fields: [orders.invoiceAddressId],
    references: [orderAddresses.id],
    relationName: 'order_to_invoice_address_relation',
  }),
  orderedProducts: many(orderedProducts),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  pickupDate: one(orderLocalPickupTimes),
  comgatePayment: one(comgatePayments),
  packetaShipment: one(packetaParcels),
}));

export type Order = typeof orders.$inferSelect;
