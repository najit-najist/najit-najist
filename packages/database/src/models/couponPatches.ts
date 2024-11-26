import { relations } from 'drizzle-orm';
import { pgTable, integer } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { coupons } from './coupons';
import { orders } from './orders';

export const couponPatches = pgTable(
  'coupon_patches',
  withDefaultFields({
    couponId: integer('coupon_id')
      .references(() => coupons.id, { onDelete: 'cascade' })
      .notNull(),
    reductionPrice: integer('reduction_price').default(0),
    reductionPercentage: integer('reduction_percentage').default(0),
  }),
);

export const couponPatchesRelations = relations(
  couponPatches,
  ({ one, many }) => ({
    coupon: one(coupons, {
      fields: [couponPatches.couponId],
      references: [coupons.id],
    }),
    orders: many(orders),
  }),
);

export type CouponPatch = typeof couponPatches.$inferSelect;
