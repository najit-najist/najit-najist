import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import {
  appRouter,
  AuthService,
  createContext,
} from '@najit-najist/api/server';
import { NextRequest } from 'next/server';

function handler(request: NextRequest) {
  const res = fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  }).then((resp) => {
    AuthService.clearAuthPocketBase();

    return resp;
  });

  return res;
}

export const GET = handler;
export const POST = handler;
