import { getTrpcCaller, t } from '@server/trpc';
import { headers } from 'next/headers';

export const createTrpcCaller = async () =>
  getTrpcCaller({
    resHeaders: await headers(),
    sessionData: undefined,
    updateSessionDataValue() {
      throw new Error('Not supported in page components');
    },
  });
