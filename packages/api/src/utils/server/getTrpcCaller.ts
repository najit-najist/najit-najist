import { appRouter } from '@trpc';
import { headers } from 'next/headers';

export const getTrpcCaller = () => {
  return appRouter.createCaller({
    resHeaders: headers(),
    sessionData: undefined,
  });
};
