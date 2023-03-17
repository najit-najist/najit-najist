import { AppRouter } from '@najit-najist/api';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';

export const getClient = (
  params?: Pick<Parameters<typeof httpBatchLink>[0], 'headers' | 'fetch'>
) =>
  createTRPCProxyClient<AppRouter>({
    transformer: SuperJSON,
    links: [
      httpBatchLink({
        url: new URL('/trpc', process.env.API_ORIGIN).toString(),
        ...params,
      }),
    ],
  });
