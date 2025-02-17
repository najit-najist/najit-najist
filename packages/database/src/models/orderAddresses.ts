import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';

import { withAddressFields } from '../internal/withAddressFields';
import { municipalities } from './municipalities';

export const orderAddresses = pgTable('order_addresses', withAddressFields({}));

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  municipality: one(municipalities, {
    fields: [orderAddresses.municipalityId],
    references: [municipalities.id],
  }),
}));

export type OrderedAddress = typeof orderAddresses.$inferSelect;
