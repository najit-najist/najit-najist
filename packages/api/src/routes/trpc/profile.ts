import { logger } from '@logger';
import { database } from '@najit-najist/database';
import { UserRoles, UserStates, users } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { passwordZodSchema } from '@najit-najist/security';
import { ProfileService } from '@services/Profile.service';
import { UserService, UserWithRelations } from '@services/UserService';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { TRPCError } from '@trpc/server';
import { setSessionToCookies } from '@utils';
import { eq } from 'drizzle-orm';
import omit from 'lodash/omit';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { DatabaseError } from 'pg';
import { z } from 'zod';

import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { privateUserOutputSchema } from '../../schemas/privateUserOutputSchema';
import { userProfileLogInInputSchema } from '../../schemas/userProfileLogInInputSchema';
import {
  finalizeResetPasswordSchema,
  resetPasswordSchema,
} from '../../schemas/userProfileResetPasswordInputSchema';
import { userProfileUpdateInputSchema } from '../../schemas/userProfileUpdateInputSchema';
import { userRegisterInputSchema } from '../../schemas/userRegisterInputSchema';
import { verifyRegistrationFromPreviewInputSchema } from '../../schemas/verifyRegistrationFromPreviewInputSchema';
import { PasswordService } from '../../server';
import { PostgresErrorCodes } from '../../types/PostgresErrorCodes';
import { userCartRoutes } from './profile/cart/cart';
import { userLikedRoutes } from './profile/liked';

const INVALID_CREDENTIALS_ERROR = new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid credentials',
});

const passwordResetRoutes = t.router({
  do: t.procedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await UserService.getOneBy('email', input.email);

        await ProfileService.forUser(user).resetPassword();
      } catch (error) {
        logger.error({ input, error }, 'Request user password reset failed');

        if (error instanceof EntityNotFoundError) {
          return null;
        }

        throw error;
      }

      logger.info(input, 'Request user password reset done');

      return null;
    }),
  finalize: t.procedure
    .input(finalizeResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const profileServiceForToken =
          await ProfileService.getUserForPasswordResetToken(input.token);

        await profileServiceForToken.finalizePasswordReset(input.password);
      } catch (error) {
        logger.error({ error }, 'User password reset finalize failed');

        throw error;
      }

      logger.info({}, 'User password reset finalize done');

      return null;
    }),
});

export const profileRouter = t.router({
  liked: userLikedRoutes,
  cart: userCartRoutes,

  update: protectedProcedure
    .input(userProfileUpdateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await UserService.forUser({ id: ctx.sessionData.userId });

      await user.update(input);
    }),

  me: protectedProcedure
    .output(privateUserOutputSchema)
    .query(async ({ ctx }) => {
      const user = await UserService.getOneBy('id', ctx.sessionData.userId);

      const newsletter = await database.query.userNewsletters.findFirst({
        where: (schema, { eq }) => eq(schema.email, user.email),
      });

      return {
        ...user,
        newsletter: !!newsletter?.enabled,
      };
    }),

  login: t.procedure
    .input(userProfileLogInInputSchema)
    .mutation(async ({ ctx, input }) => {
      let user: UserWithRelations | undefined;

      try {
        user = await UserService.getOneBy('email', input.email);
      } catch (error) {
        logger.info(
          { email: input.email, error },
          'User invalid credentials - invalid email'
        );

        throw INVALID_CREDENTIALS_ERROR;
      }

      const validCredentials = await PasswordService.validate(
        user._password,
        input.password
      );

      if (!validCredentials || !user) {
        logger.info(
          { email: input.email, isUser: !!user, validCredentials },
          'User invalid credentials'
        );

        throw INVALID_CREDENTIALS_ERROR;
      }

      if (user.status === UserStates.INVITED) {
        logger.info({ email: input.email }, 'Unverified user tried to log in');

        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Váš učet ještě není aktivován',
        });
      }

      if (
        user.status === UserStates.BANNED ||
        user.status === UserStates.DEACTIVATED
      ) {
        logger.info(
          { email: input.email, status: user.status },
          'User banned or deactivated tried to log in'
        );

        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Váš účet je deaktivován nebo byl zablokován',
        });
      }

      logger.info({ email: input.email }, 'User successfully logged in');

      try {
        await (
          await UserService.forUser(user)
        ).update({
          lastLoggedIn: new Date(),
        });
      } catch (error) {
        logger.error(
          { email: input.email, error },
          'Cannot update user lastLoggedIn'
        );
      }

      // add user token to session
      await setSessionToCookies(
        {
          // TODO: This should be removed after release
          previewAuthorized: true,
          authContent: {
            userId: user.id,
          },
        },
        new ResponseCookies(ctx.resHeaders)
      );

      return {
        id: user.id,
        email: user.email,
      };
    }),

  register: t.procedure
    .input(userRegisterInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.sessionData?.authContent?.userId) {
        throw new Error('Před registrací se odhlaste');
      }

      try {
        const user = await ProfileService.registerOne(input);

        logger.info(
          {
            user: omit(user, ['_password']),
            input: omit(input, ['_password']),
          },
          'Registering user - user created'
        );

        return {
          email: user.email,
        };
      } catch (error) {
        logger.error(error, 'Registering user - failed');

        if (
          error instanceof DatabaseError &&
          error.code === PostgresErrorCodes.DUPLICATE_KEY
        ) {
          logger.error(
            { error, email: input.email },
            'Registering user - user already exists'
          );

          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Uživatel pod tímto emailem už existuje',
          });
        }

        throw error;
      }
    }),

  passwordReset: passwordResetRoutes,

  verifyRegistration: t.procedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ProfileService.getOneUserForRegisterToken(
          input.token
        );
        await user.finishRegistration();

        logger.info({}, 'Registering user - verify - finished');

        return true;
      } catch (error) {
        logger.error(error, 'Registering user - verify - error');

        throw error;
      }
    }),

  verifyRegistrationFromPreview: t.procedure
    .input(verifyRegistrationFromPreviewInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { address, password, token } = input;

      const previewSubscriber =
        await database.query.previewSubscriberTokens.findFirst({
          where: (schema, { eq }) => eq(schema.token, token),
          with: {
            forUser: true,
          },
        });

      if (!previewSubscriber || !previewSubscriber.forUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      if (previewSubscriber.forUser.status !== UserStates.INVITED) {
        throw new Error('Uživatel je již aktivován');
      }

      const user = await UserService.forUser({
        id: previewSubscriber.forUser.id,
      });

      user.update({
        address: {
          ...address,
          municipalityId: address.municipality.id,
        },
        _password: await PasswordService.hash(password),
        status: UserStates.ACTIVE,
      });

      return null;
    }),
});
