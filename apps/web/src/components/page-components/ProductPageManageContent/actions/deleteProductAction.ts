'use server';

import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { products } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { canUser, UserActions } from '@server/utils/canUser';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getProduct } from '@server/utils/getProduct';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteProductAction = createActionWithValidation(
  z.object({ id: z.number() }),
  async (input) => {
    const user = await getLoggedInUser();

    if (!canUser(user, UserActions.DELETE, products)) {
      throw new InsufficientRoleError();
    }

    const existing = await getProduct(input, {
      loggedInUser: user,
    });
    if (!existing) {
      return notFound();
    }

    await database.delete(products).where(eq(products.id, input.id));

    revalidatePath(`/produkty/${encodeURIComponent(existing.slug)}`);
    revalidatePath('/administrace/produkty');
    revalidatePath(`/produkty`);
    redirect('/administrace/produkty');

    return;
  },
);
