import { UNAUTHORIZED_ERROR } from '../../errors';
import { userMiddleware } from '../publicProcedure';

const sessionDataKey = 'sessionData';
const sessionDataUserKey = 'user';
const sessionDataUserIdKey = 'userId';

export const isAuthed = userMiddleware.unstable_pipe(async ({ next, ctx }) => {
  if (!ctx.sessionData.user) {
    if (ctx.sessionData.userId) {
      // If token is expired then its probably good idea to destroy auth session and return unauthorized
      await ctx.updateSessionDataValue('authContent', undefined);
    }

    throw UNAUTHORIZED_ERROR;
  }

  type Context = typeof ctx;
  type ContextSessionData = Context[typeof sessionDataKey];

  return next({
    ctx: ctx as Omit<Context, typeof sessionDataKey> & {
      [sessionDataKey]: Omit<
        ContextSessionData,
        typeof sessionDataUserKey | typeof sessionDataUserIdKey
      > & {
        [sessionDataUserIdKey]: NonNullable<
          ContextSessionData[typeof sessionDataUserIdKey]
        >;
        [sessionDataUserKey]: NonNullable<
          ContextSessionData[typeof sessionDataUserKey]
        >;
      };
    },
  });
});
