'use server';

import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { products, UserRoles } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { getOneProductBy } from '@server/trpc/routes/products';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteProductAction = createActionWithValidation(
  z.object({ id: z.number() }),
  async (input) => {
    const user = await getLoggedInUser();

    if (user.role !== UserRoles.ADMIN) {
      throw new InsufficientRoleError();
    }

    const existing = await getOneProductBy('id', input.id);

    await database.delete(products).where(eq(products.id, input.id));

    revalidatePath(`/produkty/${encodeURIComponent(existing.slug)}`);
    revalidatePath('/administrace/produkty');
    revalidatePath(`/produkty`);
    redirect('/administrace/produkty');

    return;
  },
);
