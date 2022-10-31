import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { Context } from '../plugins/trpc/context';

/**
 * Creates a trpc router
 */
export const createTrpcRouter = () =>
  trpc.router<Context>().middleware(async ({ ctx, next }) => {
    if (
      !ctx.user ||
      (ctx.user.role !== 'ADMIN' && ctx.user.role !== 'BROKER')
    ) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next();
  });
