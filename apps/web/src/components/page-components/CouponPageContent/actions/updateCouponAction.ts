'use server';

import { DEFAULT_TIMEZONE, dayjs } from '@dayjs';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import {
  couponPatches,
  coupons,
  couponsForProductCategories,
  couponsForProducts,
} from '@najit-najist/database/models';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { isDatabaseDuplicateError } from '@server/utils/isDatabaseDuplicateError';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';

import { updateCouponSchema } from '../schemas/updateCouponSchema';

export const updateCouponAction = createActionWithValidation(
  z.object({ id: z.number(), values: updateCouponSchema }),
  async ({ id, values }) => {
    const coupon = await database.query.coupons.findFirst({
      where: (s, { eq }) => eq(s.id, id),
    });

    if (!coupon) {
      notFound();
    }

    try {
      await database.transaction(async (sql) => {
        await sql
          .update(coupons)
          .set({
            name: values.name,
            validFrom:
              values.validFrom !== undefined
                ? values.validFrom
                  ? dayjs.tz(values.validFrom, DEFAULT_TIMEZONE).toDate()
                  : null
                : undefined,
            validTo:
              values.validTo !== undefined
                ? values.validTo
                  ? dayjs.tz(values.validTo, DEFAULT_TIMEZONE).toDate()
                  : null
                : undefined,
            enabled: values.enabled,
            updatedAt: new Date(),
            minimalProductCount:
              values.minimalProductCount === null
                ? 0
                : values.minimalProductCount,
          })
          .where(eq(coupons.id, id));

        if (
          values.reductionPercentage !== undefined ||
          values.reductionPrice !== undefined
        ) {
          await sql.insert(couponPatches).values({
            couponId: id,
            reductionPercentage: values.reductionPercentage,
            reductionPrice: values.reductionPrice,
          });
        }

        if (values.onlyForCategories) {
          await sql
            .delete(couponsForProductCategories)
            .where(eq(couponsForProductCategories.couponId, id));

          if (values.onlyForCategories.length) {
            await sql.insert(couponsForProductCategories).values(
              values.onlyForCategories.map((selectedCategory) => ({
                couponId: id,
                categoryId: selectedCategory.id,
              }))
            );
          }
        }

        if (values.onlyForProducts) {
          await sql
            .delete(couponsForProducts)
            .where(eq(couponsForProducts.couponId, id));

          if (values.onlyForProducts.length) {
            await sql.insert(couponsForProducts).values(
              values.onlyForProducts.map((selectedProduct) => ({
                couponId: id,
                productId: selectedProduct.id,
              }))
            );
          }
        }
      });
    } catch (error) {
      if (isDatabaseDuplicateError(error)) {
        return {
          errors: {
            name: {
              type: 'validate',
              message: 'Kupón s tímto názvem již existuje',
            },
          } as Record<string, FieldError>,
        };
      }

      throw error;
    }

    revalidatePath('/administrace/kupony');
    redirect(`/administrace/kupony/${id}`);
  }
);
