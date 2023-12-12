import { isTokenExpired } from '@najit-najist/pb';
import { AuthService } from '@services';
import {
  deserializePocketToken,
  getLoggedInUser,
  getSessionFromCookies,
} from '@utils';

import { t } from '../instance';

export const userMiddleware = t.middleware(async ({ next, ctx }) => {
  const session = await getSessionFromCookies();

  if (session.authContent && !isTokenExpired(session.authContent.token)) {
    const result = deserializePocketToken(session.authContent.token);
    await AuthService.authPocketBase({ authContent: session.authContent });

    return next({
      ctx: {
        sessionData: {
          userId: result.id,
          authModel: result.collectionId,
          user: await getLoggedInUser({ authenticateApi: false }),
          token: session.authContent.token,
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
