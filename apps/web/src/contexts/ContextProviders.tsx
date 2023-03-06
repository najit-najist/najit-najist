'use client';

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { trpc } from '../trpc';
import SuperJSON from 'superjson';
import { httpBatchLink } from '@trpc/client';

export const ContextProviders: FC<PropsWithChildren & { cookies?: string }> = ({
  children,
  cookies,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            suspense: true,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url:
            typeof window === 'undefined'
              ? new URL('/trpc', process.env.API_ORIGIN).toString()
              : '/api/trpc',
          headers: {
            cookie: cookies,
          },
        }),
      ],
    })
  );

  useEffect(() => {
    console.log('trpc client changed');
  }, [trpcClient]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
