import { appRouter } from '@server/trpc';
import { headers } from 'next/headers';

export const getTrpcCaller = () => {
  return appRouter.createCaller({
    resHeaders: headers(),
    sessionData: undefined,
    updateSessionDataValue() {
      throw new Error('Not supported in page components');
    },
  });
};
