'use server';

import { database } from '@najit-najist/database';
import { UserStates } from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { userProfileLogInInputSchema } from '@server/schemas/userProfileLogInInputSchema';
import { PasswordService } from '@server/services/Password.service';
import { UserService } from '@server/services/UserService';
import { setSessionToCookies } from '@server/utils/setSessionToCookies';
import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { cookies } from 'next/headers';
import { z } from 'zod';

const inputValidation = userProfileLogInInputSchema.superRefine(
  async (input, ctx) => {
    const userForInput = await database.query.users.findFirst({
      where: (s, { eq }) => eq(s.email, input.email),
    });
    const validPassword = userForInput
      ? await PasswordService.validate(userForInput._password, input.password)
      : false;

    if (userForInput?.status === UserStates.SUBSCRIBED) {
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message:
          'Děkujeme za Váš zájem na našem prvním webu! Při spuštění nového webu jsme Vám zaslali pozvánku na které byl odkaz pro dokončení registrace. Pokud email již nenaleznete tak otevřete odkaz "Zapomenuté heslo?" na této stránce a pokračujte dále podle instrukcí',
        path: ['root'],
      });

      logger.warn(
        { email: input.email },
        'Subscribed user tried to login, but we showed message'
      );

      return;
    }

    if (!userForInput || !validPassword) {
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message: 'Nesprávné přihlašovací údaje',
        path: ['email'],
      });
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message: 'Nesprávné přihlašovací údaje',
        path: ['password'],
      });
      logger.warn(
        { email: input.email },
        userForInput
          ? 'User gave invalid credentials'
          : 'User tried to log in under non existing email'
      );
    } else {
      if (userForInput.status === UserStates.INVITED) {
        logger.warn({ email: input.email }, 'Unverified user tried to log in');

        ctx.addIssue({
          code: 'custom',
          fatal: true,
          message: 'Váš učet ještě není aktivován, dokončete registraci',
          path: ['root'],
        });
      } else if (userForInput.status === UserStates.BANNED) {
        logger.warn(
          { email: input.email, status: userForInput.status },
          'User banned tried to log in'
        );

        ctx.addIssue({
          code: 'custom',
          fatal: true,
          message:
            'Váš účet byl zablokován. Pokud si myslíte, že se jedná o chybu tak nás neváhejte kontaktovat',
          path: ['root'],
        });
      } else if (userForInput.status === UserStates.DEACTIVATED) {
        logger.warn(
          { email: input.email, status: userForInput.status },
          'User deactivated tried to log in'
        );

        ctx.addIssue({
          code: 'custom',
          fatal: true,
          message: 'Účet pod uvedeným emailem již nevedeme.',
          path: ['root'],
        });
      }
    }
  }
);

export type LoginActionOptions = z.input<typeof inputValidation>;

export async function loginAction(options: LoginActionOptions) {
  const validatedInput = await inputValidation.safeParseAsync(options);

  if (!validatedInput.success) {
    logger.warn(
      {
        input: {
          email: options.email,
        },
        errors: validatedInput.error.format(),
      },
      'User failed to log in, but tried'
    );

    return {
      errors: zodErrorToFormErrors(validatedInput.error.errors, true),
    };
  }

  try {
    const user = await UserService.forUser({
      email: validatedInput.data.email,
    });

    logger.info(
      { email: validatedInput.data.email },
      'User successfully logged in'
    );

    // No need to wait
    user
      .update({
        lastLoggedIn: new Date(),
      })
      .catch((error) =>
        logger.error(
          { email: validatedInput.data.email, error },
          'Cannot update user lastLoggedIn'
        )
      );

    // add user token to session
    await setSessionToCookies(
      {
        // TODO: This should be removed after release
        previewAuthorized: true,
        authContent: {
          userId: user.getFor().id,
        },
      },
      cookies()
    );

    return {
      errors: null,
    };
  } catch (error) {
    logger.error({ error, validatedInput }, 'Fatal fail during login');

    throw error;
  }
}
