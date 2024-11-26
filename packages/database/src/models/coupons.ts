import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  boolean,
  index,
  timestamp,
  integer,
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
    minimalProductCount: integer('minimal_product_count').default(0).notNull(),
  }),
  (coupons) => {
    return {
      couponsNameIndex: index('coupons_name_idx').on(coupons.name),
    };
  },
);

export const couponsRelations = relations(coupons, ({ many }) => ({
  carts: many(userCarts),
  patches: many(couponPatches),
  onlyForProducts: many(couponsForProducts),
  onlyForProductCategories: many(couponsForProductCategories),
}));

export type Coupon = typeof coupons.$inferSelect;
