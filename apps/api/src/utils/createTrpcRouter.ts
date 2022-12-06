import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { Context } from '../plugins/trpc/context';

/**
 * Creates a trpc router
 */
export const createTrpcRouter = () =>
  trpc.router<Context>().middleware(async ({ ctx, next }) => {
    return next();
  });
