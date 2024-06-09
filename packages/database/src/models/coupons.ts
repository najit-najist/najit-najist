import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  boolean,
  index,
  timestamp,
} from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { couponPatches } from './couponPatches';
import { couponsForProductCategories } from './couponsForProductCategories';
import { couponsForProducts } from './couponsForProducts';
import { userCarts } from './userCarts';

export const coupons = pgTable(
  'coupons',
  withDefaultFields({
    name: varchar('name', { length: 12 }).unique().notNull(),
    enabled: boolean('enabled').default(true),
    validFrom: timestamp('valid_from', { mode: 'date' }),
    validTo: timestamp('valid_to', { mode: 'date' }),
  }),
  (coupons) => {
    return {
      couponsNameIndex: index('coupons_name_idx').on(coupons.name),
    };
  }
);

export const couponsRelations = relations(coupons, ({ many }) => ({
  carts: many(userCarts),
  patches: many(couponPatches),
  onlyForProducts: many(couponsForProducts),
  onlyForProductCategories: many(couponsForProductCategories),
}));

export type Coupon = typeof coupons.$inferSelect;
