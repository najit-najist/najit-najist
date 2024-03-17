import { TRPCError } from '@trpc/server';

export const UNAUTHORIZED_ERROR = new TRPCError({
  code: 'UNAUTHORIZED',
});
