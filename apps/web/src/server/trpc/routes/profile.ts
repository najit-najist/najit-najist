import { PostgresErrorCodes } from '@custom-types/PostgresErrorCodes';
import { database } from '@najit-najist/database';
import { UserStates } from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { PasswordService } from '@server/services/Password.service';
import { ProfileService } from '@server/services/Profile.service';
import { UserService, UserWithRelations } from '@server/services/UserService';
import { t } from '@server/trpc';
import { passwordResetRequest } from '@server/utils/passwordResetRequest';
import { TRPCError } from '@trpc/server';
import omit from 'lodash/omit';
import { DatabaseError } from 'pg';
import { z } from 'zod';

import { privateUserOutputSchema } from '../../schemas/privateUserOutputSchema';
import {
  finalizeResetPasswordSchema,
  resetPasswordSchema,
} from '../../schemas/userProfileResetPasswordInputSchema';
import { userProfileUpdateInputSchema } from '../../schemas/userProfileUpdateInputSchema';
import { userRegisterInputSchema } from '../../schemas/userRegisterInputSchema';
import { verifyRegistrationFromPreviewInputSchema } from '../../schemas/verifyRegistrationFromPreviewInputSchema';
import { protectedProcedure } from '../procedures/protectedProcedure';
import { userCartRoutes } from './profile/cart/cart';
import { userLikedRoutes } from './profile/liked';

const passwordResetRoutes = t.router({
  do: t.procedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      let forUser: UserWithRelations;

      try {
        forUser = await UserService.getOneBy('email', input.email);
      } catch (error) {
        logger.error(
          { input, error },
          'User tried to reset password but no user has been found under email'
        );

        return null;
      }

      if (
        forUser.status !== UserStates.ACTIVE &&
        forUser.status !== UserStates.PASSWORD_RESET &&
        forUser.status !== UserStates.SUBSCRIBED
      ) {
        logger.error(
          { input },
          'User tried to reset password but its not active or in password reset mode'
        );
        throw new Error(
          'Váš účet nemůže resetovat heslo jelikož není dokončená registrace nebo byl Váš účet zablokován'
        );
      }

      if (forUser.status === UserStates.SUBSCRIBED) {
        logger.warn({ input }, 'Subscribed user reset their password');
      }

      const result = await passwordResetRequest(forUser);

      return result;
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

      return {
        ...user,
        newsletter: !!user.newsletter?.enabled,
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
            input: omit(input, ['password']),
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
