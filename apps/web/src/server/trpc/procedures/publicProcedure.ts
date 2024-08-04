import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { findUserById } from '@server/utils/server';

import { t } from '../instance';

export const userMiddleware = t.middleware(async ({ next, ctx }) => {
  const { authContent, cartId } = await getSessionFromCookies();

  return next({
    ctx: {
      sessionData: {
        cartId,
        userId: authContent?.userId,
        ...(authContent?.userId && {
          user: await findUserById(authContent.userId),
        }),
      },
    },
  });
});

/**
 * Protected procedure
 **/
export const publicProcedure = t.procedure.use(userMiddleware);
