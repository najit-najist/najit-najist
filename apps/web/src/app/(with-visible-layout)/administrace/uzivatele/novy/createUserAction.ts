'use server';

import { database } from '@najit-najist/database';
import { logger } from '@server/logger';
import { ProfileService } from '@server/services/Profile.service';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import omit from 'lodash/omit';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createUserValidationSchema } from './validationSchema';

export const createUserAction = createActionWithValidation(
  createUserValidationSchema.superRefine(async (values, ctx) => {
    const existingUser = await database.query.users.findFirst({
      where: (s, { eq }) => eq(s.email, values.email),
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
    // TODO: Require telephone!!!!!
    const user = await ProfileService.registerOne(input as any);

    logger.info(
      {
        user: omit(user, ['_password']),
        input: omit(input, ['password']),
      },
      'Registering user - user created'
    );

    revalidatePath('/administrace');
    revalidatePath('/administrace/uzivatele');

    redirect(`/administrace/uzivatele/${user.id}`);

    return;
  }
);
