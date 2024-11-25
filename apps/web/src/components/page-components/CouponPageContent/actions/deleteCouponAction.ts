'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { coupons, UserRoles } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteCouponAction = createActionWithValidation(
  z.object({ id: z.number() }),
  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

    const coupon = await database.query.coupons.findFirst({
      where: (s, { eq }) => eq(s.id, input.id),
      with: {
        patches: {
          with: {
            orders: {
              limit: 1,
            },
          },
        },
      },
    });

    if (!coupon) {
      notFound();
    }

    const wasUsedInOrder = coupon.patches.some(({ orders }) => orders.length);

    if (wasUsedInOrder) {
      logger.error(
        { coupon: { id: coupon.id } },
        'Tried to delete coupon but it was used',
      );

      notFound();
    }

    await database.delete(coupons).where(eq(coupons.id, coupon.id));

    revalidatePath('/administrace/kupony');
    redirect('/administrace/kupony');

    return null;
  },
);
