import { PostgresErrorCodes } from '@custom-types/PostgresErrorCodes';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { UserStates } from '@najit-najist/database/models';
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
import { userRegisterInputSchema } from '../../schemas/userRegisterInputSchema';
import { verifyRegistrationFromPreviewInputSchema } from '../../schemas/verifyRegistrationFromPreviewInputSchema';
import { protectedProcedure } from '../procedures/protectedProcedure';
import { userCartRoutes } from './profile/cart/cart';
import { userLikedRoutes } from './profile/liked';

const passwordResetRoutes = t.router({
  do: t.procedure.input(resetPasswordSchema).mutation(async ({ input }) => {
    let forUser: UserWithRelations;

    try {
      forUser = await UserService.getOneBy('email', input.email);
    } catch (error) {
      logger.error(
        '[FORGOTTEN_PASSWORD] User tried to reset password but no user has been found under email',
        { input, error },
      );

      return null;
    }

    if (
      forUser.status !== UserStates.ACTIVE &&
      forUser.status !== UserStates.PASSWORD_RESET &&
      forUser.status !== UserStates.SUBSCRIBED
    ) {
      logger.error(
        '[FORGOTTEN_PASSWORD] User tried to reset password but its not active or in password reset mode',
        { input },
      );
      throw new Error(
        'Váš účet nemůže resetovat heslo jelikož není dokončená registrace nebo byl Váš účet zablokován',
      );
    }

    if (forUser.status === UserStates.SUBSCRIBED) {
      logger.warn('[FORGOTTEN_PASSWORD] Subscribed user reset their password', {
        input,
      });
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
        logger.error('[FORGOTTEN_PASSWORD] fail', { error });

        throw error;
      }

      logger.info('[FORGOTTEN_PASSWORD] success');

      return null;
    }),
});

export const profileRouter = t.router({
  liked: userLikedRoutes,
  cart: userCartRoutes,

  me: protectedProcedure
    .output(privateUserOutputSchema)
    .query(async ({ ctx }) => {
      const user = await UserService.getOneBy('id', ctx.sessionData.user.id);

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
        const user = await ProfileService.registerOne({
          ...input,
          assignCartId: ctx.sessionData?.cartId,
        });

        logger.info('[REGISTER] user created', {
          user: omit(user, ['_password']),
          input: omit(input, ['password']),
        });

        return {
          email: user.email,
        };
      } catch (error) {
        logger.error('[REGISTER] failed', { error });

        if (
          error instanceof DatabaseError &&
          error.code === PostgresErrorCodes.DUPLICATE_KEY
        ) {
          logger.error('[REGISTER] user already exists', {
            error,
            email: input.email,
          });

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
          input.token,
        );
        await user.finishRegistration();

        logger.info('[REGISTER/VERIFY] fiinished');

        return true;
      } catch (error) {
        logger.error('[REGISTER/VERIFY] failed');

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
