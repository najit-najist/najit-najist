'use server';

import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { userCarts } from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { getLoggedInUserId } from '@server/utils/server';
import { getUserCart } from '@utils/getUserCart';
import { isCouponExpired } from '@utils/isCouponExpired';
import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string().min(1, { message: 'Zadejte název kupónu' }),
  })
  .transform(async ({ name }) =>
    database.query.coupons.findFirst({
      where: (schema, { eq }) => eq(schema.name, name),
      with: {
        patches: {
          limit: 1,
          orderBy: (schema, { desc }) => desc(schema.createdAt),
        },
        onlyForProductCategories: true,
        onlyForProducts: true,
      },
    })
  )
  .refine(
    (coupon): coupon is NonNullable<typeof coupon> => !!coupon,
    'Kupón pod tímto názvem neznáme'
  )
  .refine(
    (coupon) => !isCouponExpired(coupon) && coupon.enabled,
    'Kupón je již expirován'
  );

export const toggleCouponAction = async (input: { name?: string }) => {
  const loggedInUserId = await getLoggedInUserId();
  const cart = await getUserCart({ id: loggedInUserId });

  if (!cart.coupon || (input.name && cart.coupon.name !== input.name)) {
    const validated = await schema.safeParseAsync(input);

    if (!validated.success) {
      const errors = zodErrorToFormErrors(validated.error.errors, true);

      if (errors['']) {
        errors['root'] = { ...errors[''] };
        delete errors[''];
      }

      logger.warn(
        { errors, input, loggedInUserId },
        'User tried to pick coupon, but validation failed'
      );

      return {
        errors,
      };
    }

    await database
      .update(userCarts)
      .set({
        couponId: validated.data.id,
      })
      .where(eq(userCarts.id, cart.id));

    revalidatePath('/muj-ucet/kosik/pokladna');

    return validated.data;
  } else {
    await database
      .update(userCarts)
      .set({
        couponId: null,
      })
      .where(eq(userCarts.id, cart.id));

    revalidatePath('/muj-ucet/kosik/pokladna');

    return null;
  }
};
