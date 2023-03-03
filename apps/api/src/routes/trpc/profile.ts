import { User } from '@custom-types';
import { t } from '@lib';
import { protectedProcedure } from '../../plugins/trpc/procedures';
import {
  getMeOutputSchema,
  loginInputSchema,
  loginOutputSchema,
  registerInputSchema,
} from '@schemas';
import { TRPCError } from '@trpc/server';

const INVALID_CREDENTIALS_ERROR = new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid credentials',
});

export const profileRouter = t.router({
  me: protectedProcedure.output(getMeOutputSchema).query(async ({ ctx }) => {
    const rsu = await ctx.pb
      .collection('users')
      .getOne<User>(ctx.sessionData.userId, {});

    console.log({ rsu });

    ctx.pb.authStore.clear();

    return rsu;
  }),
  login: t.procedure
    .input(loginInputSchema)
    .output(loginOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { pb } = ctx;
      let user: User | undefined = undefined;

      try {
        // Login
        const { record } = await pb
          .collection('users')
          .authWithPassword<User>(input.email, input.password);

        user = record;
      } catch (e) {
        throw INVALID_CREDENTIALS_ERROR;
      }

      const { isValid, token } = pb.authStore;

      if (!isValid || !user) {
        throw INVALID_CREDENTIALS_ERROR;
      }

      // add user token to session
      ctx.session.userToken = token;

      // "logout" the last authenticated account to prevent impersonation
      pb.authStore.clear();

      return {
        token,
      };
    }),
  register: t.procedure
    .input(registerInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { services } = ctx;

      const user = await services.user.create(input);

      return {
        email: user.email,
      };
    }),
});
