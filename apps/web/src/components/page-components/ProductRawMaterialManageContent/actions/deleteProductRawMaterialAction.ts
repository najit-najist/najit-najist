'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import {
  coupons,
  productRawMaterials,
  UserRoles,
} from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteProductRawMaterialAction = createActionWithValidation(
  z.object({ id: z.number() }),
  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

    const item = await database.query.productRawMaterials.findFirst({
      where: (s, { eq }) => eq(s.id, input.id),
      with: {
        partOf: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!item) {
      notFound();
    }

    await database.delete(productRawMaterials).where(eq(coupons.id, item.id));
    logger.info('[MATERIAL] Deleted', { input });

    revalidatePath('/administrace/suroviny');
    for (const { product } of item.partOf) {
      const path = `/produkty/${encodeURIComponent(product.slug)}`;
      revalidatePath(path);
      revalidatePath(`/administrace/${path}`);
    }
    redirect('/administrace/suroviny');

    return null;
  },
);
