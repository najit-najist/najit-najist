import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { productsToDeliveryMethods } from './productsToDeliveryMethods';

export enum OrderDeliveryMethodsSlug {
  PACKETA = 'send',
  BALIKOVNA = 'send-balikovna',
  LOCAL_PICKUP = 'local-pickup',
  DELIVERY_HRADEC_KRALOVE = 'delivery-hradec-kralove',
}

export const orderDeliveryMethods = pgTable(
  'order_delivery_methods',
  withDefaultFields({
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', {
      length: 256,
      enum: [
        OrderDeliveryMethodsSlug.PACKETA,
        OrderDeliveryMethodsSlug.BALIKOVNA,
        OrderDeliveryMethodsSlug.LOCAL_PICKUP,
      ],
    }).notNull(),
    description: text('description').notNull(),
    notes: text('notes'),
    price: integer('price').default(0),
  }),
);

export type OrderDeliveryMethod = typeof orderDeliveryMethods.$inferSelect;
