import { t } from '../instance';
import { TRPCError } from '@trpc/server';
import { isTokenExpired } from '@najit-najist/pb';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import {
  deserializePocketToken,
  getLoggedInUser,
  getSessionFromCookies,
  setSessionToCookies,
} from '@utils';
import { AuthService } from '@services';
import { UserRoles } from '@schemas';

const UNAUTHORIZED_ERROR = new TRPCError({
  code: 'UNAUTHORIZED',
});

export const isAuthed = t.middleware(async ({ next, ctx }) => {
  const session = await getSessionFromCookies();

  if (!session.authContent || isTokenExpired(session.authContent.token)) {
    // If token is expired then its probably good idea to destroy auth session and return unauthorized
    setSessionToCookies(
      { ...session, authContent: undefined },
      new ResponseCookies(ctx.resHeaders)
    );

    throw UNAUTHORIZED_ERROR;
  }

  const result = deserializePocketToken(session.authContent.token);
  await AuthService.authPocketBase({ authContent: session.authContent });

  return next({
    ctx: {
      sessionData: {
        userId: result.id,
        authModel: result.collectionId,
        user: await getLoggedInUser({ authenticateApi: false }),
      },
    },
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
