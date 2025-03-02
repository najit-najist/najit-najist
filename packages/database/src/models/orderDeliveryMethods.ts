import { integer, pgTable, text, unique, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';

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
        OrderDeliveryMethodsSlug.DELIVERY_HRADEC_KRALOVE,
      ],
    }).notNull(),
    description: text('description').notNull(),
    notes: text('notes'),
    price: integer('price').default(0),
  }),
  (schema) => [unique().on(schema.slug)],
);

export type OrderDeliveryMethod = typeof orderDeliveryMethods.$inferSelect;
