import { logger } from '@logger/server';
import { appRouter } from '@server/trpc';
import { createContext } from '@server/trpc/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

function handler(request: NextRequest) {
  const res = fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
    onError({ type, error, path, ctx }) {
      const { authContent } = ctx?.sessionData ?? {};

      if (path === 'profile.me' && error.message === 'UNAUTHORIZED') {
        return;
      }

      logger.error('[TRPC] An error happened', {
        type,
        error: {
          ...error,
          message: error.message,
          stack: error.stack,
        },
        path,
        userId: authContent?.userId,
      });
    },
  }).then((resp) => {
    return resp;
  });

  return res;
}

export const GET = handler;
export const POST = handler;
