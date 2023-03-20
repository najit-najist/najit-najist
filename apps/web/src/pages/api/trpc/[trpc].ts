import { NextApiRequest, NextApiResponse } from 'next';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import {
  appRouter,
  withApiRoute,
  createContext,
} from '@najit-najist/api/server';

const handler = withApiRoute((req: NextApiRequest, res: NextApiResponse) => {
  // Let the tRPC handler do its magic
  return createNextApiHandler({
    router: appRouter,
    createContext,
  })(req, res);
});

export default handler;
