import { appRouter, createContext, logger } from '@najit-najist/api/server';
import { pocketbase } from '@najit-najist/pb';
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
          error: {
            ...error,
            message: error.message,
            stack: error.stack,
          },
          path,
          userId,
        },
        'An error happened in TRPC handlers'
      );
    },
  }).then((resp) => {
    pocketbase.authStore.clear();

    return resp;
  });

  return res;
}

export const GET = handler;
export const POST = handler;
