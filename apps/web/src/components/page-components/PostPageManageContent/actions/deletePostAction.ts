'use server';

import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { posts } from '@najit-najist/database/models';
import { InsufficientRoleError } from '@server/errors';
import { canUser, UserActions } from '@server/utils/canUser';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const deletePostAction = createActionWithValidation(
  z.object({ id: z.number() }),
  async (input) => {
    const user = await getLoggedInUser();

    if (!canUser(user, UserActions.DELETE, posts)) {
      throw new InsufficientRoleError();
    }

    const existing = await database.query.posts.findFirst({
      where: (schema, { eq }) => eq(schema.id, input.id),
    });

    if (!existing) {
      return notFound();
    }

    await database.delete(posts).where(eq(posts.id, input.id));

    revalidatePath(`/clanky/${encodeURIComponent(existing.slug)}`);
    revalidatePath('/clanky');

    redirect('/clanky');

    return;
  },
);
