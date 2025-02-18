'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { UserRoles, userAddresses, users } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser, getLoggedInUserId } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteUserAction = createActionWithValidation(
  z.object({
    user: entityLinkSchema.transform(async (link) => {
      const loggedInUserId = await getLoggedInUserId();

      return database.query.users.findFirst({
        where: (s, { eq, not, and }) =>
          and(eq(s.id, Number(link.id)), not(eq(s.id, loggedInUserId))),
      });
    }),
  }),
  async (input) => {
    const { user } = input;
    if (!user) {
      notFound();
    }

    const loggedInUser = await getLoggedInUser();

    if (loggedInUser.role !== UserRoles.ADMIN) {
      logger.error('[USERS] not eligible user tried to delete an user');
      throw new Error('Not authorized');
    }

    const pathname = `/administrace/uzivatele/${user.id}`;
    try {
      await database.transaction(async (tx) => {
        await tx.delete(userAddresses).where(eq(userAddresses.userId, user.id));
        await tx.delete(users).where(eq(users.id, user.id));
      });
    } catch (error) {
      logger.error('[USERS] User cannot be deleted', {
        userId: user.id,
        error,
      });

      redirect(`${pathname}?failed-to-delete`);
    }

    revalidatePath(pathname);

    redirect('/administrace/uzivatele');
    return null;
  },
);
