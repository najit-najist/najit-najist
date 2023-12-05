import { ErrorCodes } from '@custom-types';
import { ApplicationError } from '@errors';
import { logger } from '@logger';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { pocketbaseByCollections } from '@najit-najist/pb';
import {
  finalizeResetPasswordSchema,
  loginInputSchema,
  loginOutputSchema,
  registerUserSchema,
  resetPasswordSchema,
  updateProfileSchema,
  User,
  userSchema,
  UserStates,
  verifyRegistrationFromPreviewInputSchema,
} from '@schemas';
import { AuthService, PreviewSubscribersService, UserService } from '@services';
import { t } from '@trpc';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { TRPCError } from '@trpc/server';
import { AvailableModels, setSessionToCookies } from '@utils';
import { loginWithAccount } from '@utils/pocketbase';
import dayjs from 'dayjs';
import omit from 'lodash/omit';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { z } from 'zod';

import { AUTHORIZATION_HEADER } from '../..';
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
        await pocketbase
          .collection(AvailableModels.USER)
          .requestPasswordReset(input.email);
      } catch (error) {
        logger.info({ input, error }, 'Request user password reset failed');

        throw error;
      }

      logger.info(input, 'Request user password reset done');

      return null;
    }),
  finalize: t.procedure
    .input(finalizeResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await pocketbaseByCollections.users.confirmPasswordReset(
          input.token,
          input.password,
          input.password
        );
      } catch (error) {
        logger.info({ error }, 'User password reset finalize failed');

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
    .input(updateProfileSchema)
    .output(userSchema)
    .mutation(async ({ ctx, input }) =>
      UserService.update({ id: ctx.sessionData.userId }, input)
    ),

  me: protectedProcedure
    .output(userSchema)
    .query(async ({ ctx }) => UserService.getBy('id', ctx.sessionData.userId)),

  login: t.procedure
    .input(loginInputSchema)
    .output(loginOutputSchema)
    .mutation(async ({ ctx, input }) => {
      let user: User | undefined;

      try {
        // Try to log in
        const { record } =
          await pocketbaseByCollections.users.authWithPassword<User>(
            input.email,
            input.password
          );

        user = record;
      } catch (error) {
        logger.info(
          { email: input.email, error },
          'User invalid credentials - invalid email'
        );

        throw INVALID_CREDENTIALS_ERROR;
      }

      const { isValid, token, model } = pocketbase.authStore;

      if (!isValid || !user) {
        logger.info(
          { email: input.email, isUser: !!user, isTokenValid: isValid },
          'User invalid credentials'
        );

        throw INVALID_CREDENTIALS_ERROR;
      }

      if (!user.verified) {
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
        await pocketbaseByCollections.users.update(
          user.id,
          {
            lastLoggedIn: dayjs().utc().format(),
          },
          {
            headers: {
              [AUTHORIZATION_HEADER]: token,
            },
          }
        );
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
            model: {
              collectionId: model?.collectionId,
              username: user.username,
              verified: user.verified,
            },
            token,
          },
        },
        new ResponseCookies(ctx.resHeaders)
      );

      return {
        token,
      };
    }),

  register: t.procedure
    .input(registerUserSchema)
    .mutation(async ({ ctx, input }) => {
      await loginWithAccount('contactForm');

      try {
        const user = await UserService.create(input, true);
        logger.info(
          {
            user: omit(user, ['password']),
            input: omit(input, ['password']),
          },
          'Registering user - user created'
        );
        AuthService.clearAuthPocketBase();

        return {
          email: user.email,
        };
      } catch (error) {
        AuthService.clearAuthPocketBase();

        if (error instanceof ClientResponseError) {
          logger.error(
            { error, email: { ...input, password: undefined } },
            'Registering user - bad request from pocketbase'
          );

          throw new TRPCError({
            code: 'BAD_REQUEST',
            cause: error,
            message: error.data.data,
          });
        } else if (
          error instanceof ApplicationError &&
          error.code === ErrorCodes.ENTITY_DUPLICATE
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

        logger.error(error, 'Registering user - failed');

        throw error;
      }
    }),

  passwordReset: passwordResetRoutes,

  verifyRegistration: t.procedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await pocketbaseByCollections.users.confirmVerification(input.token);

        logger.info({}, 'Registering user - verify - finished');

        return true;
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 400) {
          logger.error(error, 'Registering user - verify - invalid token');

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid token',
          });
        }

        logger.error(error, 'Registering user - verify - error');

        throw error;
      }
    }),

  verifyRegistrationFromPreview: t.procedure
    .input(verifyRegistrationFromPreviewInputSchema)
    .mutation(async ({ ctx, input }) => {
      await PreviewSubscribersService.finishRegistration(input);

      return null;
    }),
});
