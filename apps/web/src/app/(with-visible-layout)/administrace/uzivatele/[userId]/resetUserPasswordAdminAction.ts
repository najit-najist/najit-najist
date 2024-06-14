'use server';

import { database } from '@najit-najist/database';
import { entityLinkSchema } from '@najit-najist/schemas';
import { UserService } from '@server/services/UserService';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { passwordResetRequest } from '@server/utils/passwordResetRequest';
import { getLoggedInUserId } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

export const resetUserPasswordAdminAction = createActionWithValidation(
  z.object({
    user: entityLinkSchema.transform(async (link) => {
      const loggedInUserId = await getLoggedInUserId();

      return await UserService.queryOneBy((s, { eq, not, and }) =>
        and(eq(s.id, Number(link.id)), not(eq(s.id, loggedInUserId)))
      );
    }),
  }),
  async (input) => {
    const { user } = input;
    if (!user) {
      return notFound();
    }

    await passwordResetRequest(user);

    const pathname = `/administrace/uzivatele/${user.id}`;
    revalidatePath(pathname);
    redirect(pathname);

    return null;
  }
);
