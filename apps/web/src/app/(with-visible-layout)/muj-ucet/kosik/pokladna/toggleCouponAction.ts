'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { userCarts } from '@najit-najist/database/models';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
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
    }),
  )
  .refine(
    (coupon): coupon is NonNullable<typeof coupon> =>
      !!coupon && !isCouponExpired(coupon) && !!coupon.enabled,
    'Kupón byl již expirován nebo ho již nevedeme',
  );

export const toggleCouponAction = async (input: { name?: string }) => {
  const session = await getSessionFromCookies();
  const cart = session.cartId
    ? await getUserCart({ type: 'cart', value: session.cartId })
    : null;

  if (!cart) {
    logger.warn(
      '[PRECHECKOUT] User tried to pick coupon, but has no items in cart. This is probably bug',
      { session },
    );

    throw new Error('Žádné produkty v košíku');
  }

  if (!cart.coupon || (input.name && cart.coupon.name !== input.name)) {
    const validated = await schema.safeParseAsync(input);

    if (!validated.success) {
      const errors = zodErrorToFormErrors(validated.error.errors, true);

      if (errors['']) {
        errors['root'] = { ...errors[''] };
        delete errors[''];
      }

      logger.warn('[PRECHECKOUT] User tried to pick invalid coupon', {
        errors,
        input,
        session,
      });

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

    return null;
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
