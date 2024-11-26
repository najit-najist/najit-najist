'use server';

import { DEFAULT_TIMEZONE, dayjs } from '@dayjs';
import { database } from '@najit-najist/database';
import {
  couponPatches,
  coupons,
  couponsForProductCategories,
  couponsForProducts,
} from '@najit-najist/database/models';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { isDatabaseDuplicateError } from '@server/utils/isDatabaseDuplicateError';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { FieldError } from 'react-hook-form';

import { createCouponSchema } from '../schemas/createCouponSchema';

export const createCouponAction = createActionWithValidation(
  createCouponSchema,
  async (input) => {
    let createdId: number;

    try {
      createdId = await database.transaction(async (sql) => {
        const [created] = await sql
          .insert(coupons)
          .values({
            name: input.name,
            validFrom: input.validFrom
              ? dayjs.tz(input.validFrom, DEFAULT_TIMEZONE).toDate()
              : null,
            validTo: input.validTo
              ? dayjs.tz(input.validTo, DEFAULT_TIMEZONE).toDate()
              : null,
            enabled: input.enabled ?? true,
            minimalProductCount: input.minimalProductCount ?? 0,
          })
          .returning();

        await sql.insert(couponPatches).values({
          couponId: created.id,
          reductionPercentage: input.reductionPercentage,
          reductionPrice: input.reductionPrice,
        });

        if (input.onlyForCategories?.length) {
          await sql.insert(couponsForProductCategories).values(
            input.onlyForCategories.map((selectedCategory) => ({
              couponId: created.id,
              categoryId: selectedCategory.id,
            })),
          );
        }

        if (input.onlyForProducts?.length) {
          await sql.insert(couponsForProducts).values(
            input.onlyForProducts.map((selectedProduct) => ({
              couponId: created.id,
              productId: selectedProduct.id,
            })),
          );
        }

        return created.id;
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
    redirect(`/administrace/kupony/${createdId}`);
  },
);
