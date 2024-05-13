import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { findUserById } from '@server/utils/server';

import { t } from '../instance';

export const userMiddleware = t.middleware(async ({ next, ctx }) => {
  const session = await getSessionFromCookies();

  if (session.authContent) {
    return next({
      ctx: {
        sessionData: {
          ...session.authContent,
          user: await findUserById(session.authContent.userId),
        },
      },
    });
  }

  return next();
});

/**
 * Protected procedure
 **/
export const publicProcedure = t.procedure.use(userMiddleware);
