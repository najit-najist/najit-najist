import { UserRoles } from '@schemas';
import { TRPCError } from '@trpc/server';
import { getSessionFromCookies, setSessionToCookies } from '@utils';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { t } from '../instance';
import { userMiddleware } from './publicProcedure';

const UNAUTHORIZED_ERROR = new TRPCError({
  code: 'UNAUTHORIZED',
});

export const isAuthed = userMiddleware.unstable_pipe(async ({ next, ctx }) => {
  const session = await getSessionFromCookies();

  if (!ctx.sessionData) {
    // If token is expired then its probably good idea to destroy auth session and return unauthorized
    setSessionToCookies(
      { ...session, authContent: undefined },
      new ResponseCookies(ctx.resHeaders)
    );

    throw UNAUTHORIZED_ERROR;
  }

  return next({
    ctx,
  });
});

export const isAuthedAdmin = isAuthed.unstable_pipe(({ next, ctx }) => {
  if (ctx.sessionData.user.role !== UserRoles.ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next();
});

export const onlyAdminProcedure = t.procedure.use(isAuthedAdmin);

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
