import { PacketaPickupPointType } from '@najit-najist/packeta';
import { relations } from 'drizzle-orm';
import { bigint, integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { orders } from './orders';

export const packetaParcelTypes = pgEnum('packeta_parcel_Types', [
  PacketaPickupPointType.EXTERNAL,
  PacketaPickupPointType.INTERNAL,
]);

export const packetaParcels = pgTable(
  'packeta_parcels',
  withDefaultFields({
    addressId: varchar('address_id').notNull(),
    addressType: packetaParcelTypes('address_type').notNull(),

    packetId: bigint('packet_id', { mode: 'number' }).notNull(),
    packetBarcodeRaw: varchar('packet_barcode_raw').notNull(),
    packetBarcodePretty: varchar('packet_barcode_pretty').notNull(),

    orderId: integer('order_id')
      .references(() => orders.id)
      .notNull(),
  })
);

export const packetaParcelsRelations = relations(packetaParcels, ({ one }) => ({
  order: one(orders, {
    fields: [packetaParcels.orderId],
    references: [orders.id],
  }),
}));
