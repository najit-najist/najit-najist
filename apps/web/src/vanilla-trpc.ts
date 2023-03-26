import { AppRouter, serverPort } from '@najit-najist/api';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { headers as getHeaders } from 'next/headers';
import SuperJSON from 'superjson';

export const getClient = (
  params?: Pick<Parameters<typeof httpBatchLink>[0], 'headers' | 'fetch'>
) => {
  const headersStore = getHeaders();

  return createTRPCProxyClient<AppRouter>({
    transformer: SuperJSON,
    links: [
      httpBatchLink({
        url: new URL('/api/trpc', `http://127.0.0.1:${serverPort}`).toString(),
        headers: {
          cookie:
            headersStore.get('cookie') ??
            headersStore.get('Cookie') ??
            undefined,
        },
        ...params,
      }),
    ],
  });
};
