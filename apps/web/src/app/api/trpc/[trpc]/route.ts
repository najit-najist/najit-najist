import {
  appRouter,
  AuthService,
  createContext,
  logger,
} from '@najit-najist/api/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

function handler(request: NextRequest) {
  const res = fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
    onError({ type, error, path, ctx }) {
      const { userId } = ctx?.sessionData ?? {};
      logger.error(
        {
          type,
          error,
          path,
          userId,
        },
        'An error happened in TRPC handlers'
      );
    },
  }).then((resp) => {
    AuthService.clearAuthPocketBase();

    return resp;
  });

  return res;
}

export const GET = handler;
export const POST = handler;
