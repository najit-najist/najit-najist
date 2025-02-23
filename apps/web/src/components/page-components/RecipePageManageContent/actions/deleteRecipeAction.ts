'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { UserRoles, recipes } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

export const deleteRecipeAction = createActionWithValidation(
  entityLinkSchema,
  async (input) => {
    const loggedInUser = await getLoggedInUser();

    if (loggedInUser.role !== UserRoles.ADMIN) {
      logger.error('[RECIPES] NON ADMIN - tried to delete recipe');
      throw new Error('Not authorized');
    }

    const existing = await database.query.recipes.findFirst({
      where: (s, { eq }) => eq(s.id, input.id),
    });

    if (!existing) {
      notFound();
    }

    await database.delete(recipes).where(eq(recipes.id, input.id));

    logger.info('[RECIPES] Deleted', { input });

    revalidatePath(`/administrace/recepty/${existing.slug}`);
    revalidatePath(`/recepty/${existing.slug}`);
    revalidatePath(`/recepty`);
    revalidatePath(`/administrace`);

    return redirect(`/recepty`);
  },
  {
    onHandlerError(error, input) {
      logger.error('[RECIPES] Could not delete recipe', { error, input });
    },
  },
);
