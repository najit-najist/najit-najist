'use server';

import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { UserRoles } from '@najit-najist/database/models';
import { ProfileService } from '@server/services/Profile.service';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { omit } from 'es-toolkit';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createUserValidationSchema } from './validationSchema';

export const createUserAction = createActionWithValidation(
  createUserValidationSchema.superRefine(async (values, ctx) => {
    const existingUser = await database.query.users.findFirst({
      where: (s, { eq }) => eq(s.email, values.email.toLowerCase()),
    });

    if (existingUser) {
      ctx.addIssue({
        code: 'custom',
        message: 'Uživatel pod tímto emailem již existuje',
        path: ['email'],
      });
    }
  }),
  async (input) => {
    const loggedInUser = await getLoggedInUser();

    if (loggedInUser.role !== UserRoles.ADMIN) {
      logger.error('[USERS] ineligible user tried to create user');
      throw new Error('Not authorized');
    }

    // TODO: Require telephone!!!!!
    const user = await ProfileService.registerOne(input as any);

    logger.info('[USERS] new user created', {
      user: omit(user, ['_password']),
      input: omit(input, ['password']),
    });

    revalidatePath('/administrace');
    revalidatePath('/administrace/uzivatele');

    redirect(`/administrace/uzivatele/${user.id}`);

    return {};
  },
);
