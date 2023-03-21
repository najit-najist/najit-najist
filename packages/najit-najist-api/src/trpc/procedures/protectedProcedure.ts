import { t } from '../instance';
import { TRPCError } from '@trpc/server';

const UNAUTHORIZED_ERROR = new TRPCError({
  code: 'UNAUTHORIZED',
});

export const isAuthed = t.middleware(async ({ next, ctx }) => {
  const sessionUserToken = ctx.session.userToken;
  const result = sessionUserToken
    ? ctx.services.token.decode<{
        collectionId: string;
        exp: number;
        id: string;
        type: string;
      }>(sessionUserToken)
    : null;

  if (!sessionUserToken || !result) {
    throw UNAUTHORIZED_ERROR;
  }

  const unixNow = parseInt((new Date().getTime() / 1000).toFixed(0));
  const unixExpiry = result.exp;

  // If token is expired then its probably good idea to destroy session and return unauthorized
  if (unixNow >= unixExpiry) {
    await ctx.session.destroy();

    throw UNAUTHORIZED_ERROR;
  }

  // Load logged in user from session
  ctx.pb.authStore.save(sessionUserToken, {
    id: result.id,
  } as any);

  const nextResult = await next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
      sessionData: {
        userId: result.id,
        token: sessionUserToken,
        authModel: result.collectionId,
      },
    },
  });

  // Clear authed connection to pocketbase
  ctx.pb.authStore.clear();

  return nextResult;
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
