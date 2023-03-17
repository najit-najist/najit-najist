import {
  ErrorCodes,
  PocketbaseCollections,
  User,
  UserStates,
} from '@custom-types';
import { t } from '@lib';
import { protectedProcedure } from '../../plugins/trpc/procedures';
import {
  getMeOutputSchema,
  loginInputSchema,
  loginOutputSchema,
  registerInputSchema,
} from '@schemas';
import { TRPCError } from '@trpc/server';
import { ClientResponseError } from '@najit-najist/pb';
import { config } from '@config';
import { ApplicationError } from '@errors';
import { z } from 'zod';

const INVALID_CREDENTIALS_ERROR = new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid credentials',
});

export const profileRouter = t.router({
  me: protectedProcedure.output(getMeOutputSchema).query(async ({ ctx }) => {
    return ctx.pb.collection('users').getOne<User>(ctx.sessionData.userId, {});
  }),
  login: t.procedure
    .input(loginInputSchema)
    .output(loginOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { pb } = ctx;
      let user: (User & { verified?: boolean }) | undefined;

      try {
        // Try to log in
        const { record } = await pb
          .collection('users')
          .authWithPassword<NonNullable<typeof user>>(
            input.email,
            input.password
          );

        user = record;
      } catch (e) {
        throw INVALID_CREDENTIALS_ERROR;
      }

      const { isValid, token } = pb.authStore;

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
      ctx.session.userToken = token;

      return {
        token,
      };
    }),
  register: t.procedure
    .input(registerInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { services } = ctx;
      await config.pb.loginWithAccount(ctx.pb, 'contactForm');

      try {
        const user = await services.user.create(input, true);
        ctx.pb.authStore.clear();

        return {
          email: user.email,
        };
      } catch (error) {
        ctx.pb.authStore.clear();

        ctx.log.error(error, 'An error happened during user registration');

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
        await ctx.pb
          .collection(PocketbaseCollections.USERS)
          .confirmVerification(input.token);

        return true;
      } catch (error) {
        ctx.log.error(
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
