import { getSessionFromCookies } from '@utils/getSessionFromCookies';
import { setSessionToCookies } from '@utils/setSessionToCookies';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { UNAUTHORIZED_ERROR } from '../../errors';
import { userMiddleware } from '../publicProcedure';

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
