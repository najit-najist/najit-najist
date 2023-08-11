import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { t } from '@trpc';
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
} from '@schemas';
import { TRPCError } from '@trpc/server';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { config } from '@config';
import { ApplicationError } from '@errors';
import { z } from 'zod';
import { logger } from '@logger';
import { protectedProcedure } from '@trpc-procedures/protectedProcedure';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { AvailableModels, setSessionToCookies } from '@utils';
import { AuthService, UserService } from '@services';
import { userLikedRoutes } from './profile/liked';

const INVALID_CREDENTIALS_ERROR = new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid credentials',
});

const passwordResetRoutes = t.router({
  do: t.procedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      await pocketbase
        .collection(AvailableModels.USER)
        .requestPasswordReset(input.email);

      return null;
    }),
  finalize: t.procedure
    .input(finalizeResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      await pocketbase
        .collection(AvailableModels.USER)
        .confirmPasswordReset(input.token, input.password, input.password);

      return null;
    }),
});

export const profileRouter = t.router({
  liked: userLikedRoutes,

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
        const { record } = await pocketbase
          .collection(AvailableModels.USER)
          .authWithPassword<User>(input.email, input.password);

        user = record;
      } catch (e) {
        console.log(e);
        throw INVALID_CREDENTIALS_ERROR;
      }

      const { isValid, token, model } = pocketbase.authStore;

      if (!isValid || !user) {
        throw INVALID_CREDENTIALS_ERROR;
      }

      if (!user.verified) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Váš učet ještě není aktivován',
        });
      }

      if (
        user.status === UserStates.BANNED ||
        user.status === UserStates.DEACTIVATED
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Váš účet je deaktivován nebo byl zablokován',
        });
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
      await config.pb.loginWithAccount('contactForm');

      try {
        const user = await UserService.create(input, true);
        AuthService.clearAuthPocketBase();

        return {
          email: user.email,
        };
      } catch (error) {
        AuthService.clearAuthPocketBase();

        logger.error(error, 'An error happened during user registration');

        if (error instanceof ClientResponseError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            cause: error,
            message: error.data.data,
          });
        } else if (
          error instanceof ApplicationError &&
          error.code === ErrorCodes.ENTITY_DUPLICATE
        ) {
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
        await pocketbase
          .collection(PocketbaseCollections.USERS)
          .confirmVerification(input.token);

        return true;
      } catch (error) {
        logger.error(
          error,
          'An error happened during user verify registration'
        );

        if (error instanceof ClientResponseError && error.status === 400) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid token',
          });
        }

        throw error;
      }
    }),
});
