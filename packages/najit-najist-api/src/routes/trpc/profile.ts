import {
  ErrorCodes,
  PocketbaseCollections,
  User,
  UserStates,
} from '@custom-types';
import { t } from '@trpc';
import {
  getMeOutputSchema,
  loginInputSchema,
  loginOutputSchema,
  registerInputSchema,
  updateUserInputSchema,
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
import { objectToFormData } from '@utils/internal';

const INVALID_CREDENTIALS_ERROR = new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid credentials',
});

export const profileRouter = t.router({
  update: protectedProcedure
    .input(updateUserInputSchema)
    .output(getMeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return pocketbase
        .collection(AvailableModels.USER)
        .update<User>(ctx.sessionData.userId, await objectToFormData(input));
    }),
  me: protectedProcedure.output(getMeOutputSchema).query(async ({ ctx }) => {
    return pocketbase
      .collection(AvailableModels.USER)
      .getOne<User>(ctx.sessionData.userId, {});
  }),
  login: t.procedure
    .input(loginInputSchema)
    .output(loginOutputSchema)
    .mutation(async ({ ctx, input }) => {
      let user: (User & { verified?: boolean }) | undefined;

      try {
        // Try to log in
        const { record } = await pocketbase
          .collection(AvailableModels.USER)
          .authWithPassword<NonNullable<typeof user>>(
            input.email,
            input.password
          );

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
    .input(registerInputSchema)
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
